import * as React from 'react'
import { QuestionType as HostQuestion } from '../models/QuestionType'
import { ResponseValue as HostResponseValue } from '../models/ResponseValue'

const HostDashboardContext = React.createContext({})

interface HostDashboardState {
    hostQuestions: Array<HostQuestion>
    hostResponses: Array<HostResponseValue>
    loaderState: {
        loading: boolean
        text: string
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
    payload?: HostDashboardState | Array<HostQuestion> | boolean | string
}

const initialState: HostDashboardState = {
    hostQuestions: [],
    hostResponses: [],
    loaderState: {
        loading: false,
        text: '',
    },
}
