import { EntityManager } from 'typeorm';
import { IProductEntity } from '../../../database/models/product.models';
import { IRackEntity } from '../../../database/models/rack.models';
import { ISectionEntity } from '../../../database/models/section.models';

export interface ILocationPrevious {
    rack: IRackEntity;
    section: ISectionEntity;
    products: IProductEntity[];
    manager?: EntityManager;
}
