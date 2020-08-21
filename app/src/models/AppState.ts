import { Guest, Host, MatchResult } from '.'

export interface AppState {
    guests: Map<number, Guest>
    hosts: Map<number, Host>
    matchResults: Array<MatchResult>
}
