import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { IRackEntity } from '../models/rack.models';

@Entity({
    database: 'warehouse',
    name: 'rack',
})
export class RackEntity implements IRackEntity {

    @PrimaryColumn({ type: 'varchar', length: 200 })
    public id!: string;

    @Column({ type: 'text' })
    public title!: string;

    @UpdateDateColumn({ type: 'timestamp' })
    public updated_at!: Date;

}
