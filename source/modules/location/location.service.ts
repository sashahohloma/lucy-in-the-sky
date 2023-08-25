import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, In, Repository } from 'typeorm';
import { LocationEntity } from '../../database/entities/location.entity';
import { ProductEntity } from '../../database/entities/product.entity';
import { RackEntity } from '../../database/entities/rack.entity';
import { SectionEntity } from '../../database/entities/section.entity';
import { ILocationEntity } from '../../database/models/location.models';
import { ILocationFindReq, ILocationFindRes } from './models/find.models';
import { ILocationUpdate } from './models/update.models';

@Injectable()
export class LocationService {

    private readonly logger: Logger;
    private readonly dataSource: DataSource;
    private readonly locationRepository: Repository<LocationEntity>;
    private readonly rackRepository: Repository<RackEntity>;
    private readonly sectionRepository: Repository<SectionEntity>;
    private readonly productRepository: Repository<ProductEntity>;

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(LocationEntity) locationRepository: Repository<LocationEntity>,
        @InjectRepository(RackEntity) rackRepository: Repository<RackEntity>,
        @InjectRepository(SectionEntity) sectionRepository: Repository<SectionEntity>,
        @InjectRepository(ProductEntity) productRepository: Repository<ProductEntity>,
    ) {
        this.logger = new Logger(LocationService.name);
        this.dataSource = dataSource;
        this.locationRepository = locationRepository;
        this.rackRepository = rackRepository;
        this.sectionRepository = sectionRepository;
        this.productRepository = productRepository;
    }


    /**
     * @param request.product ID товара для запроса локаций хранения
     * @param request.quantity необходимое количество товара
     *
     * @returns Массив локаций запрошенного товара. Для каждой локации будут указаны:
     * стеллаж-секция, доступное количество товара, необходимое число товара
     */
    public async findProduct(request: ILocationFindReq): Promise<ILocationFindRes[]> {
        const productEntity = await this.productRepository.findOne({
            where: { id: request.product },
        });
        if (!productEntity) {
            throw new NotFoundException(`Could not find product ${request.product}`);
        }

        const total = await this.locationRepository.sum('quantity', {
            product: productEntity,
        });
        if (!total || total < request.quantity) {
            throw new BadRequestException(`Too low stocks for product "${productEntity.id}"`);
        }

        /**
         * Используется Readable для оптимизации запросов
         * Таким образом получение данных будет остановлено
         * при достижении запрошенного число товара
         */
        const response: ILocationFindRes[] = [];
        const stream = await this.dataSource
            .createQueryBuilder()
            .select('*')
            .from(LocationEntity, 'l')
            .where({ product: request.product })
            .stream();

        await new Promise<void>((resolve, reject) => {
            stream.on('result', (row: ILocationEntity) => {
                if (stream.destroyed === false) {
                    response.push({
                        location: [row.rack, row.section].join('-'),
                        quantity: row.quantity,
                        order: row.quantity,
                    });

                    const sum = response.reduce((acc, i) => acc + i.quantity, 0);
                    if (sum >= request.quantity) {
                        response[response.length - 1].order -= sum - request.quantity;
                        stream.destroy();
                    }
                }
            });
            stream.on('close', () => {
                resolve();
            });
            stream.on('error', (e) => {
                reject(e);
            });
        });

        return response;
    }


    public async incomeProducts(request: ILocationUpdate): Promise<void> {
        try {
            const [rack_id, section_id] = request.location.split('-');
            const products = request.products.map((p) => p.id);
            const productsEntities = await this.productRepository.find({
                where: { id: In(products) },
            });
            const sectionEntity = await this.sectionRepository.findOne({
                where: { id: +section_id },
            });
            if (!sectionEntity) {
                throw new NotFoundException(`Could not find section ${section_id}`);
            }
            const rackEntity = await this.rackRepository.findOne({
                where: { id: rack_id },
            });
            if (!rackEntity) {
                throw new NotFoundException(`Could not find rack ${rack_id}`);
            }

            await this.locationRepository.manager.transaction(async(em) => {
                const previousLocations = await em.find(LocationEntity, {
                    where: {
                        rack: rackEntity,
                        section: sectionEntity,
                        product: In(products),
                    },
                    relations: {
                        rack: true,
                        section: true,
                        product: true,
                    },
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
            const [rack_id, section_id] = request.location.split('-');
            const products = request.products.map((p) => p.id);
            const productsEntities = await this.productRepository.find({
                where: { id: In(products) },
            });
            const sectionEntity = await this.sectionRepository.findOne({
                where: { id: +section_id },
            });
            if (!sectionEntity) {
                throw new NotFoundException(`Could not find section ${section_id}`);
            }
            const rackEntity = await this.rackRepository.findOne({
                where: { id: rack_id },
            });
            if (!rackEntity) {
                throw new NotFoundException(`Could not find rack ${rack_id}`);
            }

            await this.locationRepository.manager.transaction(async(em) => {
                const previousLocations = await em.find(LocationEntity, {
                    where: {
                        rack: rackEntity,
                        section: sectionEntity,
                        product: In(products),
                    },
                    relations: {
                        rack: true,
                        section: true,
                        product: true,
                    },
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
