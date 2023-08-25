import { IProductReq } from './product.models';

export interface ILocationUpdate {
    location: string;
    products: IProductReq[];
}
