/* eslint-disable import/no-default-export */
import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { LocationEntity } from '../entities/location.entity';
import { ProductEntity } from '../entities/product.entity';
import { RackEntity } from '../entities/rack.entity';
import { SectionEntity } from '../entities/section.entity';
import { LocationFactory } from '../factories/location.factory';
import { ProductsFactory } from '../factories/product.factory';
import { RackFactory } from '../factories/rack.factory';
import { SectionFactory } from '../factories/section.factory';

export default class extends Seeder {

    public async run(dataSource: DataSource): Promise<void> {
        const em = dataSource.createEntityManager();

        const racks = RackFactory.getEntities();
        const sections = SectionFactory.getEntities();
        const products = ProductsFactory.getEntities(1000);
        const locations = LocationFactory.getEntities({
            racks,
            sections,
            products,
            limit: 100,
        });

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
