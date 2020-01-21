import { Housemate } from "./Housemate";

export interface Host {
    id: number;
    name: string;
    address: string;
    imageUrl: string;
    firstName: string;
    middleInitial: string;
    dateOfBirth: Date;
    lastName: string;
    email: string;
    phone: string;
    employmentInfo: string;
    contactAddress: string;
    petsText: string;
    drinkingText: string;
    smokingText: string;
    substancesText: string;
    householdMembers: Array<Housemate>;
}
