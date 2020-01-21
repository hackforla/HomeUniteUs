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
    interests: string;
    housingType: string;
    languages: string;
    preferredCharacteristics: string;
    hostingInterest: string;
    hostingStrenghts: string;
    hostingChallenges: string;
    hostIntro: string;
}
