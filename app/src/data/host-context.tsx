import * as React from 'react'
import { MatchingQuestionType } from '../models/MatchingQuestionType'
import { ShowstopperQuestionType } from '../models/ShowstopperQuestionType'
import { HostResponse } from '../models/HostResponse'
import { ApiWrapper } from './ApiWrapper'

const HostDashboardContext = React.createContext({})
const hostsFetcher = new ApiWrapper()

interface HostDashboardData {
    showstopperQuestions: Array<ShowstopperQuestionType>
    matchingQuestions: Array<MatchingQuestionType>
    hostResponse: HostResponse | null
    loaderState: {
        loading: boolean
        message: string
    }
}

enum HostDashboardActionType {
    BeginFetchQuestions,
    FinishFetchQuestions,
    GetHostById,
    isLoading,
    BeginPostResponse,
    FinishPostResponse,
    Error,
}

interface HostDashboardAction {
    type: HostDashboardActionType
    payload?:
        | HostDashboardData
        | Array<ShowstopperQuestionType>
        | Array<MatchingQuestionType>
        | string
        | HostResponse
        | any // how to resolve this any type on get questions payload?
}

const initialState: HostDashboardData = {
    showstopperQuestions: [],
    matchingQuestions: [],
    hostResponse: null,
    loaderState: {
        loading: false,
        message: '',
    },
}

function hostDashboardReducer(
    state: HostDashboardData,
    action: HostDashboardAction
): HostDashboardData {
    switch (action.type) {
        case HostDashboardActionType.BeginFetchQuestions: {
            return {
                ...state,
                loaderState: {
                    loading: true,
                    message: action.payload as string,
                },
            }
        }
        case HostDashboardActionType.FinishFetchQuestions: {
            return {
                ...state,
                loaderState: {
                    ...state.loaderState,
                    loading: false,
                },
                showstopperQuestions: action.payload[0] as Array<
                    ShowstopperQuestionType
                >,
                matchingQuestions: action.payload[1] as Array<
                    MatchingQuestionType
                >,
            }
        }
        case HostDashboardActionType.BeginPostResponse: {
            return {
                ...state,
                loaderState: {
                    loading: true,
                    message: action.payload as string,
                },
            }
        }
        case HostDashboardActionType.FinishPostResponse: {
            return {
                ...state,
                loaderState: {
                    ...state.loaderState,
                    loading: false,
                },
            }
        }

        default:
            throw new Error(`Unsupported action: ${JSON.stringify(action)}`)
    }
}

export function HostDashboardDataProvider(
    props: React.PropsWithChildren<{}>
): JSX.Element {
    const [state, dispatch] = React.useReducer(
        hostDashboardReducer,
        initialState
    )

    React.useEffect(() => {
        ;(async function () {
            console.log('loadData: fetching...')
            try {
                dispatch({
                    type: HostDashboardActionType.BeginFetchQuestions,
                    payload: 'Retrieving host questions...',
                })

                console.log(`getting host questions`)
                const [hostQuestions] = await Promise.all([
                    hostsFetcher.getHostShowstopperQuestions(),
                    await hostsFetcher.getHostMatchingQuestions(),
                ])
                console.log(
                    `host questionsloaded: ${JSON.stringify(hostQuestions)}`
                )

                dispatch({
                    type: HostDashboardActionType.FinishFetchQuestions,
                    payload: hostQuestions,
                })
            } catch (e) {
                dispatch({
                    type: HostDashboardActionType.Error,
                    payload: `System error: ${e}`,
                })
            }
        })()
    }, [])

    const value = React.useMemo(() => [state, dispatch], [state])
    return <HostDashboardContext.Provider value={value} {...props} />
}

export function useHostDashboardData() {
    const context = React.useContext(HostDashboardContext)
    console.log('this is context in a custom hook', context)
    if (!context) {
        throw new Error(
            'useHostDashboardData must be used within a HostDashboardProvider'
        )
    }

    // showstopper & matching
    const putHostResponse = async (
        id: number | string,
        hostResponse: HostResponse
    ) => {
        console.log(`postHostResponse: ${hostResponse} `)
        try {
            dispatch({
                type: HostDashboardActionType.BeginPostResponse,
                payload: 'Posting host response...',
            })

            await hostsFetcher.putHostRegistrationResponse(id, hostResponse)

            dispatch({
                type: HostDashboardActionType.FinishPostResponse,
                payload: 'Finished host response...',
            })
        } catch (e) {
            dispatch({
                type: HostDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    // form detail
    const putPersonalInfo = async (hostResponse: object) => {
        console.log(`postHostResponse: ${hostResponse} `)
        try {
            dispatch({
                type: HostDashboardActionType.BeginPostResponse,
                payload: 'Posting host info details...',
            })

            await hostsFetcher.putHostInformation(hostResponse)

            dispatch({
                type: HostDashboardActionType.FinishPostResponse,
                payload: 'Finished host response...',
            })
        } catch (e) {
            dispatch({
                type: HostDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    const putContactInfo = async (hostResponse: object) => {
        console.log(`postHostResponse: ${hostResponse} `)
        try {
            dispatch({
                type: HostDashboardActionType.BeginPostResponse,
                payload: 'Posting host info details...',
            })

            await hostsFetcher.putHostContact(hostResponse)

            dispatch({
                type: HostDashboardActionType.FinishPostResponse,
                payload: 'Finished host response...',
            })
        } catch (e) {
            dispatch({
                type: HostDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    const putAddressInfo = async (hostResponse: object) => {
        console.log(`postHostResponse: ${hostResponse} `)
        try {
            dispatch({
                type: HostDashboardActionType.BeginPostResponse,
                payload: 'Posting host info details...',
            })

            await hostsFetcher.putHostAddress(hostResponse)

            dispatch({
                type: HostDashboardActionType.FinishPostResponse,
                payload: 'Finished host response...',
            })
        } catch (e) {
            dispatch({
                type: HostDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    const putGenderInfo = async (hostResponse: object) => {
        console.log(`postHostResponse: ${hostResponse} `)
        try {
            dispatch({
                type: HostDashboardActionType.BeginPostResponse,
                payload: 'Posting host info details...',
            })

            await hostsFetcher.putHostGender(hostResponse)

            dispatch({
                type: HostDashboardActionType.FinishPostResponse,
                payload: 'Finished host response...',
            })
        } catch (e) {
            dispatch({
                type: HostDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    const putLanguageInfo = async (hostResponse: object) => {
        console.log(`postHostResponse: ${hostResponse} `)
        try {
            dispatch({
                type: HostDashboardActionType.BeginPostResponse,
                payload: 'Posting host info details...',
            })

            await hostsFetcher.putHostLanguage(hostResponse)

            dispatch({
                type: HostDashboardActionType.FinishPostResponse,
                payload: 'Finished host response...',
            })
        } catch (e) {
            dispatch({
                type: HostDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    console.log(`destructuring ctx into data and dispatch`)
    console.log(`context is: ${JSON.stringify(context)}`)

    const [data, dispatch] = context as [
        HostDashboardData,
        React.Dispatch<HostDashboardAction>
    ]

    return {
        data,
        dispatch,
        putHostResponse,
        putPersonalInfo,
        putContactInfo,
        putAddressInfo,
        putGenderInfo,
        putLanguageInfo,
    }
}
