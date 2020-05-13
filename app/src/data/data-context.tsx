import * as React from 'react'
import {
    Guest,
    Host,
    GuestQuestion,
    HostQuestion,
    Restriction,
    MatchResult,
    GuestInterestLevel,
    ResponseMultiplicity,
    GuestResponse,
    HostResponse,
} from '../models'
import { CommonResponseValues, ResponseValue } from '../models/ResponseValue'
import { HostHomeType } from '../models/HostHomeType'

// design was informed by:
//   https://kentcdodds.com/blog/application-state-management-with-react
//   https://www.typescriptlang.org/docs/handbook/react-&-webpack.html
//   https://kentcdodds.com/blog/how-to-use-react-context-effectively

const AppContext = React.createContext({})

interface HostHomeData {
    guests: Array<Guest>
    hosts: Array<Host>
    guestQuestions: Array<GuestQuestion>
    hostQuestions: Array<HostQuestion>
    restrictions: Array<Restriction>
    matchResults: Array<MatchResult>
    responseValues: Array<ResponseValue>
    guestResponses: Array<GuestResponse>
    hostResponses: Array<HostResponse>
}

enum HostHomeActionType {
    LoadData,
    AddGuest,
    MarkAsInterested,
    MarkAsNotInterested,
}

interface HostHomeAction {
    type: HostHomeActionType
    payload: Guest | MatchPair | HostHomeData
}

function hostHomeDataReducer(
    state: HostHomeData,
    action: HostHomeAction
): HostHomeData {
    let newState: HostHomeData

    switch (action.type) {
        case HostHomeActionType.LoadData:
            return {
                ...state,
                ...(action.payload as HostHomeData),
            }

        case HostHomeActionType.AddGuest:
            return {
                ...state,
            }
        case HostHomeActionType.MarkAsInterested:
            const interestedPair = action.payload as MatchPair

            newState = { ...state }
            ;(newState.matchResults.find(
                (m: MatchResult) =>
                    m.guestId === interestedPair.guestId &&
                    m.hostId === interestedPair.hostId
            ) as MatchResult).guestInterestLevel = GuestInterestLevel.Interested
            ;(newState.matchResults.find(
                (m: MatchResult) =>
                    m.guestId === interestedPair.guestId &&
                    m.hostId === interestedPair.hostId
            ) as MatchResult).lastInterestUpdate = new Date()

            return newState

        case HostHomeActionType.MarkAsNotInterested:
            const notInterestedPair = action.payload as MatchPair

            newState = { ...state }
            ;(newState.matchResults.find(
                (m: MatchResult) =>
                    m.guestId === notInterestedPair.guestId &&
                    m.hostId === notInterestedPair.hostId
            ) as MatchResult).guestInterestLevel =
                GuestInterestLevel.NotInterested
            ;(newState.matchResults.find(
                (m: MatchResult) =>
                    m.guestId === notInterestedPair.guestId &&
                    m.hostId === notInterestedPair.hostId
            ) as MatchResult).lastInterestUpdate = new Date()

            return newState
        default:
            throw new Error(`Unsupported action: ${JSON.stringify(action)}`)
    }
}

const initialState: HostHomeData = {
    guestQuestions: [],
    hostQuestions: [],
    hostResponses: [],
    guestResponses: [],
    guests: [],
    hosts: [],
    responseValues: [],
    restrictions: [],
    matchResults: [],
}

interface RestrictionMap {
    [hostId: string]: Array<number>
}

export const computeInitialMatches = () => {
    /*
        for all g in guests:
            for all h in hosts:
                    gr := g.responses.where(resp.questionId = r.questionId)
                    hr = 
     */

    const restrictedPairs: RestrictionMap = {}
    initialState.hosts.forEach((host: Host) => {
        restrictedPairs[host.id] = new Array<number>()
    })

    initialState.restrictions.forEach((restriction: Restriction) => {
        const hostResponses = initialState.hostResponses.filter(
            (hostResponse: HostResponse) => {
                return (
                    hostResponse.responseValues.find(
                        (rvId: number) => rvId === restriction.hostResponseValue
                    ) !== undefined
                )
            }
        )

        const guestResponses = initialState.guestResponses.filter(
            (guestResponse: GuestResponse) => {
                return (
                    guestResponse.responseValues.find(
                        (rvId: number) =>
                            rvId === restriction.guestResponseValue
                    ) !== undefined
                )
            }
        )

        // add each pair to the restricted
        hostResponses.forEach((hostResponse: HostResponse) => {
            guestResponses.forEach((guestResponse: GuestResponse) => {
                restrictedPairs[hostResponse.hostId].push(guestResponse.guestId)

                const existingResult = initialState.matchResults.find(
                    (matchResult: MatchResult) => {
                        return (
                            matchResult.hostId === hostResponse.hostId &&
                            matchResult.guestId === guestResponse.guestId
                        )
                    }
                )

                if (!existingResult) {
                    initialState.matchResults.push({
                        hostId: hostResponse.hostId,
                        guestId: guestResponse.guestId,
                        restrictionsFailed: [restriction],
                        guestInterestLevel: GuestInterestLevel.Unknown,
                        lastInterestUpdate: new Date(),
                    })
                } else {
                    existingResult.restrictionsFailed.push(restriction)
                }
            })
        })
    })

    // filter on type: respite, full, both
    initialState.guests.forEach((g: Guest) => {
        if (g.type === HostHomeType.Both) {
            // no way to unmatch on this criteria
            return
        }
        if (g.type === HostHomeType.Full) {
            // add all respite-only hosts
            initialState.hosts.forEach((h: Host) => {
                if (h.type === HostHomeType.Respite) {
                    restrictedPairs[h.id].push(g.id)

                    const existingResult = initialState.matchResults.find(
                        (matchResult: MatchResult) => {
                            return (
                                matchResult.hostId === h.id &&
                                matchResult.guestId === g.id
                            )
                        }
                    )

                    const r = {
                        hostQuestionId: 1000,
                        guestQuestionId: 1000,
                        reasonText: 'Respite-only Host',
                        guestResponseValue: 1001,
                        hostResponseValue: 1002,
                    }

                    if (!existingResult) {
                        initialState.matchResults.push({
                            hostId: h.id,
                            guestId: g.id,
                            restrictionsFailed: [r],
                            guestInterestLevel: GuestInterestLevel.Unknown,
                            lastInterestUpdate: new Date(),
                        })
                    } else {
                        existingResult.restrictionsFailed.push(r)
                    }
                }
            })
        }
        if (g.type === HostHomeType.Respite) {
            // add all full-only hosts
            initialState.hosts.forEach((h: Host) => {
                if (h.type === HostHomeType.Full) {
                    restrictedPairs[h.id].push(g.id)

                    const existingResult = initialState.matchResults.find(
                        (matchResult: MatchResult) => {
                            return (
                                matchResult.hostId === h.id &&
                                matchResult.guestId === g.id
                            )
                        }
                    )

                    const r = {
                        hostQuestionId: 1000,
                        guestQuestionId: 1000,
                        reasonText: 'Full-stay-only Host',
                        guestResponseValue: 1002,
                        hostResponseValue: 1001,
                    }

                    if (!existingResult) {
                        initialState.matchResults.push({
                            hostId: h.id,
                            guestId: g.id,
                            restrictionsFailed: [r],
                            guestInterestLevel: GuestInterestLevel.Unknown,
                            lastInterestUpdate: new Date(),
                        })
                    } else {
                        existingResult.restrictionsFailed.push(r)
                    }
                }
            })
        }
    })

    initialState.guests.forEach((g: Guest) => {
        if (g.numberOfGuests < 2) {
            // no way to unmatch on this criteria
            return
        }

        initialState.hosts.forEach((h: Host) => {
            if (h.hostingAmount < g.numberOfGuests) {
                restrictedPairs[h.id].push(g.id)

                const existingResult = initialState.matchResults.find(
                    (matchResult: MatchResult) => {
                        return (
                            matchResult.hostId === h.id &&
                            matchResult.guestId === g.id
                        )
                    }
                )

                const r = {
                    hostQuestionId: 2000,
                    guestQuestionId: 2000,
                    reasonText: 'Too many guests for host',
                    guestResponseValue: 2000 + g.numberOfGuests,
                    hostResponseValue: 2000 + h.hostingAmount,
                }

                if (!existingResult) {
                    initialState.matchResults.push({
                        hostId: h.id,
                        guestId: g.id,
                        restrictionsFailed: [r],
                        guestInterestLevel: GuestInterestLevel.Unknown,
                        lastInterestUpdate: new Date(),
                    })
                } else {
                    existingResult.restrictionsFailed.push(r)
                }
            }
        })
    })

    // add pairs that did not fail
    initialState.hosts.forEach((host: Host) => {
        initialState.guests.forEach((guest: Guest) => {
            if (
                restrictedPairs[host.id].find(
                    (guestId: number) => guestId === guest.id
                ) === undefined
            ) {
                initialState.matchResults.push({
                    hostId: host.id,
                    guestId: guest.id,
                    restrictionsFailed: [],
                    guestInterestLevel: GuestInterestLevel.Unknown,
                    lastInterestUpdate: new Date(),
                })
            }
        })
    })
}
export const computeMatches = (data: HostHomeData): HostHomeData => {
    /*
        for all g in guests:
            for all h in hosts:
                    gr := g.responses.where(resp.questionId = r.questionId)
                    hr = 
     */

    const newState: HostHomeData = { ...data }

    const restrictedPairs: RestrictionMap = {}
    newState.hosts.forEach((host: Host) => {
        restrictedPairs[host.id] = new Array<number>()
    })

    newState.restrictions.forEach((restriction: Restriction) => {
        const hostResponses = newState.hostResponses.filter(
            (hostResponse: HostResponse) => {
                return (
                    hostResponse.responseValues.find(
                        (rvId: number) => rvId === restriction.hostResponseValue
                    ) !== undefined
                )
            }
        )

        const guestResponses = newState.guestResponses.filter(
            (guestResponse: GuestResponse) => {
                return (
                    guestResponse.responseValues.find(
                        (rvId: number) =>
                            rvId === restriction.guestResponseValue
                    ) !== undefined
                )
            }
        )

        // add each pair to the restricted
        hostResponses.forEach((hostResponse: HostResponse) => {
            guestResponses.forEach((guestResponse: GuestResponse) => {
                restrictedPairs[hostResponse.hostId].push(guestResponse.guestId)

                const existingResult = newState.matchResults.find(
                    (matchResult: MatchResult) => {
                        return (
                            matchResult.hostId === hostResponse.hostId &&
                            matchResult.guestId === guestResponse.guestId
                        )
                    }
                )

                if (!existingResult) {
                    newState.matchResults.push({
                        hostId: hostResponse.hostId,
                        guestId: guestResponse.guestId,
                        restrictionsFailed: [restriction],
                        guestInterestLevel: GuestInterestLevel.Unknown,
                        lastInterestUpdate: new Date(),
                    })
                } else {
                    existingResult.restrictionsFailed.push(restriction)
                }
            })
        })
    })

    // filter on type: respite, full, both
    newState.guests.forEach((g: Guest) => {
        if (g.type === HostHomeType.Both) {
            // no way to unmatch on this criteria
            return
        }
        if (g.type === HostHomeType.Full) {
            // add all respite-only hosts
            newState.hosts.forEach((h: Host) => {
                if (h.type === HostHomeType.Respite) {
                    restrictedPairs[h.id].push(g.id)

                    const existingResult = newState.matchResults.find(
                        (matchResult: MatchResult) => {
                            return (
                                matchResult.hostId === h.id &&
                                matchResult.guestId === g.id
                            )
                        }
                    )

                    const r = {
                        hostQuestionId: 1000,
                        guestQuestionId: 1000,
                        reasonText: 'Respite-only Host',
                        guestResponseValue: 1001,
                        hostResponseValue: 1002,
                    }

                    if (!existingResult) {
                        newState.matchResults.push({
                            hostId: h.id,
                            guestId: g.id,
                            restrictionsFailed: [r],
                            guestInterestLevel: GuestInterestLevel.Unknown,
                            lastInterestUpdate: new Date(),
                        })
                    } else {
                        existingResult.restrictionsFailed.push(r)
                    }
                }
            })
        }
        if (g.type === HostHomeType.Respite) {
            // add all full-only hosts
            newState.hosts.forEach((h: Host) => {
                if (h.type === HostHomeType.Full) {
                    restrictedPairs[h.id].push(g.id)

                    const existingResult = newState.matchResults.find(
                        (matchResult: MatchResult) => {
                            return (
                                matchResult.hostId === h.id &&
                                matchResult.guestId === g.id
                            )
                        }
                    )

                    const r = {
                        hostQuestionId: 1000,
                        guestQuestionId: 1000,
                        reasonText: 'Full-stay-only Host',
                        guestResponseValue: 1002,
                        hostResponseValue: 1001,
                    }

                    if (!existingResult) {
                        newState.matchResults.push({
                            hostId: h.id,
                            guestId: g.id,
                            restrictionsFailed: [r],
                            guestInterestLevel: GuestInterestLevel.Unknown,
                            lastInterestUpdate: new Date(),
                        })
                    } else {
                        existingResult.restrictionsFailed.push(r)
                    }
                }
            })
        }
    })

    newState.guests.forEach((g: Guest) => {
        if (g.numberOfGuests < 2) {
            // no way to unmatch on this criteria
            return
        }

        newState.hosts.forEach((h: Host) => {
            if (h.hostingAmount < g.numberOfGuests) {
                restrictedPairs[h.id].push(g.id)

                const existingResult = newState.matchResults.find(
                    (matchResult: MatchResult) => {
                        return (
                            matchResult.hostId === h.id &&
                            matchResult.guestId === g.id
                        )
                    }
                )

                const r = {
                    hostQuestionId: 2000,
                    guestQuestionId: 2000,
                    reasonText: 'Too many guests for host',
                    guestResponseValue: 2000 + g.numberOfGuests,
                    hostResponseValue: 2000 + h.hostingAmount,
                }

                if (!existingResult) {
                    newState.matchResults.push({
                        hostId: h.id,
                        guestId: g.id,
                        restrictionsFailed: [r],
                        guestInterestLevel: GuestInterestLevel.Unknown,
                        lastInterestUpdate: new Date(),
                    })
                } else {
                    existingResult.restrictionsFailed.push(r)
                }
            }
        })
    })

    // add pairs that did not fail
    newState.hosts.forEach((host: Host) => {
        newState.guests.forEach((guest: Guest) => {
            if (
                restrictedPairs[host.id].find(
                    (guestId: number) => guestId === guest.id
                ) === undefined
            ) {
                newState.matchResults.push({
                    hostId: host.id,
                    guestId: guest.id,
                    restrictionsFailed: [],
                    guestInterestLevel: GuestInterestLevel.Unknown,
                    lastInterestUpdate: new Date(),
                })
            }
        })
    })

    return newState
}

// computeInitialMatches()

const loadData = async (): Promise<HostHomeData> => {
    try {
        const response = await fetch('/api/dataset')
        const data = await response.json()
        return data
    } catch (e) {
        console.log(`loadData error: ${e}`)
        throw e
    }
}

export function HostHomeDataProvider(
    props: React.PropsWithChildren<{}>
): JSX.Element {
    const [state, dispatch] = React.useReducer(
        hostHomeDataReducer,
        initialState
    )

    // load initial data
    React.useEffect(() => {
        console.log(`loading inital data...`)
        loadData().then((data: HostHomeData) => {
            console.log(`loaded data: ${JSON.stringify(data)}`)

            const newData = computeMatches(data)

            console.log(`got matches: ${JSON.stringify(newData.matchResults)}`)
            dispatch({
                type: HostHomeActionType.LoadData,
                payload: newData,
            })
        })
    }, [])

    // recompute matches when relevant data changes
    React.useEffect(() => {
        const newData = computeMatches(state)

        dispatch({
            type: HostHomeActionType.LoadData,
            payload: newData,
        })
    }, [state.guestResponses, state.hostResponses])

    const value = React.useMemo(() => [state, dispatch], [state])
    return <AppContext.Provider value={value} {...props} />
}
interface MatchPair {
    hostId: number
    guestId: number
}

export function useHostHomeData() {
    const context = React.useContext(AppContext)
    if (!context) {
        throw new Error(
            'useHostHomeData must be used within a HostHomeDataProvider'
        )
    }

    const [data, dispatch] = context as [
        HostHomeData,
        React.Dispatch<HostHomeAction>
    ]

    // All Create, Update, Delete operations.
    // Read operations are accessed directly from data.guests, etc
    const addGuest = (guest: Guest) =>
        dispatch({ type: HostHomeActionType.AddGuest, payload: guest })

    const markAsInterested = (matchPair: MatchPair) =>
        dispatch({
            type: HostHomeActionType.MarkAsInterested,
            payload: matchPair,
        })
    const markAsNotInterested = (matchPair: MatchPair) =>
        dispatch({
            type: HostHomeActionType.MarkAsNotInterested,
            payload: matchPair,
        })

    const guestsById = data.guests.reduce<Map<number, Guest>>(
        (prev: Map<number, Guest>, cur: Guest) => {
            prev.set(cur.id, cur)
            return prev
        },
        new Map<number, Guest>()
    )

    const guestsResponsesByGuestId = data.guestResponses.reduce<
        Map<number, Map<number, GuestResponse>>
    >((prev: Map<number, Map<number, GuestResponse>>, cur: GuestResponse) => {
        if (!prev.has(cur.guestId)) {
            prev.set(cur.guestId, new Map<number, GuestResponse>())
        }
        ;(prev.get(cur.guestId) as Map<number, GuestResponse>).set(
            cur.questionId,
            cur
        )
        return prev
    }, new Map<number, Map<number, GuestResponse>>())

    const guestQuestionsById = data.guestQuestions.reduce<
        Map<number, GuestQuestion>
    >((prev: Map<number, GuestQuestion>, cur: GuestQuestion) => {
        prev.set(cur.id, cur)
        return prev
    }, new Map<number, GuestQuestion>())

    const guestQuestionsByKey = data.guestQuestions.reduce<
        Map<string, GuestQuestion>
    >((prev: Map<string, GuestQuestion>, cur: GuestQuestion) => {
        prev.set(cur.questionKey, cur)
        return prev
    }, new Map<string, GuestQuestion>())

    // ...

    const updateHostProfile = () => {}

    return {
        data,
        addGuest,
        dispatch,
        updateHostProfile,
        markAsInterested,
        markAsNotInterested,
        guestsById,
        guestsResponsesByGuestId,
        guestQuestionsById,
        guestQuestionsByKey,
    }
}
