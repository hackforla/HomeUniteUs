import * as React from 'react'
import { useHostDashboardData } from '../../data/host-context'
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
    Modal,
    Typography,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@material-ui/core'
import MUIModal from '../../components/MUIModal/MUIModal'

type QuestionType = 'Qualifying' | 'Info' | 'Matching'

interface GenericQuestion {
    id: string
    group: QuestionType
    question: string
    order: number
}

interface QualifyingQuestion extends GenericQuestion {}

interface ResponseOption {
    text: string
    id: number
    value: string
}

interface MatchingQuestion extends GenericQuestion {
    subgroup: string
    options: Array<ResponseOption>
    type: string
}

interface InfoQuestion extends GenericQuestion {
    subgroup: string
    options: Array<ResponseOption>
    type: string
}

type Question = InfoQuestion | MatchingQuestion | QualifyingQuestion

interface GenericQuestionResponseSet {
    [index: string]: string | number | Array<string>
}

interface Host {
    _id: string
    email: string
    info: any
    contact: any
    address: any
    language: any
    gender: any
    matchingResponses: any
    qualifyingResponses: any
    // matchingResponses: Map<string, string | number | Array<string>>
    // qualifyingResponses: Map<string, string | number | Array<string>>
    // matchingResponses: GenericQuestionResponseSet
    // qualifyingResponses: GenericQuestionResponseSet
}

export const HostDashboard = () => {
    // get the questions
    // get this user's responses
    // compose into viewmodel for display
    // react-route to question screen: /host/registration/{group}/{id?}

    // const { data } = useHostDashboardData()

    const { user } = useAuth0()

    const [state, setState] = React.useState({
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
    })

    const loadData = async () => {
        try {
            //get host
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

            //get qualifying qs
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

            //get matching qs
            const matchingResponse = await fetch(
                '/api/host/registration/matching'
            )
            if (matchingResponse.status !== 200) {
                throw new Error(matchingResponse.statusText)
            }
            const matching: Array<MatchingQuestion> = await matchingResponse.json()
            console.log(`HostDashboard: matching: ${JSON.stringify(matching)}`)
            //get info qs
            const infoResponse = await fetch('/api/host/registration/info')
            if (infoResponse.status !== 200) {
                throw new Error(infoResponse.statusText)
            }
            const info: Array<InfoQuestion> = await infoResponse.json()
            console.log(`HostDashboard: info: ${JSON.stringify(info)}`)
            setState({
                ...state,
                questions: [
                    ...state.questions,
                    ...matching,
                    ...qualifying,
                    ...info,
                ].sort((a: Question, b: Question) =>
                    a.order < b.order ? -1 : 1
                ),
                host: host,
            })
        } catch (e) {
            setState({
                ...state,
                messageModal: {
                    ...state.messageModal,
                    open: true,
                    text: `System error: ${e}`,
                },
            })
        }
    }

    React.useEffect(() => {
        const qsById = new Map<string, Question>(state.questionsById)
        state.questions.forEach((q: Question) => {
            qsById.set(q.id, q)
        })
        setState({
            ...state,
            questionsById: qsById,
        })
    }, [state.questions])

    React.useEffect(() => {
        loadData()
    }, [])

    const openQuestionForm = (questionId: string) => {
        console.log(`openQuestionForm: questionId = ${questionId}`)
        const q = state.questionsById.get(questionId) as Question
        console.log(`openQuestionForm: q = ${JSON.stringify(q)}`)

        console.log(`host = ${JSON.stringify(state.host)}`)

        console.log(
            `checking for ${q.id} in ${JSON.stringify(
                state.host.matchingResponses
            )}`
        )

        let resp = ''
        if (q.id in state.host.matchingResponses) {
            resp = state.host.matchingResponses[q.id] as string
        }
        console.log(
            `checking for ${q.id} in ${JSON.stringify(
                state.host.matchingResponses
            )}`
        )
        if (q.id in state.host.qualifyingResponses) {
            resp = state.host.qualifyingResponses[q.id] as string
        }

        setState({
            ...state,
            questionModal: {
                ...state.questionModal,
                question: q,
                open: true,
                currentResponse: resp,
            },
        })
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Question</TableCell>
                            <TableCell>Response</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.questions.map((q: Question, index: number) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell>{q.question}</TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => {
                                                openQuestionForm(q.id)
                                            }}
                                        >
                                            ANSWER
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <MessageModal
                modalMessage={state.messageModal.text}
                modalOpen={state.messageModal.open}
                modalHeadingText="System error"
                onCancel={() =>
                    setState({
                        ...state,
                        messageModal: { ...state.messageModal, open: false },
                    })
                }
            />

            <MUIModal
                modalOpen={state.questionModal.open}
                handleClose={() => {
                    setState({
                        ...state,
                        questionModal: { ...state.questionModal, open: false },
                    })
                }}
                disableBackdropClick={true}
            >
                <div>
                    <Typography>
                        {state.questionModal.question.question}
                    </Typography>
                    {state.questionModal.question.group === 'Qualifying' ? (
                        <FormControl component="fieldset">
                            <RadioGroup
                                value={state.questionModal.currentResponse}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                    value: string
                                ) => {
                                    setState({
                                        ...state,
                                        questionModal: {
                                            ...state.questionModal,
                                            currentResponse: value,
                                        },
                                    })
                                }}
                            >
                                <FormControlLabel
                                    value="yes"
                                    control={<Radio />}
                                    label="Yes"
                                />
                                <FormControlLabel
                                    value="no"
                                    control={<Radio />}
                                    label="No"
                                />
                            </RadioGroup>
                        </FormControl>
                    ) : (
                        <TextField label="Enter text" />
                    )}
                    <Button
                        onClick={() => {
                            const prevResponses = {
                                ...state.host.matchingResponses,
                            }

                            prevResponses[state.questionModal.question.id] =
                                state.questionModal.currentResponse

                            setState({
                                ...state,
                                questionModal: {
                                    ...state.questionModal,
                                    open: false,
                                },
                                host: {
                                    ...state.host,
                                    matchingResponses: prevResponses,
                                },
                            })
                        }}
                    >
                        OK
                    </Button>
                </div>
            </MUIModal>
        </>
    )
}
