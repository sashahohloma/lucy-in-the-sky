import { faker } from '@faker-js/faker';
import { SectionEntity } from '../entities/section.entity';

export class SectionFactory {

    public static getEntities(): SectionEntity[] {
        const sections: SectionEntity[] = [];
        for (let sectionID = 1; sectionID <= 10; sectionID += 1) {
            const entity = new SectionEntity();

            entity.id = sectionID;
            entity.title = faker.commerce.productName();
            entity.updated_at = faker.date.past();

            sections.push(entity);
        }
        return sections;
    }

}
