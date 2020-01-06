import { ResponseMultiplicity } from ".";

export interface HostQuestion {
    id: number;
    questionKey: string;
    text: string;
    responseValues: Array<number>;
    multiplicity: ResponseMultiplicity;
}