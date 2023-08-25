import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ISectionEntity } from '../models/section.models';

@Entity({
    database: 'warehouse',
    name: 'section',
})
export class SectionEntity implements ISectionEntity {

    @PrimaryColumn({ type: 'int' })
    public id!: number;

    @Column({ type: 'text' })
    public title!: string;

    @UpdateDateColumn({ type: 'timestamp' })
    public updated_at!: Date;

}
