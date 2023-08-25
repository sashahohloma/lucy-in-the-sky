import { Transform } from 'class-transformer';
import { Contains, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { ILocationFindReq } from '../models/find.models';

export class LocationFindDto implements ILocationFindReq {

    @IsString()
    @IsNotEmpty()
    @Contains(' ')
    public product!: string;

    @Transform((p) => Number.parseInt(p.value))
    @IsPositive()
    public quantity!: number;

}
