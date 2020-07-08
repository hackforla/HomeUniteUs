import * as React from 'react'
import { QuestionType } from '../models/QuestionType'
import { ResponseValue } from '../models/ResponseValue'
import { HostResponse } from '../models/HostResponse'
import { ApiWrapper } from './ApiWrapper'

const HostDashboardContext = React.createContext({})
const hostsFetcher = new ApiWrapper()

interface HostDashboardData {
    hostQuestions: Array<QuestionType>
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
    setHostResponse,
    BeginPostResponse,
    FinishPostResponse,
    Error,
}

interface HostDashboardAction {
    type: HostDashboardActionType
    payload?:
        | HostDashboardData
        | Array<QuestionType>
        | boolean
        | string
        | HostResponse
}

const initialState: HostDashboardData = {
    hostQuestions: [],
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
                hostQuestions: action.payload as Array<QuestionType>,
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
        case HostDashboardActionType.setHostResponse: {
            return {
                ...state,
                hostResponse: action.payload as HostResponse,
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

    //dispatch begin and finish get questions

    React.useEffect(() => {
        ;(async function () {
            console.log('loadData: fetching...')
            try {
                dispatch({
                    type: HostDashboardActionType.BeginFetchQuestions,
                    payload: 'loading',
                })
                const questions = await hostsFetcher.getHostQuestions()

                dispatch({
                    type: HostDashboardActionType.FinishFetchQuestions,
                    payload: questions,
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

    //function + state currently lives in component
    const setResponse = (event: any) => {
        //hard coded
        const response = {
            questionId: 1,
            hostId: 1,
            responseValues: [event.target.value],
        }
        return dispatch({
            type: HostDashboardActionType.setHostResponse,
            payload: response,
        })
    }

    const postHostResponse = (hostResponse: HostResponse) => {
        console.log(`postHostResponse: ${hostResponse} `)
    }

    const [data, dispatch] = context as [
        HostDashboardData,
        React.Dispatch<HostDashboardAction>
    ]

    return {
        data,
        dispatch,
        setResponse,
        postHostResponse,
    }
}
