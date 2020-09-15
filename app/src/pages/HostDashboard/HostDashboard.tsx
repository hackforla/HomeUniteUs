import * as React from 'react'
import {
    useHostDashboardData,
    HostDashboardDataProvider,
} from '../../data/host-context'
import MessageModal from '../../components/MUIModal/MessageModal/MessageModal'
import { useAuth0, Auth0User } from '../../react-auth0-spa'
import {
    Table,
    TableContainer,
    Paper,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Typography,
    MuiThemeProvider,
    Container,
} from '@material-ui/core'
import MUIModal from '../../components/MUIModal/MUIModal'
import { RadioButtons, TextInput } from '../../components/Registration'
import HostFormInfo from '../../components/HostFormDetail/HostFormInfo'
import HostFormLang from '../../components/HostFormDetail/HostFormLang'
import HostFormGender from '../../components/HostFormDetail/HostFormGender'
import HostFormContact from '../../components/HostFormDetail/HostFormContact'
import HostFormAddress from '../../components/HostFormDetail/HostFormAddress'
import { ApiWrapper } from '../../data/ApiWrapper'
import ImageUploadComponent from '../../components/UploadImage/ImageUploadComponent'
import { theme } from '../../components/Registration/theme'
import {
    Photo,
    PhotoCollection,
    HostLanguages,
    Question,
    Host,
    MatchingQuestion,
    InfoQuestion,
    QualifyingQuestion,
    ResponseOption,
} from '../../models/v2'

export const HostDashboardContainer = () => {
    return (
        <HostDashboardDataProvider>
            <HostDashboard />
        </HostDashboardDataProvider>
    )
}

interface HostDashboardState {
    loading: boolean
    messageModal: {
        open: boolean
        text: string
    }
    questionModal: {
        open: boolean
        question: Question
        currentResponse: string
    }
    questions: Array<Question>
    host: Host
    questionsById: Map<string, Question>
    responsesByQuestionId: Map<string, string>
    photos: PhotoCollection
}

const initialState: HostDashboardState = {
    loading: true,
    messageModal: {
        open: false,
        text: 'Modal error',
    },
    questionModal: {
        open: false,
        question: {} as Question,
        currentResponse: '',
    },
    questions: new Array<Question>(),
    host: {} as Host,
    questionsById: new Map<string, Question>(),
    responsesByQuestionId: new Map<string, string>(),
    photos: {
        home: new Array<Photo>(),
        host: new Array<Photo>(),
    },
}

enum HostDashboardActionType {
    LoadQuestions = 'LoadQuestions',
    LoadHost = 'LoadHost',
    ErrorEncountered = 'ErrorEncountered',
    UpdateQuestionsMap = 'UpdateQuestionsMap',
    DisplayQuestion = 'DisplayQuestion',
    CloseMessageModal = 'CloseMessageModal',
    UpdateQuestionResponse = 'UpdateQuestionResponse',
    CloseQuestionModal = 'CloseQuestionModal',
    UpdateResponsesMap = 'UpdateResponsesMap',
    LoadHostImages = 'LoadHostImages',
}

interface HostDashboardAction {
    type: HostDashboardActionType
    payload?:
        | string
        | Host
        | Array<Question>
        | Map<string, Question>
        | QuestionDisplay
        | Map<string, string>
        | PhotoCollection
}

interface QuestionDisplay {
    currentResponse: string
    question: Question
}

const reducer = (
    state: HostDashboardState,
    action: HostDashboardAction
): HostDashboardState => {
    console.log(`at reducer with action = ${JSON.stringify(action)}`)

    switch (action.type) {
        case HostDashboardActionType.LoadHost:
            return {
                ...state,
                host: action.payload as Host,
            }
        case HostDashboardActionType.LoadQuestions:
            return {
                ...state,
                questions: action.payload as Array<Question>,
            }
        case HostDashboardActionType.UpdateQuestionsMap:
            return {
                ...state,
                questionsById: action.payload as Map<string, Question>,
            }

        case HostDashboardActionType.DisplayQuestion:
            const vm = action.payload as QuestionDisplay
            return {
                ...state,
                questionModal: {
                    ...state.questionModal,
                    open: true,
                    question: vm.question,
                    currentResponse: vm.currentResponse,
                },
            }
        case HostDashboardActionType.UpdateQuestionResponse:
            return {
                ...state,
                questionModal: {
                    ...state.questionModal,
                    currentResponse: action.payload as string,
                },
            }
        case HostDashboardActionType.UpdateResponsesMap:
            return {
                ...state,
                responsesByQuestionId: action.payload as Map<string, string>,
            }
        case HostDashboardActionType.LoadHostImages:
            return {
                ...state,
                photos: action.payload as PhotoCollection,
            }
        case HostDashboardActionType.ErrorEncountered:
            return {
                ...state,
                messageModal: {
                    ...state.messageModal,
                    open: true,
                    text: action.payload as string,
                },
            }
        case HostDashboardActionType.CloseMessageModal:
            return {
                ...state,
                messageModal: {
                    ...state.messageModal,
                    open: false,
                },
            }
        case HostDashboardActionType.CloseQuestionModal:
            return {
                ...state,
                questionModal: {
                    ...state.questionModal,
                    open: false,
                },
            }
        default:
            throw new Error(`Unsupported action: ${JSON.stringify(action)}`)
    }
}

export const HostDashboard = () => {
    const { data } = useHostDashboardData()

    const wrapper = new ApiWrapper()

    const [state, dispatch] = React.useReducer(reducer, initialState)

    React.useEffect(() => {
        console.log(`data changed, refreshing host...`)
        refreshHost().then(() => {
            console.log(`...finished refreshing host`)
        })
    }, [data])

    const { user } = useAuth0()

    const refreshHost = async () => {
        try {
            const hostResponse = await fetch('/api/host', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: (user as Auth0User).email }),
            })
            if (hostResponse.status !== 200) {
                throw new Error(hostResponse.statusText)
            }
            const host: Host = await hostResponse.json()
            console.log(`refreshHost: got host: ${JSON.stringify(host)}`)
            dispatch({
                type: HostDashboardActionType.LoadHost,
                payload: host,
            })

            buildIndexes(host, state.questionsById)
        } catch (e) {
            dispatch({
                type: HostDashboardActionType.ErrorEncountered,
                payload: `Error fetching host: ${e}`,
            })
        }
    }

    const refreshPhotos = async () => {
        try {
            const homeImagesResponse = await fetch('/api/host/images/home', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: (user as Auth0User).email,
                }),
            })
            if (homeImagesResponse.status !== 200) {
                throw new Error(homeImagesResponse.statusText)
            }
            const homeImages: Array<Photo> = await homeImagesResponse.json()
            console.log(
                `HostDashboard: homeImages: ${JSON.stringify(homeImages)}`
            )

            const hostImagesResponse = await fetch('/api/host/images/host', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: (user as Auth0User).email,
                }),
            })
            if (hostImagesResponse.status !== 200) {
                throw new Error(hostImagesResponse.statusText)
            }
            const hostImages: Array<Photo> = await hostImagesResponse.json()
            console.log(
                `HostDashboard: hostImages: ${JSON.stringify(hostImages)}`
            )
            dispatch({
                type: HostDashboardActionType.LoadHostImages,
                payload: {
                    home: homeImages,
                    host: hostImages,
                } as PhotoCollection,
            })
        } catch (e) {
            dispatch({
                type: HostDashboardActionType.ErrorEncountered,
                payload: `Error fetching photos: ${e}`,
            })
        }
    }

    const loadData = async () => {
        try {
            const hostResponse = await fetch('/api/host', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: (user as Auth0User).email }),
            })
            if (hostResponse.status !== 200) {
                throw new Error(hostResponse.statusText)
            }
            const host: Host = await hostResponse.json()
            console.log(`HostDashboard: host: ${JSON.stringify(host)}`)

            const qualifyingResponse = await fetch(
                '/api/host/registration/qualifying'
            )
            if (qualifyingResponse.status !== 200) {
                throw new Error(qualifyingResponse.statusText)
            }
            const qualifying: Array<QualifyingQuestion> = await qualifyingResponse.json()
            console.log(
                `HostDashboard: qualifying: ${JSON.stringify(qualifying)}`
            )

            const matchingResponse = await fetch(
                '/api/host/registration/matching'
            )
            if (matchingResponse.status !== 200) {
                throw new Error(matchingResponse.statusText)
            }
            const matching: Array<MatchingQuestion> = await matchingResponse.json()
            console.log(`HostDashboard: matching: ${JSON.stringify(matching)}`)

            const infoResponse = await fetch('/api/host/registration/info')
            if (infoResponse.status !== 200) {
                throw new Error(infoResponse.statusText)
            }
            const info: Array<InfoQuestion> = await infoResponse.json()
            console.log(`HostDashboard: info: ${JSON.stringify(info)}`)

            await refreshPhotos()
            // const homeImagesResponse = await fetch('/api/host/images/home', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         email: (user as Auth0User).email,
            //     }),
            // })
            // if (homeImagesResponse.status !== 200) {
            //     throw new Error(homeImagesResponse.statusText)
            // }
            // const homeImages: Array<Photo> = await homeImagesResponse.json()
            // console.log(
            //     `HostDashboard: homeImages: ${JSON.stringify(homeImages)}`
            // )

            // const hostImagesResponse = await fetch('/api/host/images/host', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         email: (user as Auth0User).email,
            //     }),
            // })
            // if (hostImagesResponse.status !== 200) {
            //     throw new Error(hostImagesResponse.statusText)
            // }
            // const hostImages: Array<Photo> = await hostImagesResponse.json()
            // console.log(
            //     `HostDashboard: hostImages: ${JSON.stringify(hostImages)}`
            // )

            dispatch({
                type: HostDashboardActionType.LoadQuestions,
                payload: [
                    ...matching,
                    ...qualifying,
                    ...info,
                ].sort((a: Question, b: Question) =>
                    a.order < b.order ? -1 : 1
                ),
            })
            dispatch({
                type: HostDashboardActionType.LoadHost,
                payload: host,
            })
            // dispatch({
            //     type: HostDashboardActionType.LoadHostImages,
            //     payload: {
            //         home: homeImages,
            //         host: hostImages,
            //     } as PhotoCollection,
            // })

            const qsById = new Map<string, Question>()
            ;[...matching, ...qualifying, ...info].forEach((q: Question) => {
                qsById.set(q.id, q)
            })
            dispatch({
                type: HostDashboardActionType.UpdateQuestionsMap,
                payload: qsById,
            })
            buildIndexes(host, qsById)
        } catch (e) {
            dispatch({
                type: HostDashboardActionType.ErrorEncountered,
                payload: `System error: ${e}`,
            })
        }
    }

    React.useEffect(() => {
        loadData()
    }, [])

    function buildIndexes(host: Host, questionsById: Map<string, Question>) {
        const responsesById = new Map<string, string>()
        console.log(`*** buildIndexes ***`)
        console.log(`- host: ${JSON.stringify(host)}`)
        console.log(`- questionsById: ${JSON.stringify(questionsById)}`)
        console.log(`*** Generating responsesById ***`)
        // const { host, questionsById } = state
        if (host.qualifyingResponses) {
            for (let key in host.qualifyingResponses) {
                console.log(
                    `- qualifyingResponse for question ${key}: ${JSON.stringify(
                        host.qualifyingResponses[key]
                    )}`
                )
                const question = questionsById.get(key) as QualifyingQuestion
                console.log(`- got question ${JSON.stringify(question)}`)
                if (question) {
                    const answer = question.options.find(
                        (v: ResponseOption) => {
                            console.log(
                                `--- checking response id ${
                                    host.qualifyingResponses[key]
                                } against ${v.id.toString()}`
                            )

                            if (
                                v.id.toString() ===
                                host.qualifyingResponses[key].toString()
                            ) {
                                console.log('-------------yes')
                                return true
                            } else {
                                return false
                            }
                        }
                    )
                    console.log(`------answer: ${JSON.stringify(answer)}`)
                    responsesById.set(
                        key,
                        answer
                            ? answer.label
                            : `Bad Qualifying Response ID: ${key}`
                    )
                }
            }
        }
        if (host.matchingResponses) {
            for (let key in host.matchingResponses) {
                console.log(
                    `- qualifyingResponse for question ${key}: ${JSON.stringify(
                        host.matchingResponses[key]
                    )}`
                )
                const question = questionsById.get(key) as MatchingQuestion
                if (question) {
                    console.log(`- got question ${JSON.stringify(question)}`)
                    if (question.type === 'radio') {
                        const answer = question.options.find(
                            (v: ResponseOption) => {
                                console.log(
                                    `--- checking response id ${
                                        host.matchingResponses[key]
                                    } against ${v.id.toString()}`
                                )
                                if (
                                    v.id.toString() ===
                                    host.matchingResponses[key]
                                ) {
                                    console.log('-------------yes')
                                    return true
                                } else {
                                    return false
                                }
                            }
                        )
                        // responsesById.set(key, host.matchingResponses[key])
                        console.log(`------answer: ${JSON.stringify(answer)}`)
                        responsesById.set(
                            key,
                            answer
                                ? answer.label
                                : `Bad Matching Response ID: ${key}`
                        )
                    } else {
                        responsesById.set(key, `${host.matchingResponses[key]}`)
                    }
                }
            }
        }
        dispatch({
            type: HostDashboardActionType.UpdateResponsesMap,
            payload: responsesById,
        })
    }

    const uploadFilesWithSubject = async (
        files: Array<File>,
        subject: string
    ) => {
        files.forEach(async (f: File, index: number) => {
            try {
                const payload = new FormData()
                payload.append('email', (user as Auth0User).email)
                payload.append('subject', subject)
                payload.append('image', f)
                const response = await fetch('/api/uploadImage', {
                    method: 'POST',
                    body: payload,
                })
                if (response.status !== 200) {
                    throw new Error(`file ${index}: ${response.statusText}`)
                }
            } catch (e) {
                dispatch({
                    type: HostDashboardActionType.ErrorEncountered,
                    payload: `Error uploading file: ${e}`,
                })
            }
        })
    }

    const openQuestionForm = (questionId: string) => {
        console.log(`openQuestionForm: questionId = ${questionId}`)
        const q = state.questionsById.get(questionId) as Question
        console.log(`openQuestionForm: q = ${JSON.stringify(q)}`)

        console.log(`host = ${JSON.stringify(state.host)}`)

        console.log(`********************************`)
        console.log(`*** Looking for for ${q.id} ***`)
        console.log(`********************************`)
        let resp = ''
        if (state.host.matchingResponses) {
            console.log(
                `matchingResponses: ${JSON.stringify(
                    state.host.matchingResponses
                )}`
            )
            if (q.id in state.host.matchingResponses) {
                console.log(
                    `...found entry in matchingResponses: ${
                        state.host.matchingResponses[q.id]
                    }`
                )
                resp = state.host.matchingResponses[q.id] as string
            }
        }
        if (state.host.qualifyingResponses) {
            console.log(
                `qualifyingResponse: ${JSON.stringify(
                    state.host.qualifyingResponses
                )}`
            )

            if (q.id in state.host.qualifyingResponses) {
                console.log(
                    `...found entry in qualifyingResponses: ${
                        state.host.qualifyingResponses[q.id]
                    }`
                )
                resp = state.host.qualifyingResponses[q.id] as string
            }
        }

        // Array.from(state.host.matchingResponses).forEach(
        //     (matchingResponse: any) => {
        //         console.log(
        //             `Inspecting matchingResponse: ${JSON.stringify(
        //                 matchingResponse
        //             )}`
        //         )
        //         if (q.id in matchingResponse) {
        //             resp = matchingResponse[q.id]
        //         }
        //     }
        // )
        // Array.from(state.host.qualifyingResponses).forEach(
        //     (qualifyingResponse: any) => {
        //         console.log(
        //             `Inspecting qualifyingResponse: ${JSON.stringify(
        //                 qualifyingResponse
        //             )}`
        //         )
        //         if (q.id in qualifyingResponse) {
        //             resp = qualifyingResponse[q.id]
        //         }
        //     }
        // )

        dispatch({
            type: HostDashboardActionType.DisplayQuestion,
            payload: {
                question: q,
                currentResponse: resp,
            },
        })
    }

    const QuestionModalContent = () => {
        console.log(
            `In switch case for question: ${JSON.stringify(
                state.questionModal.question
            )}`
        )
        if (!state.questionModal.question.group) {
            return <div>No question selected</div>
        }
        switch (state.questionModal.question.group) {
            case 'Qualifying':
                const qq = state.questionModal.question as QualifyingQuestion
                return (
                    <div>
                        <RadioButtons
                            name={qq.id}
                            value={state.questionModal.currentResponse}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                                value?: string
                            ) => {
                                console.log(
                                    `changing Qualifying response: quesiton ${qq.id} = ${value}`
                                )
                                dispatch({
                                    type:
                                        HostDashboardActionType.UpdateQuestionResponse,
                                    payload: value as string,
                                })
                            }}
                            ariaLabel="Select One"
                            options={qq.options}
                        />
                    </div>
                )

            case 'info':
                const iq = state.questionModal.question as InfoQuestion
                return (() => {
                    switch (iq.question) {
                        case 'bio':
                            return (
                                <HostFormInfo
                                    infoDetails={state.host.info || {}}
                                    onSubmitComplete={() => {
                                        console.log(
                                            'HostFormInfo:onSubmitComplete'
                                        )

                                        dispatch({
                                            type:
                                                HostDashboardActionType.CloseQuestionModal,
                                        })
                                    }}
                                />
                            )
                        case 'address':
                            return (
                                <HostFormAddress
                                    addressDetails={state.host.address || {}}
                                    onSubmitComplete={() => {
                                        console.log(
                                            'HostFormAddress:onSubmitComplete'
                                        )

                                        dispatch({
                                            type:
                                                HostDashboardActionType.CloseQuestionModal,
                                        })
                                    }}
                                />
                            )
                        case 'contact':
                            return (
                                <HostFormContact
                                    contactDetails={state.host.contact || {}}
                                    onSubmitComplete={async () => {
                                        console.log(
                                            'HostFormContact:onSubmitComplete'
                                        )

                                        dispatch({
                                            type:
                                                HostDashboardActionType.CloseQuestionModal,
                                        })
                                    }}
                                />
                            )
                        case 'gender':
                            return (
                                <HostFormGender
                                    genderDetails={state.host.gender || {}}
                                    onSubmitComplete={() => {
                                        console.log(
                                            'HostFormGender:onSubmitComplete'
                                        )

                                        dispatch({
                                            type:
                                                HostDashboardActionType.CloseQuestionModal,
                                        })
                                    }}
                                />
                            )
                        case 'homephoto':
                            return (
                                <ImageUploadComponent
                                    uploadAll={async (files: Array<File>) => {
                                        console.log(
                                            `ImageUploadComponent:uploadAll: `
                                        )
                                        //TODO Context: Add file upload method to ApiWrapper
                                        //   and useHostDashboardData hook
                                        await uploadFilesWithSubject(
                                            files,
                                            'home'
                                        )
                                        dispatch({
                                            type:
                                                HostDashboardActionType.CloseQuestionModal,
                                        })
                                        await refreshPhotos()
                                    }}
                                    images={state.photos.home}
                                />
                            )
                        case 'hostphoto':
                            return (
                                <ImageUploadComponent
                                    uploadAll={async (files: Array<File>) => {
                                        console.log(
                                            `ImageUploadComponent:uploadAll: `
                                        )
                                        //TODO Context: Add file upload method to ApiWrapper
                                        //   and useHostDashboardData hook
                                        await uploadFilesWithSubject(
                                            files,
                                            'host'
                                        )
                                        dispatch({
                                            type:
                                                HostDashboardActionType.CloseQuestionModal,
                                        })
                                        await refreshPhotos()
                                    }}
                                    images={state.photos.host}
                                />
                            )
                        case 'language':
                            return (
                                <HostFormLang
                                    languages={
                                        state.host.language
                                            ? state.host.language[
                                                  'language'
                                              ].map((l: string) => {
                                                  return {
                                                      language: l,
                                                  }
                                              })
                                            : null
                                    }
                                    onSubmit={(languages: HostLanguages) => {
                                        console.log(
                                            `submitting languages: ${JSON.stringify(
                                                languages
                                            )}`
                                        )

                                        //TODO Context: Modify useHostDashboardData to submit this
                                        /// as flattened list

                                        const languagesPayload = languages.map(
                                            (value: { language: string }) =>
                                                value.language
                                        )

                                        fetch(
                                            '/api/host/registration/language',
                                            {
                                                method: 'PUT',
                                                headers: {
                                                    'Content-Type':
                                                        'application/json',
                                                },
                                                body: JSON.stringify({
                                                    email: (user as Auth0User)
                                                        .email,
                                                    language: languagesPayload,
                                                }),
                                            }
                                        )

                                        dispatch({
                                            type:
                                                HostDashboardActionType.CloseQuestionModal,
                                        })

                                        refreshHost()
                                    }}
                                />
                            )
                        default:
                            throw new Error(
                                `Bad info question: ${JSON.stringify(iq)}`
                            )
                    }
                })()
            default:
                const mq = state.questionModal.question as MatchingQuestion
                if (!mq.group) {
                    return (
                        <div>
                            <h3>System error</h3>
                        </div>
                    )
                }
                return (
                    <div>
                        {mq.type === 'radio' ? (
                            <RadioButtons
                                name={mq.id}
                                value={state.questionModal.currentResponse}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                    value?: string
                                ) => {
                                    console.log(
                                        `changing Matching response: quesiton ${mq.id} = ${value}`
                                    )
                                    dispatch({
                                        type:
                                            HostDashboardActionType.UpdateQuestionResponse,
                                        payload: value as string,
                                    })
                                }}
                                ariaLabel="Select One"
                                options={mq.options}
                            />
                        ) : (
                            <TextInput
                                name={mq.id}
                                value={state.questionModal.currentResponse}
                                onChange={(
                                    event: React.ChangeEvent<
                                        HTMLTextAreaElement
                                    >
                                ) => {
                                    console.log(
                                        `changing Matching response: quesiton ${mq.id} = ${event.target.value}`
                                    )
                                    dispatch({
                                        type:
                                            HostDashboardActionType.UpdateQuestionResponse,
                                        payload: event.target.value,
                                    })
                                }}
                            />
                        )}
                    </div>
                )
        }
    }

    const FormControlPanel = () => {
        return (
            <div>
                <Button
                    style={{ backgroundColor: 'black' }}
                    onClick={async () => {
                        dispatch({
                            type: HostDashboardActionType.CloseQuestionModal,
                        })

                        if (
                            state.questionModal.question.group === 'Qualifying'
                        ) {
                            try {
                                console.log(
                                    `submitting qualifying question ${state.questionModal.question.id}: ${state.questionModal.currentResponse}`
                                )
                                const r = await fetch(
                                    `/api/host/registration/qualifying/${state.questionModal.question.id}`,
                                    {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            email: (user as Auth0User).email,
                                            response:
                                                state.questionModal
                                                    .currentResponse,
                                        }),
                                    }
                                )
                                if (r.status !== 200) {
                                    throw new Error(r.statusText)
                                }
                                const d = await r.json()
                                await refreshHost()
                            } catch (e) {
                                dispatch({
                                    type:
                                        HostDashboardActionType.ErrorEncountered,
                                    payload: `Error updating qualifying response: ${e}`,
                                })
                            }
                        } else {
                            try {
                                console.log(
                                    `submitting matching question ${state.questionModal.question.id}: ${state.questionModal.currentResponse}`
                                )
                                const r = await fetch(
                                    `/api/host/registration/matching/${state.questionModal.question.id}`,
                                    {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            email: (user as Auth0User).email,
                                            response:
                                                state.questionModal
                                                    .currentResponse,
                                        }),
                                    }
                                )
                                if (r.status !== 200) {
                                    throw new Error(r.statusText)
                                }
                                const d = await r.json()
                                await refreshHost()
                            } catch (e) {
                                dispatch({
                                    type:
                                        HostDashboardActionType.ErrorEncountered,
                                    payload: `Error updating matching response: ${e}`,
                                })
                            }
                        }

                        // const responses = {
                        //     ...state.host.matchingResponses,
                        // }

                        // responses[
                        //     state.questionModal.question.id
                        // ] = state.questionModal.currentResponse

                        // dispatch({
                        //     type:
                        //         HostDashboardActionType.LoadHost,
                        //     payload: {
                        //         ...state.host,
                        //         matchingResponses: responses,
                        //     },
                        // })
                    }}
                >
                    OK
                </Button>
            </div>
        )
    }

    const mapQuestiontoTableRow = (q: Question, index: number) => {
        let hasResponse = false
        if (state.responsesByQuestionId.get(q.id)) {
            hasResponse = true
        } else if (q.group === 'info') {
            switch (q.question) {
                case 'bio':
                    hasResponse = !!state.host.info
                    break
                case 'address':
                    hasResponse = !!state.host.address
                    break
                case 'contact':
                    hasResponse = !!state.host.contact
                    break
                case 'gender':
                    hasResponse = !!state.host.gender
                    break
                case 'homephoto':
                    hasResponse = state.photos.home.length > 0
                    break
                case 'hostphoto':
                    hasResponse = state.photos.host.length > 0
                    break
                case 'language':
                    hasResponse = !!state.host.language
                    break
                default:
                    throw new Error(`Bad info question: ${JSON.stringify(q)}`)
            }
        }
        return (
            <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{`${q.question[0].toUpperCase()}${q.question.slice(
                    1
                )}`}</TableCell>
                <TableCell>
                    {hasResponse
                        ? q.group === 'info'
                            ? 'OK'
                            : state.responsesByQuestionId.get(q.id)
                        : 'Not Answered'}
                </TableCell>
                <TableCell>
                    <Button
                        style={
                            hasResponse
                                ? {
                                      backgroundColor: 'black',
                                  }
                                : {
                                      backgroundColor: 'orange',
                                  }
                        }
                        onClick={() => {
                            openQuestionForm(q.id)
                        }}
                    >
                        {hasResponse ? 'Update response' : 'PLEASE RESPOND'}
                    </Button>
                </TableCell>
            </TableRow>
        )
    }

    return (
        <>
            <MuiThemeProvider theme={theme}>
                <Container>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <h4>Order</h4>
                                    </TableCell>
                                    <TableCell>
                                        <h4>Question</h4>
                                    </TableCell>
                                    <TableCell>
                                        <h4>Response</h4>
                                    </TableCell>
                                    <TableCell>
                                        <h4>Edit</h4>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state.questions.map(mapQuestiontoTableRow)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>

                <MessageModal
                    modalMessage={state.messageModal.text}
                    modalOpen={state.messageModal.open}
                    modalHeadingText="System error"
                    onCancel={() => {
                        dispatch({
                            type: HostDashboardActionType.CloseMessageModal,
                        })
                    }}
                />

                <MUIModal
                    modalOpen={state.questionModal.open}
                    handleClose={() => {
                        dispatch({
                            type: HostDashboardActionType.CloseQuestionModal,
                        })
                    }}
                    disableBackdropClick={true}
                >
                    <div>
                        <Typography>
                            {state.questionModal.question.question}
                        </Typography>
                        <div>
                            <QuestionModalContent />
                        </div>
                        {state.questionModal.question.group ===
                        'info' ? null : (
                            <FormControlPanel />
                        )}
                    </div>
                </MUIModal>
            </MuiThemeProvider>
        </>
    )
}
