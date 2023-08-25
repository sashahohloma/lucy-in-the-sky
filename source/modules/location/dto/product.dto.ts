import { Contains, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { IProductReq } from '../models/product.models';

export class ProductDto implements IProductReq {

    @IsString()
    @IsNotEmpty()
    @Contains(' ')
    public id!: string;

    @IsPositive()
    public quantity!: number;

}
