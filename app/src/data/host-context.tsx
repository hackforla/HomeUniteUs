import * as React from 'react'
import { QuestionType } from '../models/QuestionType'
import { ResponseValue } from '../models/ResponseValue'

const HostDashboardContext = React.createContext({})

interface HostDashboardData {
    hostQuestions: Array<QuestionType>
    hostResponses: Array<ResponseValue>
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
    BeginPostAnswer,
    FinishPostAnswer,
}

interface HostDashboardAction {
    type: HostDashboardActionType
    payload?: HostDashboardData | Array<QuestionType> | boolean | string
}

const initialState: HostDashboardData = {
    hostQuestions: [],
    hostResponses: [],
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
    const value = React.useMemo(() => [state, dispatch], [state])
    return <HostDashboardContext.Provider value={value} {...props} />
}

export function useHostDashboardData() {
    const context = React.useContext(HostDashboardContext)
    if (!context) {
        throw new Error(
            'useHostDashboardData must be used within a HostDashboardProvider'
        )
    }

    const [data, dispatch] = context as [
        HostDashboardData,
        React.Dispatch<HostDashboardAction>
    ]

    return {
        data,
    }
}
