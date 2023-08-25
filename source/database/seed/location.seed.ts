/* eslint-disable import/no-default-export */
import { faker } from '@faker-js/faker';
import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { LocationEntity } from '../entities/location.entity';
import { ProductEntity } from '../entities/product.entity';
import { RackEntity } from '../entities/rack.entity';
import { SectionEntity } from '../entities/section.entity';
import { ProductPrefix, Size } from '../models/product.models';
import { Rack } from '../models/rack.models';

export default class extends Seeder {

    public async run(dataSource: DataSource): Promise<void> {
        const em = dataSource.createEntityManager();

        /**
         * RACKS
         */
        const racks: RackEntity[] = [];
        for (const rackID of Object.values(Rack)) {
            const entity = new RackEntity();

            entity.id = rackID;
            entity.title = faker.commerce.productName();
            entity.updated_at = faker.date.past();

            racks.push(entity);
        }

        /**
         * SECTIONS
         */
        const sections: SectionEntity[] = [];
        for (let sectionID = 1; sectionID <= 10; sectionID += 1) {
            const entity = new SectionEntity();

            entity.id = sectionID;
            entity.title = faker.commerce.productName();
            entity.updated_at = faker.date.past();

            sections.push(entity);
        }

        /**
         * PRODUCTS
         */
        const sizes = Object.values(Size);

        const products: ProductEntity[] = [];
        for (let index = 0; index < 100; index += 1) {
            const entity = new ProductEntity();

            const id = faker.number.int({ min: 10000, max: 50000 });
            const size = faker.helpers.arrayElement(sizes);

            entity.id = `${ProductPrefix.id}${id} ${ProductPrefix.size}${size}`;
            entity.title = faker.commerce.productName();
            entity.updated_at = faker.date.past();

            products.push(entity);
        }

        /**
         * LOCATIONS
         */
        const locations: LocationEntity[] = [];
        for (let index = 0; index < 1000; index += 1) {
            const entity = new LocationEntity();

            entity.rack = faker.helpers.arrayElement(racks);
            entity.section = faker.helpers.arrayElement(sections);
            entity.product = faker.helpers.arrayElement(products);
            entity.quantity = faker.number.int({ min: 1, max: 10 });
            entity.created_at = faker.date.past();
            entity.updated_at = faker.date.recent();

            locations.push(entity);
        }

        await em.upsert(RackEntity, racks, {
            conflictPaths: ['id'],
        });
        await em.upsert(SectionEntity, sections, {
            conflictPaths: ['id'],
        });
        await em.upsert(ProductEntity, products, {
            conflictPaths: ['id'],
        });
        await em.upsert(LocationEntity, locations, {
            conflictPaths: LocationEntity.uniq,
        });
    }

}
