import { ResponseMultiplicity } from ".";

export interface GuestQuestion {
    id: number;
    text: string;
    responseValues: Array<string>;
    multiplicity: ResponseMultiplicity;
}
