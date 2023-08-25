import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { IProductEntity } from '../models/product.models';

@Entity({
    database: 'warehouse',
    name: 'product',
})
export class ProductEntity implements IProductEntity {

    @PrimaryColumn({ type: 'varchar', length: 9 })
    public id!: string;

    @Column({ type: 'text' })
    public title!: string;

    @UpdateDateColumn({ type: 'timestamp' })
    public updated_at!: Date;

}
