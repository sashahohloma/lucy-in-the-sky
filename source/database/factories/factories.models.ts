import { ProductEntity } from '../entities/product.entity';
import { RackEntity } from '../entities/rack.entity';
import { SectionEntity } from '../entities/section.entity';

export interface ILocationProductsFaker {
    racks: RackEntity[];
    sections: SectionEntity[];
    products: ProductEntity[];
    limit: number;
}
