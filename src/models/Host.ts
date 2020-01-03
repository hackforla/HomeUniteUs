export interface Host {
    id: number;
    address: string;
    alchoholUse: boolean;
    allowedPets: Array<string>;
    gender: string;
    allowsGuestsInRelationship: boolean;
    allowsGuestsWithChildren: boolean;
    isRespite: boolean;
    allowsSmoking: boolean;
    email: boolean;
    numberOfGuests: number;
    petsOwned: Array<string>;
};
