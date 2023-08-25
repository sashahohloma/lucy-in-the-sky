import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { LocationEntity } from './source/database/entities/location.entity';
import { LogsEntity } from './source/database/entities/logs.entity';
import { ProductEntity } from './source/database/entities/product.entity';
import { RackEntity } from './source/database/entities/rack.entity';
import { SectionEntity } from './source/database/entities/section.entity';

config();

// eslint-disable-next-line import/no-default-export
export default new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_DB,
    synchronize: false,
    logging: true,
    migrations: [
        './source/database/migrations/*-migrations.ts',
    ],
    entities: [
        RackEntity,
        SectionEntity,
        ProductEntity,
        LocationEntity,
        LogsEntity,
    ],
});
