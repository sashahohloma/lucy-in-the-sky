import { faker } from '@faker-js/faker';
import { ProductEntity } from '../entities/product.entity';
import { ProductPrefix, Size } from '../models/product.models';

const sizes = Object.values(Size);

export class ProductsFactory {

    public static getEntity(): ProductEntity {
        const entity = new ProductEntity();

        const id = faker.number.int({ min: 10000, max: 50000 });
        const size = faker.helpers.arrayElement(sizes);

        entity.id = `${ProductPrefix.id}${id} ${ProductPrefix.size}${size}`;
        entity.title = faker.commerce.productName();
        entity.updated_at = faker.date.past();

        return entity;
    }

    public static getEntities(limit: number): ProductEntity[] {
        const products: ProductEntity[] = [];
        for (let index = 0; index < limit; index += 1) {
            const entity = ProductsFactory.getEntity();
            products.push(entity);
        }
        return products;
    }

}
