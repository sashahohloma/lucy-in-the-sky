import { Readable } from 'stream';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { LocationEntity } from '../../database/entities/location.entity';
import { ProductEntity } from '../../database/entities/product.entity';
import { RackEntity } from '../../database/entities/rack.entity';
import { SectionEntity } from '../../database/entities/section.entity';
import { ILocationEntity } from '../../database/models/location.models';
import { IProductEntity } from '../../database/models/product.models';
import { IRackEntity } from '../../database/models/rack.models';
import { ISectionEntity } from '../../database/models/section.models';
import { IReadable } from '../../models/stream.models';
import { ILocationPrevious } from './models/previous.models';
import { ILocationRepository } from './models/repository.models';

@Injectable()
export class LocationRepository implements ILocationRepository {

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
        this.dataSource = dataSource;
        this.locationRepository = locationRepository;
        this.rackRepository = rackRepository;
        this.sectionRepository = sectionRepository;
        this.productRepository = productRepository;
    }


    /**
     * Запускает транзакцию
     */
    public async transaction<T>(t: (entityManager: EntityManager) => Promise<T>): Promise<void> {
        await this.dataSource.transaction(t);
    }


    /**
     * Используется Readable для оптимизации запросов
     * Таким образом получение данных будет остановлено
     * при достижении запрошенного число товара
     */
    public streamByProduct(product: string): IReadable<ILocationEntity> {
        const connection = this.dataSource;
        const repository = this.locationRepository;

        const data = new Readable({
            objectMode: true,
            async read(): Promise<void> {
                const stream = await connection
                    .createQueryBuilder()
                    .select('*')
                    .from(LocationEntity, 'l')
                    .where({ product })
                    .stream();

                stream.on('result', (chunk: ILocationEntity) => {
                    const entity = repository.create(chunk);
                    this.push(entity);
                });
                stream.on('close', () => {
                    this.push(null);
                });
                stream.on('error', (e) => {
                    this.emit('error', e);
                });
            },
        });
        return data;
    }


    /**
     * Метод для поиска прежнего значения товара на складе
     * Поддерживает транзакцию, если передать внешний EntityManager
     */
    public async findPrevious(params: ILocationPrevious): Promise<ILocationEntity[]> {
        const connection = params.manager ?? this.dataSource.manager;
        const locations = await connection.find(LocationEntity, {
            where: {
                rack: params.rack,
                section: params.section,
                product: In(params.products),
            },
            relations: {
                rack: true,
                section: true,
                product: true,
            },
        });
        return locations;
    }


    /**
     * Возвращает актуальное значение товаров на складе на всех локациях
     */
    public async getTotal(product: IProductEntity): Promise<number> {
        const total = await this.locationRepository.sum('quantity', {
            product,
        });
        return total ?? 0;
    }


    public async findRackOrNotFound(rack: string): Promise<IRackEntity> {
        const rackEntity = await this.rackRepository.findOne({
            where: { id: rack },
        });
        if (!rackEntity) {
            throw new NotFoundException(`Could not find rack ${rack}`);
        }
        return rackEntity;
    }


    public async findSectionOrNotFound(section: number): Promise<ISectionEntity> {
        const sectionEntity = await this.sectionRepository.findOne({
            where: { id: section },
        });
        if (!sectionEntity) {
            throw new NotFoundException(`Could not find section ${section}`);
        }
        return sectionEntity;
    }


    public async findProductOrNotFound(product: string): Promise<IProductEntity> {
        const productEntity = await this.productRepository.findOne({
            where: { id: product },
        });
        if (!productEntity) {
            throw new NotFoundException(`Could not find product ${product}`);
        }
        return productEntity;
    }


    public async findProducts(products: string[]): Promise<IProductEntity[]> {
        const productsEntities = await this.productRepository.find({
            where: { id: In(products) },
        });
        return productsEntities;
    }

}
