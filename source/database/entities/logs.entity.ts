import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ILogsEntity } from '../models/logs.models';

@Entity({
    database: 'warehouse',
    name: 'logs',
})
export class LogsEntity implements ILogsEntity {

    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column({ type: 'varchar', length: 15 })
    public ip!: string;

    @Column({ type: 'int' })
    public code!: number;

    @Column({ type: 'text' })
    public route!: string;

    @Column({ type: 'varchar', length: 100 })
    public method!: string;

    @Column({ type: 'int' })
    public duration!: number;

    @Column({ type: 'json' })
    public headers!: string;

    @Column({ type: 'json' })
    public body!: string;

    @Column({ type: 'json' })
    public query!: string;

    @Column({ type: 'int' })
    public req_bytes!: number;

    @Column({ type: 'int' })
    public res_bytes!: number;

    @UpdateDateColumn({ type: 'timestamp' })
    public updated_at!: Date;

}
