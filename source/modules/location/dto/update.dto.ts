import { Type } from 'class-transformer';
import { ArrayNotEmpty, Contains, IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { IProductReq } from '../models/product.models';
import { ILocationUpdate } from '../models/update.models';
import { ProductDto } from './product.dto';

export class LocationUpdateDto implements ILocationUpdate {

    @IsString()
    @IsNotEmpty()
    @Contains('-')
    public location!: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested()
    @Type(() => ProductDto)
    public products!: IProductReq[];

}
