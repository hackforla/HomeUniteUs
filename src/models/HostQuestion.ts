import { ResponseMultiplicity } from ".";

export interface HostQuestion {
    id: number;
    text: string;
    responseValues: Array<string>;
    multiplicity: ResponseMultiplicity;
}