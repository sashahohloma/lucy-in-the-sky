import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { LocationEntity } from '../database/entities/location.entity';
import { LogsEntity } from '../database/entities/logs.entity';
import { ProductEntity } from '../database/entities/product.entity';
import { RackEntity } from '../database/entities/rack.entity';
import { SectionEntity } from '../database/entities/section.entity';
import { IEnv } from './config.models';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {

    private readonly configService: ConfigService<IEnv>;

    constructor(configService: ConfigService<IEnv>) {
        this.configService = configService;
    }

    public createTypeOrmOptions(): DataSourceOptions {
        const host = this.configService.getOrThrow('DATABASE_HOST');
        const port = this.configService.getOrThrow('DATABASE_PORT', { infer: true });
        const user = this.configService.getOrThrow('DATABASE_USER');
        const pass = this.configService.getOrThrow('DATABASE_PASS');
        const db = this.configService.getOrThrow('DATABASE_DB');
        const sync = this.configService.getOrThrow('DATABASE_SYNC', { infer: true });
        return {
            type: 'mysql',
            host,
            port,
            username: user,
            password: pass,
            database: db,
            synchronize: false,
            logging: true,
            migrations: [
                './**/database/migrations/*-migrations.js',
            ],
            migrationsRun: sync,
            entities: [
                LocationEntity,
                ProductEntity,
                RackEntity,
                SectionEntity,
                LogsEntity,
            ],
        };
    }

}
