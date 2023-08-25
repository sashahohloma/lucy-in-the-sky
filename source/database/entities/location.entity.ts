import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { ILocationEntity } from '../models/location.models';
import { IProductEntity } from '../models/product.models';
import { IRackEntity } from '../models/rack.models';
import { ISectionEntity } from '../models/section.models';
import { ProductEntity } from './product.entity';
import { RackEntity } from './rack.entity';
import { SectionEntity } from './section.entity';

@Entity({
    database: 'warehouse',
    name: 'location',
})
@Unique('location_unique_index', LocationEntity.uniq)
export class LocationEntity implements ILocationEntity {

    public static uniq: string[] = ['rack', 'section', 'product'];

    @PrimaryGeneratedColumn({ type: 'int' })
    public id!: number;

    @ManyToOne(() => RackEntity, (rack) => rack.id)
    @JoinColumn({
        name: 'rack',
        referencedColumnName: 'id',
    })
    public rack!: IRackEntity;

    @ManyToOne(() => SectionEntity, (section) => section.id)
    @JoinColumn({
        name: 'section',
        referencedColumnName: 'id',
    })
    public section!: ISectionEntity;

    @Index('location_product_index')
    @ManyToOne(() => ProductEntity, (product) => product.id)
    @JoinColumn({
        name: 'product',
        referencedColumnName: 'id',
    })
    public product!: IProductEntity;

    @Column({ type: 'int' })
    public quantity!: number;

    @CreateDateColumn({ type: 'timestamp' })
    public created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updated_at!: Date;

}
