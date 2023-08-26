import { IsNotEmpty, IsPositive, IsString, Matches } from 'class-validator';
import { IProductReq } from '../models/product.models';

export class ProductDto implements IProductReq {

    @IsString()
    @IsNotEmpty()
    @Matches(/L\d{5}\sS\w{1}/, { message: 'Product should match pattern' })
    public id!: string;

    @IsPositive()
    public quantity!: number;

}
