import { faker } from '@faker-js/faker';
import { LocationEntity } from '../entities/location.entity';
import { ILocationProductsFaker } from './factories.models';

export class LocationFactory {

    public static getEntities(props: ILocationProductsFaker): LocationEntity[] {
        const locations: LocationEntity[] = [];
        for (let index = 0; index < props.limit; index += 1) {
            const entity = new LocationEntity();

            entity.rack = faker.helpers.arrayElement(props.racks);
            entity.section = faker.helpers.arrayElement(props.sections);
            entity.product = faker.helpers.arrayElement(props.products);
            entity.quantity = faker.number.int({ min: 10, max: 40 });
            entity.created_at = faker.date.past();
            entity.updated_at = faker.date.recent();

            locations.push(entity);
        }
        return locations;
    }

}
