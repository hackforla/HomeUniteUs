import { HostHomeType } from './HostHomeType'

export interface Guest {
    id: number
    name: string
    imageUrl: string
    firstName: string
    middleInitial: string
    lastName: string
    email: string
    guestIntro: string
    guestChallenges: string
    employmentInfo: string
    dateOfBirth: Date
    guestStayStatement: string
    petsText: string
    drinkingText: string
    smokingText: string
    substancesText: string
    type: HostHomeType
    numberOfGuests: number
    employmentCompany: string
    employmentPosition: string
}
