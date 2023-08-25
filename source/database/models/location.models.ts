import { IProductEntity } from './product.models';
import { IRackEntity } from './rack.models';
import { ISectionEntity } from './section.models';

export interface ILocationEntity {
    id: number;
    rack: IRackEntity;
    section: ISectionEntity;
    product: IProductEntity;
    quantity: number;
    created_at: Date;
    updated_at: Date;
}
