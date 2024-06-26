import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../../database/entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProductEntity,
        ]),
    ],
    providers: [
        ProductsService,
    ],
    controllers: [
        ProductsController,
    ],
})
export class ProductsModule {}
