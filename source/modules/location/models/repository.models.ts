import { EntityManager } from 'typeorm';
import { ILocationEntity } from '../../../database/models/location.models';
import { IProductEntity } from '../../../database/models/product.models';
import { IRackEntity } from '../../../database/models/rack.models';
import { ISectionEntity } from '../../../database/models/section.models';
import { IReadable } from '../../../models/stream.models';
import { ILocationPrevious } from './previous.models';

export interface ILocationRepository {
    transaction<T>(t: (entityManager: EntityManager) => Promise<T>): Promise<void>;
    streamByProduct(product: string): IReadable<ILocationEntity>;
    findPrevious(params: ILocationPrevious): Promise<ILocationEntity[]>;
    getTotal(product: IProductEntity): Promise<number>;
    findRackOrNotFound(rack: string): Promise<IRackEntity>;
    findSectionOrNotFound(section: number): Promise<ISectionEntity>;
    findProductOrNotFound(product: string): Promise<IProductEntity>;
    findProducts(products: string[]): Promise<IProductEntity[]>;
}
