import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config/database.config';
import { EnvModule } from './config/env.module';
import { LocationModule } from './modules/location/location.module';
import { LogsModule } from './modules/logs/logs.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
    imports: [
        EnvModule,
        TypeOrmModule.forRootAsync({
            imports: [EnvModule],
            useExisting: DatabaseConfig,
        }),
        LocationModule,
        ProductsModule,
        LogsModule,
    ],
})
export class AppModule {}
