import { Transform } from 'class-transformer';
import { IsPositive, Max, Min } from 'class-validator';
import { IProductsListReq } from '../models/list.models';

export class ProductsListDto implements IProductsListReq {

    @Transform((p) => Number.parseInt(p.value))
    @Min(1)
    @Max(100)
    public limit!: number;

    @Transform((p) => Number.parseInt(p.value))
    @IsPositive()
    public page!: number;

}
