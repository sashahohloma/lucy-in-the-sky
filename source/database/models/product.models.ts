export enum Size {
    S = 'S',
    M = 'M',
    L = 'L',
}

export enum ProductPrefix {
    id = 'L',
    size = 'S',
}

export interface IProductEntity {
    id: string;
    title: string;
    updated_at: Date;
}
