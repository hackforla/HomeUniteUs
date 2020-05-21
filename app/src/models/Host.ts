import { Housemate } from './Housemate'
import { HostHomeType } from './HostHomeType'

export interface Host {
    id: number
    name: string
    address: string
    imageUrl: string
    firstName: string
    middleInitial: string
    dateOfBirth: Date //original is: Date
    lastName: string
    email: string
    phone: string
    employmentInfo: string
    contactAddress: string
    petsText: string
    drinkingText: string
    smokingText: string
    substancesText: string
    householdMembers: Array<Housemate>
    interests: Array<string>
    housingType: string
    languages: Array<string>
    preferredCharacteristics: string
    hostingInterest: string
    hostingStrengths: string
    hostingChallenges: string
    hostIntro: string
    durationOfStay: string
    hostingAmount: number
    youthParenting: boolean
    youthRelationship: boolean
    type: HostHomeType // original is: HostHomeType
    employmentCompany: string
    employmentPosition: string
}
