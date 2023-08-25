export interface ILocationFindReq {
    product: string;
    quantity: number;
}

export interface ILocationFindRes {
    location: string;
    quantity: number;
    order: number;
}
