import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from '../../database/entities/location.entity';
import { ProductEntity } from '../../database/entities/product.entity';
import { RackEntity } from '../../database/entities/rack.entity';
import { SectionEntity } from '../../database/entities/section.entity';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            LocationEntity,
            RackEntity,
            SectionEntity,
            ProductEntity,
        ]),
    ],
    providers: [
        LocationService,
    ],
    controllers: [
        LocationController,
    ],
})
export class LocationModule {}
