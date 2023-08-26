import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, Matches, ValidateNested } from 'class-validator';
import { IProductReq } from '../models/product.models';
import { ILocationUpdate } from '../models/update.models';
import { ProductDto } from './product.dto';

export class LocationUpdateDto implements ILocationUpdate {

    @IsString()
    @IsNotEmpty()
    @Matches(/\w{2}-\d{1,2}/, { message: 'Location should match pattern' })
    public location!: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested()
    @Type(() => ProductDto)
    public products!: IProductReq[];

}
