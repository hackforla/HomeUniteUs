import { Restriction, GuestInterestLevel } from '.'

export interface MatchResult {
    guestId: number
    hostId: number
    restrictionsFailed: Array<Restriction>
    guestInterestLevel: GuestInterestLevel
    lastInterestUpdate: Date
}
