import { faker } from '@faker-js/faker';
import { RackEntity } from '../entities/rack.entity';
import { Rack } from '../models/rack.models';

export class RackFactory {

    public static getEntities(): RackEntity[] {
        const racks: RackEntity[] = [];
        for (const rackID of Object.values(Rack)) {
            const entity = new RackEntity();

            entity.id = rackID;
            entity.title = faker.commerce.productName();
            entity.updated_at = faker.date.past();

            racks.push(entity);
        }
        return racks;
    }

}
