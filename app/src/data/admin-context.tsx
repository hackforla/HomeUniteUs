import * as React from 'react'
import {
    Host,
    MatchingQuestion,
    QualifyingQuestion,
    Question,
    ResponseOption,
} from '../models/v2'
import { HostResponse } from '../models/HostResponse'
import { ApiWrapper } from './ApiWrapper'

const AdminDashboardContext = React.createContext({})
const apiClient = new ApiWrapper()

interface AdminDashboardData {
    guestShowstopperQuestions: Array<QualifyingQuestion>
    guestMatchingQuestions: Array<MatchingQuestion>
    hostShowstopperQuestions: Array<QualifyingQuestion>
    hostMatchingQuestions: Array<MatchingQuestion>
    hostResponse: HostResponse | null
    loaderState: {
        loading: boolean
        message: string
    }
    host?: Host
}

enum AdminDashboardActionType {
    BeginFetchQuestions,
    FinishFetchQuestions,
    GetHostById,
    isLoading,
    BeginPostResponse,
    FinishPostResponse,
    Error,
}

interface AdminDashboardAction {
    type: AdminDashboardActionType
    payload?:
        | AdminDashboardData
        | Array<QualifyingQuestion>
        | Array<MatchingQuestion>
        | string
        | HostResponse
        | any // how to resolve this any type on get questions payload?
}

const initialState: AdminDashboardData = {
    hostShowstopperQuestions: [],
    hostMatchingQuestions: [],
    guestShowstopperQuestions: [],
    guestMatchingQuestions: [],
    hostResponse: null,
    loaderState: {
        loading: false,
        message: '',
    },
}

function adminDashboardReducer(
    state: AdminDashboardData,
    action: AdminDashboardAction
): AdminDashboardData {
    switch (action.type) {
        case AdminDashboardActionType.BeginFetchQuestions: {
            return {
                ...state,
                loaderState: {
                    loading: true,
                    message: action.payload as string,
                },
            }
        }
        case AdminDashboardActionType.FinishFetchQuestions: {
            return {
                ...state,
                loaderState: {
                    ...state.loaderState,
                    loading: false,
                },
                hostShowstopperQuestions: action.payload[0] as Array<
                    QualifyingQuestion
                >,
                hostMatchingQuestions: action.payload[1] as Array<
                    MatchingQuestion
                >,
                guestShowstopperQuestions: action.payload[2] as Array<
                    QualifyingQuestion
                >,
                guestMatchingQuestions: action.payload[3] as Array<
                    MatchingQuestion
                >,
            }
        }
        case AdminDashboardActionType.BeginPostResponse: {
            return {
                ...state,
                loaderState: {
                    loading: true,
                    message: action.payload as string,
                },
            }
        }
        case AdminDashboardActionType.FinishPostResponse: {
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

export function AdminDashboardDataProvider(
    props: React.PropsWithChildren<{}>
): JSX.Element {
    const [state, dispatch] = React.useReducer(
        adminDashboardReducer,
        initialState
    )

    React.useEffect(() => {
        ;(async function () {
            console.log('loadData: fetching...')
            try {
                dispatch({
                    type: AdminDashboardActionType.BeginFetchQuestions,
                    payload: 'Retrieving host questions...',
                })

                const hostQuestions = await Promise.all([
                    apiClient.getHostShowstopperQuestions(),
                    apiClient.getHostMatchingQuestions(),
                ])

                const guestQuestions = await Promise.all([
                    apiClient.getGuestShowstopperQuestions(),
                    apiClient.getGuestMatchingQuestions(),
                ])

                //set on state
                // const showstopperQuestionsMap = new Map<
                //     string,
                //     MatchingQuestionType
                // >()
                // hostQuestions[0].map((question: MatchingQuestionType) => {
                //     return showstopperQuestionsMap.set(question.id, question)
                // })

                // const matchingQuestionsMap = new Map<
                //     string,
                //     ShowstopperQuestionType
                // >()
                // hostQuestions[1].map((question: ShowstopperQuestionType) => {
                //     return matchingQuestionsMap.set(question.id, question)
                // })

                dispatch({
                    type: AdminDashboardActionType.FinishFetchQuestions,
                    payload: hostQuestions,
                })
            } catch (e) {
                dispatch({
                    type: AdminDashboardActionType.Error,
                    payload: `System error: ${e}`,
                })
            }
        })()
    }, [])

    const value = React.useMemo(() => [state, dispatch], [state])
    console.log(
        `AdminDashboardDataProvider: Setting context value as: ${JSON.stringify(
            value
        )}`
    )
    return <AdminDashboardContext.Provider value={value} {...props} />
}

export function useAdminDashboardData() {
    const context = React.useContext(AdminDashboardContext)
    console.log('this is context in a custom hook', context)
    if (!context) {
        throw new Error(
            'useAdminDashboardData must be used within a AdminDashboardProvider'
        )
    }

    // showstopper & matching
    const putShowstopperResponse = async (
        id: number | string,
        hostResponse: HostResponse
    ) => {
        console.log(`postHostResponse: ${hostResponse} `)
        try {
            dispatch({
                type: AdminDashboardActionType.BeginPostResponse,
                payload: 'Posting host qualifying response...',
            })

            await apiClient.putShowstopperQuestionResponse(id, hostResponse)

            dispatch({
                type: AdminDashboardActionType.FinishPostResponse,
                payload: 'Finished host qualifying response...',
            })
        } catch (e) {
            dispatch({
                type: AdminDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    const putMatchingResponse = async (
        id: number | string,
        hostResponse: HostResponse
    ) => {
        console.log(`postHostResponse: ${hostResponse} `)
        try {
            dispatch({
                type: AdminDashboardActionType.BeginPostResponse,
                payload: 'Posting host matching response...',
            })

            await apiClient.putMatchingQuestionResponse(id, hostResponse)

            dispatch({
                type: AdminDashboardActionType.FinishPostResponse,
                payload: 'Finished host matching response...',
            })
        } catch (e) {
            dispatch({
                type: AdminDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    // form detail
    const putPersonalInfo = async (hostResponse: object) => {
        console.log(`postHostResponse: ${hostResponse} `)
        try {
            dispatch({
                type: AdminDashboardActionType.BeginPostResponse,
                payload: 'Posting host info details...',
            })

            await apiClient.putHostInformation(hostResponse)

            dispatch({
                type: AdminDashboardActionType.FinishPostResponse,
                payload: 'Finished host response...',
            })
        } catch (e) {
            dispatch({
                type: AdminDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    const putContactInfo = async (hostResponse: object) => {
        console.log(`postHostResponse: ${hostResponse} `)
        try {
            dispatch({
                type: AdminDashboardActionType.BeginPostResponse,
                payload: 'Posting host info details...',
            })

            await apiClient.putHostContact(hostResponse)

            dispatch({
                type: AdminDashboardActionType.FinishPostResponse,
                payload: 'Finished host response...',
            })
        } catch (e) {
            dispatch({
                type: AdminDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    const putAddressInfo = async (hostResponse: object) => {
        console.log(`postHostResponse: ${hostResponse} `)
        try {
            dispatch({
                type: AdminDashboardActionType.BeginPostResponse,
                payload: 'Posting host info details...',
            })

            await apiClient.putHostAddress(hostResponse)

            dispatch({
                type: AdminDashboardActionType.FinishPostResponse,
                payload: 'Finished host response...',
            })
        } catch (e) {
            dispatch({
                type: AdminDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    const putGenderInfo = async (hostResponse: object) => {
        console.log(`postHostResponse: ${hostResponse} `)
        try {
            dispatch({
                type: AdminDashboardActionType.BeginPostResponse,
                payload: 'Posting host info details...',
            })

            await apiClient.putHostGender(hostResponse)

            dispatch({
                type: AdminDashboardActionType.FinishPostResponse,
                payload: 'Finished host response...',
            })
        } catch (e) {
            dispatch({
                type: AdminDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    const putLanguageInfo = async (hostResponse: object) => {
        console.log(`postHostResponse: ${hostResponse} `)
        try {
            dispatch({
                type: AdminDashboardActionType.BeginPostResponse,
                payload: 'Posting host info details...',
            })

            await apiClient.putHostLanguage(hostResponse)

            dispatch({
                type: AdminDashboardActionType.FinishPostResponse,
                payload: 'Finished host response...',
            })
        } catch (e) {
            dispatch({
                type: AdminDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    const refreshQuestions = async () => {
        try {
            dispatch({
                type: AdminDashboardActionType.BeginFetchQuestions,
                payload: 'Retrieving host questions...',
            })

            const hostQuestions = await Promise.all([
                apiClient.getHostShowstopperQuestions(),
                apiClient.getHostMatchingQuestions(),
            ])

            //set on state
            // const showstopperQuestionsMap = new Map<
            //     string,
            //     MatchingQuestionType
            // >()
            // hostQuestions[0].map((question: MatchingQuestionType) => {
            //     return showstopperQuestionsMap.set(question.id, question)
            // })

            // const matchingQuestionsMap = new Map<
            //     string,
            //     ShowstopperQuestionType
            // >()
            // hostQuestions[1].map((question: ShowstopperQuestionType) => {
            //     return matchingQuestionsMap.set(question.id, question)
            // })

            dispatch({
                type: AdminDashboardActionType.FinishFetchQuestions,
                payload: hostQuestions,
            })
        } catch (e) {
            dispatch({
                type: AdminDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    const addHostResponseOption = async (
        questionId: string,
        responseOption: ResponseOption
    ) => {
        try {
            dispatch({
                type: AdminDashboardActionType.BeginFetchQuestions,
                payload: 'Adding response option...',
            })
            await apiClient.addResponseOption(
                'host',
                questionId,
                responseOption
            )
            await refreshQuestions()
        } catch (e) {
            dispatch({
                type: AdminDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    const getShowstopperQuestionById = (id: number) => {
        //dispatch
        //return showstopperQuestionMap[id]
    }

    const getMatchingQuestionById = (id: number) => {
        //dispatch
        //return matchingQuestionMap[id]
    }
    console.log(`about to destructure context`)
    const [data, dispatch] = context as [
        AdminDashboardData,
        React.Dispatch<AdminDashboardAction>
    ]
    console.log(`about to destructure context`)

    const deleteMatchingQuestion = async (questionId: string) => {
        try {
            dispatch({
                type: AdminDashboardActionType.BeginFetchQuestions,
                payload: 'Deleting question',
            })
            await apiClient.deleteQuestion('host', 'Matching', questionId)
            await refreshQuestions()
        } catch (e) {
            dispatch({
                type: AdminDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    const updateMatchingQuestion = async (question: MatchingQuestion) => {
        try {
            dispatch({
                type: AdminDashboardActionType.BeginFetchQuestions,
                payload: 'Updating question',
            })
            await apiClient.updateQuestion('host', 'Matching', question)
            await refreshQuestions()
        } catch (e) {
            dispatch({
                type: AdminDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    const updateHostResponseOption = async (
        questionId: string,
        responseOption: ResponseOption
    ) => {
        try {
            dispatch({
                type: AdminDashboardActionType.BeginFetchQuestions,
                payload: 'Updating question',
            })
            await apiClient.updateResponseOption(
                'host',
                questionId,
                responseOption
            )
            await refreshQuestions()
        } catch (e) {
            dispatch({
                type: AdminDashboardActionType.Error,
                payload: `System error: ${e}`,
            })
        }
    }

    return {
        data,
        dispatch,
        getShowstopperQuestionById,
        getMatchingQuestionById,
        putShowstopperResponse,
        putMatchingResponse,
        putPersonalInfo,
        putContactInfo,
        putAddressInfo,
        putGenderInfo,
        putLanguageInfo,
        addHostResponseOption,
        updateHostResponseOption,
        deleteMatchingQuestion,
        updateMatchingQuestion,
    }
}
