import {
    AppBar,
    Box,
    Button,
    Container,
    IconButton,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
} from '@material-ui/core'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { Add, Check, Delete, Edit } from '@material-ui/icons'
import * as React from 'react'
import ConfirmationModal from '../../components/MUIModal/ConfirmationModal/ConfirmationModal'
import MUIModal from '../../components/MUIModal/MUIModal'
import {
    HostDashboardDataProvider,
    useHostDashboardData,
} from '../../data/host-context'
import { MatchingQuestion, ResponseOption } from '../../models/v2'

type UserType = 'guest' | 'host'

export const MatchingQuestionEditor = (userType: UserType) => {}

export const RestrictionQuestionEditor = () => {}

export const AdminDashboardContainer = () => {
    return (
        <>
            <HostDashboardDataProvider>
                <AdminDashboard />
            </HostDashboardDataProvider>
        </>
    )
}
type MenuOption = 'GuestQuestions' | 'HostQuestions'
interface AdminDashboardState {
    selectedMenuOption: MenuOption
    questionModal: {
        open: boolean
        question: MatchingQuestion
    }
    responseOptionModal: {
        open: boolean
        option: ResponseOption
    }
    confirmDeleteModal: {
        open: boolean
        text: string
        questionId: string
    }
}
enum AdminDashboardActionType {
    SelectMenuOption = 'SelectMenuOption',
    CloseQuestionModal = 'CloseModal',
    EditQuestion = 'EditQuestion',
    CloseResponseOptionModal = 'CloseResponseOptionModal',
    EditResponseOption = 'EditResponseOption',
    ChangeResponseOptionText = 'ChangeResponseOptionText',
    UpdateResponseOption = 'UpdateResponseOption',
    CloseDeleteModal = 'CloseDeleteModal',
    PromptForDeletion = 'PromptForDeletion',
    ChangeQuestionText = 'ChangeQuestionText',
}
interface AdminDashboardAction {
    type: AdminDashboardActionType
    payload?: MenuOption | MatchingQuestion | ResponseOption | string
}

const initialState: AdminDashboardState = {
    selectedMenuOption: 'HostQuestions',
    questionModal: {
        open: false,
        question: {} as MatchingQuestion,
    },
    responseOptionModal: {
        open: false,
        option: {} as ResponseOption,
    },
    confirmDeleteModal: {
        open: false,
        text: 'Modal error',
        questionId: '',
    },
}

const modalButtonStyles: CSSProperties = {
    textAlign: 'center',
    border: '1px solid black',
    borderRadius: '3px',
    padding: '2px',
    margin: '1px',
}

const reducer = (
    state: AdminDashboardState,
    action: AdminDashboardAction
): AdminDashboardState => {
    switch (action.type) {
        case AdminDashboardActionType.SelectMenuOption:
            return {
                ...state,
                selectedMenuOption: action.payload as MenuOption,
            }
        case AdminDashboardActionType.CloseQuestionModal:
            return {
                ...state,
                questionModal: {
                    ...state.questionModal,
                    open: false,
                },
            }
        case AdminDashboardActionType.EditQuestion:
            return {
                ...state,
                questionModal: {
                    ...state.questionModal,
                    open: true,
                    question: action.payload as MatchingQuestion,
                },
            }
        case AdminDashboardActionType.CloseResponseOptionModal:
            return {
                ...state,
                responseOptionModal: {
                    ...state.responseOptionModal,
                    open: false,
                },
            }
        case AdminDashboardActionType.EditResponseOption:
            return {
                ...state,
                responseOptionModal: {
                    ...state.responseOptionModal,
                    open: true,
                    option: action.payload as ResponseOption,
                },
            }
        case AdminDashboardActionType.ChangeResponseOptionText:
            return {
                ...state,
                responseOptionModal: {
                    ...state.responseOptionModal,
                    option: {
                        ...state.responseOptionModal.option,
                        label: action.payload as string,
                    },
                },
            }
        case AdminDashboardActionType.UpdateResponseOption:
            const newOption = action.payload as ResponseOption
            const options = [...state.questionModal.question.options].filter(
                (o: ResponseOption) => o.id !== newOption.id
            )
            options.push(newOption)
            return {
                ...state,
                questionModal: {
                    ...state.questionModal,
                    question: {
                        ...state.questionModal.question,
                        options: options,
                    },
                },
            }
        case AdminDashboardActionType.CloseDeleteModal:
            return {
                ...state,
                confirmDeleteModal: {
                    ...state.confirmDeleteModal,
                    open: false,
                },
            }
        case AdminDashboardActionType.PromptForDeletion:
            const q: MatchingQuestion = action.payload as MatchingQuestion
            return {
                ...state,
                confirmDeleteModal: {
                    ...state.confirmDeleteModal,
                    open: true,
                    text: `Are you sure you want to delete question ${q._id}?`,
                    questionId: q._id,
                },
            }
        case AdminDashboardActionType.ChangeQuestionText:
            return {
                ...state,
                questionModal: {
                    ...state.questionModal,
                    question: {
                        ...state.questionModal.question,
                        question: action.payload as string,
                    },
                },
            }
        default:
            throw new Error(`Unsupported action: ${action}`)
    }
}

export const AdminDashboard = () => {
    const {
        data,
        addHostResponseOption,
        deleteMatchingQuestion,
        updateMatchingQuestion,
        updateHostResponseOption,
    } = useHostDashboardData()
    const [state, dispatch] = React.useReducer(reducer, initialState)

    React.useEffect(() => {
        if (state.questionModal.question.id) {
            const currentQuestion = data.matchingQuestions.filter(
                (q: MatchingQuestion) =>
                    q.id === state.questionModal.question.id
            )[0]
            if (state.questionModal.open) {
                dispatch({
                    type: AdminDashboardActionType.EditQuestion,
                    payload: currentQuestion,
                })
            }
        }
    }, [data.matchingQuestions])

    const selectOption = (event: React.ChangeEvent<{}>, value: MenuOption) => {
        dispatch({
            type: AdminDashboardActionType.SelectMenuOption,
            payload: value,
        })
    }

    const closeQuestionModal = () => {
        dispatch({ type: AdminDashboardActionType.CloseQuestionModal })
    }

    const editQuestion = (q: MatchingQuestion) => {
        dispatch({
            type: AdminDashboardActionType.EditQuestion,
            payload: q,
        })
    }
    const closeResponseOptionModal = () => {
        dispatch({ type: AdminDashboardActionType.CloseResponseOptionModal })
    }

    const editResponseOption = (o: ResponseOption) => {
        dispatch({
            type: AdminDashboardActionType.EditResponseOption,
            payload: o,
        })
    }

    const changeResponseOptionText = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        console.log(
            `AdminDashboard:changeResponseOptionText: event.target.value = ${event.target.value}`
        )
        dispatch({
            type: AdminDashboardActionType.ChangeResponseOptionText,
            payload: event.target.value,
        })
    }

    const postResponseOption = async (responseOption: ResponseOption) => {
        // dispatch({
        //     type: AdminDashboardActionType.UpdateResponseOption,
        //     payload: responseOption,
        // })
        console.log(
            `AdminDashboard:updateResponseOption: adding option to question: ${
                state.questionModal.question._id
            }: ${JSON.stringify(responseOption)}`
        )
        dispatch({
            type: AdminDashboardActionType.CloseResponseOptionModal,
        })
        await addHostResponseOption(
            state.questionModal.question._id,
            responseOption
        )
    }

    const updateResponseOption = async (responseOption: ResponseOption) => {
        dispatch({
            type: AdminDashboardActionType.CloseResponseOptionModal,
        })
        await updateHostResponseOption(
            state.questionModal.question._id,
            responseOption
        )
    }

    const addResponseOption = () => {
        const nextId =
            state.questionModal.question.options.reduce<number>(
                (max: number, cur: ResponseOption) => {
                    const idAsInt = parseInt(cur.id)
                    return max < idAsInt ? idAsInt : max
                },
                0
            ) + 1
        editResponseOption({
            id: `new_${nextId}`,
            label: '',
            value: '',
            text: '',
        })
    }

    const cancelDelete = () => {
        dispatch({
            type: AdminDashboardActionType.CloseDeleteModal,
        })
    }

    const confirmDelete = async () => {
        console.log(
            `AdminDashboard:confirmDelete: Deleting question: ${state.confirmDeleteModal.questionId}`
        )
        dispatch({
            type: AdminDashboardActionType.CloseDeleteModal,
        })
        await deleteMatchingQuestion(state.confirmDeleteModal.questionId)
    }

    const promptDeleteQuestion = (q: MatchingQuestion) => {
        dispatch({
            type: AdminDashboardActionType.PromptForDeletion,
            payload: q,
        })
    }

    const updateQuestion = async () => {
        console.log(
            `AdminDashboard:updateQuestion: updating question: ${state.questionModal.question._id}`
        )
        dispatch({
            type: AdminDashboardActionType.CloseQuestionModal,
        })
        await updateMatchingQuestion(state.questionModal.question)
    }

    const changeQuestionText = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        console.log(
            `AdminDashboard:changeQuestionText: event.target.value = ${event.target.value}`
        )
        dispatch({
            type: AdminDashboardActionType.ChangeQuestionText,
            payload: event.target.value,
        })
    }

    return (
        <>
            <Container>
                <AppBar position="static">
                    <Tabs
                        value={state.selectedMenuOption}
                        onChange={selectOption}
                    >
                        <Tab label="Host Questions" value={'HostQuestions'} />
                        <Tab label="Guest Questions" value={'GuestQuestions'} />
                    </Tabs>
                </AppBar>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontSize: '1.3rem' }}>
                                    Display Text
                                </TableCell>
                                <TableCell
                                    style={{ fontSize: '1.3rem' }}
                                    align="right"
                                >
                                    Type
                                </TableCell>
                                <TableCell
                                    style={{ fontSize: '1.3rem' }}
                                    align="right"
                                >
                                    Options
                                </TableCell>
                                <TableCell
                                    style={{ fontSize: '1.3rem' }}
                                    align="right"
                                >
                                    Edit
                                </TableCell>
                                <TableCell
                                    style={{ fontSize: '1.3rem' }}
                                    align="right"
                                >
                                    Delete
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.matchingQuestions.map(
                                (q: MatchingQuestion, i: number) => {
                                    // console.log(
                                    //     `AdminDashboard: rendering matching question: ${JSON.stringify(
                                    //         q
                                    //     )}`
                                    // )
                                    return (
                                        <TableRow
                                            key={`matching-question-${i}`}
                                        >
                                            <TableCell>{q.question}</TableCell>
                                            <TableCell align="right">
                                                {q.type}
                                            </TableCell>
                                            <TableCell align="right">
                                                {q.options
                                                    ? q.options.map(
                                                          (
                                                              o: ResponseOption,
                                                              optionIndex: number
                                                          ) =>
                                                              optionIndex <
                                                              q.options.length -
                                                                  1
                                                                  ? `${o.label}, `
                                                                  : `${o.label}`
                                                      )
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        editQuestion(q)
                                                    }
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() =>
                                                        promptDeleteQuestion(q)
                                                    }
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box style={{ backgroundColor: 'blue' }} textAlign="center">
                    <Button>Download as JSON</Button>
                </Box>
            </Container>
            <MUIModal
                disableBackdropClick={false}
                modalOpen={state.questionModal.open}
                handleClose={closeQuestionModal}
            >
                <div style={{ width: '50rem' }}>
                    <h2>Edit Question: {state.questionModal.question.id}</h2>
                    <h3>Display Prompt</h3>
                    <TextField
                        value={state.questionModal.question.question}
                        onChange={changeQuestionText}
                        fullWidth={true}
                    />
                    {state.questionModal.question.type === 'radio' ? (
                        <>
                            <h3>Response Options</h3>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Label</TableCell>
                                            <TableCell align="right">
                                                Edit
                                            </TableCell>
                                            <TableCell align="right">
                                                Delete
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {state.questionModal.question.options
                                            .sort(
                                                (
                                                    a: ResponseOption,
                                                    b: ResponseOption
                                                ) => (a.id < b.id ? -1 : 1)
                                            )
                                            .map(
                                                (
                                                    o: ResponseOption,
                                                    i: number
                                                ) => {
                                                    return (
                                                        <TableRow
                                                            key={`response-option-${i}`}
                                                        >
                                                            <TableCell>
                                                                {o.id}
                                                            </TableCell>
                                                            <TableCell>
                                                                {o.label}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <IconButton
                                                                    color="primary"
                                                                    onClick={() =>
                                                                        editResponseOption(
                                                                            o
                                                                        )
                                                                    }
                                                                >
                                                                    <Edit />
                                                                </IconButton>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <IconButton color="secondary">
                                                                    <Delete />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                }
                                            )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Container>
                                <div style={modalButtonStyles}>
                                    <IconButton
                                        color="primary"
                                        onClick={addResponseOption}
                                    >
                                        <Add />
                                    </IconButton>
                                </div>
                                <div style={modalButtonStyles}>
                                    <IconButton
                                        color="primary"
                                        onClick={updateQuestion}
                                    >
                                        <Check />
                                    </IconButton>
                                </div>
                            </Container>
                        </>
                    ) : (
                        <Container>
                            <div style={modalButtonStyles}>
                                <IconButton
                                    color="primary"
                                    onClick={updateQuestion}
                                >
                                    <Check />
                                </IconButton>
                            </div>
                        </Container>
                    )}
                </div>
            </MUIModal>
            <MUIModal
                disableBackdropClick={false}
                modalOpen={state.responseOptionModal.open}
                handleClose={closeResponseOptionModal}
            >
                <>
                    <TextField
                        value={state.responseOptionModal.option.label}
                        onChange={changeResponseOptionText}
                    />
                    <IconButton
                        onClick={() => {
                            const opt = state.questionModal.question.options.find(
                                (o: ResponseOption) =>
                                    o.id === state.responseOptionModal.option.id
                            )
                            if (opt) {
                                updateResponseOption(
                                    state.responseOptionModal.option
                                )
                            } else {
                                postResponseOption(
                                    state.responseOptionModal.option
                                )
                            }
                        }}
                    >
                        <Check />
                    </IconButton>
                </>
            </MUIModal>
            <ConfirmationModal
                modalOpen={state.confirmDeleteModal.open}
                confirmationText={state.confirmDeleteModal.text}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
            />
        </>
    )
}
