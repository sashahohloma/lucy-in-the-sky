import { Transform } from 'class-transformer';
import { IsNotEmpty, IsPositive, IsString, Matches } from 'class-validator';
import { ILocationFindParams } from '../models/find.models';

export class LocationFindDto implements ILocationFindParams {

    @IsString()
    @IsNotEmpty()
    @Matches(/L\d{5}\sS\w{1}/, { message: 'Product should match pattern' })
    public product!: string;

    @Transform((p) => Number.parseInt(p.value))
    @IsPositive()
    public quantity!: number;

}
