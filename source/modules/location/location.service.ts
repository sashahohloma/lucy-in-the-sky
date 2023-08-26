import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { LocationEntity } from '../../database/entities/location.entity';
import { LocationRepository } from './location.repository';
import { LocationUtils } from './location.utils';
import { ILocationFindParams, ILocationFindPlace } from './models/find.models';
import { ILocationUpdate } from './models/update.models';

@Injectable()
export class LocationService {

    private readonly logger: Logger;
    private readonly locationRepository: LocationRepository;

    constructor(locationRepository: LocationRepository) {
        this.logger = new Logger(LocationService.name);
        this.locationRepository = locationRepository;
    }


    /**
     * @param request.product ID товара для запроса локаций хранения
     * @param request.quantity необходимое количество товара
     *
     * @returns Массив локаций запрошенного товара. Для каждой локации будут указаны:
     * стеллаж-секция, доступное количество товара, необходимое число товара
     */
    public async findProduct(request: ILocationFindParams): Promise<ILocationFindPlace[]> {
        const productEntity = await this.locationRepository.findProductOrNotFound(request.product);

        const total = await this.locationRepository.getTotal(productEntity);
        if (!total || total < request.quantity) {
            throw new BadRequestException(`Too low stocks for product "${productEntity.id}"`);
        }

        const response: ILocationFindPlace[] = [];

        const stream = this.locationRepository.streamByProduct(request.product);
        for await (const entity of stream) {
            const rackID = String(entity.rack?.id ?? entity.rack);
            const sectionID = Number(entity.section?.id ?? entity.section);
            const location = LocationUtils.getID(rackID, sectionID);

            response.push({
                location,
                quantity: entity.quantity,
                order: entity.quantity,
            });

            const sum = response.reduce((acc, i) => acc + i.quantity, 0);
            if (sum >= request.quantity) {
                response[response.length - 1].order -= sum - request.quantity;
                break;
            }
        }

        return response;
    }


    public async incomeProducts(request: ILocationUpdate): Promise<void> {
        try {
            const [rack, section] = LocationUtils.getEntries(request.location);
            const products = request.products.map((p) => p.id);

            const productsEntities = await this.locationRepository.findProducts(products);
            const rackEntity = await this.locationRepository.findRackOrNotFound(rack);
            const sectionEntity = await this.locationRepository.findSectionOrNotFound(+section);

            await this.locationRepository.transaction(async(em) => {
                const previousLocations = await this.locationRepository.findPrevious({
                    rack: rackEntity,
                    section: sectionEntity,
                    products: productsEntities,
                    manager: em,
                });

                this.logger.log(`Read ${previousLocations.length} products from rack "${rackEntity.id}" on section "${sectionEntity.id}"`);
                const payload: DeepPartial<LocationEntity>[] = [];

                for (const prod of request.products) {
                    const productEntity = productsEntities.find((p) => p.id === prod.id);
                    if (!productEntity) {
                        throw new NotFoundException(`Cannot find product ${prod.id}`);
                    }

                    const prevLocation = previousLocations.find((prev) => (
                        prev.rack.id === rackEntity.id &&
                        prev.section.id === sectionEntity.id &&
                        prev.product.id === productEntity.id
                    ));

                    const quantity = prod.quantity + (prevLocation?.quantity ?? 0);
                    this.logger.log(`Set quantity ${quantity} for product "${prod.id}" to rack "${rackEntity.id}" on section "${sectionEntity.id}"`);

                    payload.push({
                        rack: rackEntity,
                        section: sectionEntity,
                        product: productEntity,
                        quantity,
                    });
                }

                await em.upsert(LocationEntity, payload, LocationEntity.uniq);
                this.logger.log(`Write ${payload.length} products to rack "${rackEntity.id}" on section "${sectionEntity.id}"`);
            });
        }
        catch (error) {
            this.logger.error(error);
            throw error;
        }
    }


    public async orderProducts(request: ILocationUpdate): Promise<void> {
        try {
            const [rack, section] = LocationUtils.getEntries(request.location);
            const products = request.products.map((p) => p.id);

            const productsEntities = await this.locationRepository.findProducts(products);
            const sectionEntity = await this.locationRepository.findSectionOrNotFound(+section);
            const rackEntity = await this.locationRepository.findRackOrNotFound(rack);

            await this.locationRepository.transaction(async(em) => {
                const previousLocations = await this.locationRepository.findPrevious({
                    rack: rackEntity,
                    section: sectionEntity,
                    products: productsEntities,
                    manager: em,
                });

                this.logger.log(`Read ${previousLocations.length} products from rack "${rackEntity.id}" on section "${sectionEntity.id}"`);
                const payload: DeepPartial<LocationEntity>[] = [];

                for (const prod of request.products) {
                    const productEntity = productsEntities.find((p) => p.id === prod.id);
                    if (!productEntity) {
                        throw new NotFoundException(`Cannot find product ${prod.id}`);
                    }

                    const prevLocation = previousLocations.find((prev) => (
                        prev.rack.id === rackEntity.id &&
                        prev.section.id === sectionEntity.id &&
                        prev.product.id === productEntity.id
                    ));
                    if (!prevLocation) {
                        throw new NotFoundException(`Cannot find location of product "${prod.id}"`);
                    }

                    const quantity = prevLocation.quantity - prod.quantity;
                    if (quantity < 0) {
                        throw new BadRequestException(`Too low stocks for product "${prod.id}"`);
                    }

                    this.logger.log(`Set quantity ${quantity} for product "${prod.id}" to rack "${rackEntity.id}" on section "${sectionEntity.id}"`);
                    payload.push({
                        rack: rackEntity,
                        section: sectionEntity,
                        product: productEntity,
                        quantity,
                    });
                }

                await em.upsert(LocationEntity, payload, LocationEntity.uniq);
                this.logger.log(`Write ${payload.length} products to rack "${rackEntity.id}" on section "${sectionEntity.id}"`);
            });
        }
        catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

}
