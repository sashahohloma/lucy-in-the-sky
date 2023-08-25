export enum Rack {
    AA = 'AA',
    AB = 'AB',
    BA = 'BA',
    BB = 'BB',
    CA = 'CA',
    CB = 'CB',
}

export interface IRackEntity {
    id: string;
    title: string;
    updated_at: Date;
}
