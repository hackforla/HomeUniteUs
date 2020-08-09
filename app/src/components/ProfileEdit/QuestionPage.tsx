import * as React from 'react'
import Question from './Question'
import { QuestionType } from '../../models/QuestionType'
import MUIModal from '../MUIModal/MUIModal'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { theme } from '../Registration/theme'
import { useHostDashboardData } from '../../data/host-context'
import styled from 'styled-components'
import { Box, Button, LinearProgress } from '@material-ui/core'
import MessageModal from '../MUIModal/MessageModal/MessageModal'
import ConfirmationModal from '../MUIModal/ConfirmationModal/ConfirmationModal'

interface Props {
    questions: Array<QuestionType>
    stepwise: boolean
    onSubmit: React.EventHandler<React.FormEvent<HTMLFormElement>>
}

const StyledButton = styled(Button)`
    font-size: 16px;
    margin: 15px 5px 0 0 !important;
`

const QuestionContainer = styled.div`
    min-height: 415px;
`

const IconContainer = styled.div`
    text-align: center;
    max-width: 100px;
    position: absolute;
    top: -11px;
    left: 100%;
    transform: translateX(-50%);
`

export const QuestionPage = (props: Props) => {
    const { data, postHostResponse } = useHostDashboardData()
    console.log('testing custom hook', data)

    // sort by order
    props.questions.sort((a, b) => {
        return (a.order || 0) - (b.order || 0)
    })

    const initialState = {
        questions: props.questions,
        groupIndex: 0,
        subgroupIndex: 0,
        submitPage: false,
        modalOpen: false,
        disableSubmit: false,
    }

    const [state, setState] = React.useState(initialState)

    const isNestedActive = (question: QuestionType) => {
        if (
            question.conditional_id === undefined ||
            question.conditional_value === undefined
        ) {
            return true
        }
        let parentQuestion
        for (let i = 0; i < state.questions.length; i += 1) {
            if (state.questions[i].id === question.conditional_id) {
                parentQuestion = state.questions[i]
                break
            }
        }
        if (!parentQuestion) return true
        if (parentQuestion.type === 'checkbox') {
            if (!parentQuestion.answer) return false
            return parentQuestion.answer[question.conditional_value]
        } else {
            return parentQuestion.answer === question.conditional_value
        }
    }

    // get group structure
    let groups: Array<Array<Array<QuestionType>>> = []
    let groupI = 0
    let subgroupI = 0
    for (let i = 0; i < state.questions.length; i += 1) {
        if (!isNestedActive(state.questions[i])) continue
        if (state.questions[i - 1]) {
            if (
                state.questions[i].group === undefined ||
                state.questions[i].group !== state.questions[i - 1].group
            ) {
                groupI++
                subgroupI = 0
            } else if (
                state.questions[i].subgroup === undefined ||
                state.questions[i].subgroup !== state.questions[i - 1].subgroup
            ) {
                subgroupI++
            }
        }
        if (!groups[groupI]) groups[groupI] = [[]]
        if (!groups[groupI][subgroupI]) groups[groupI][subgroupI] = []
        groups[groupI][subgroupI].push(state.questions[i])
    }

    const getStepperProgress = () => {
        const groupDistance = 1 / groups.length
        const questionDistance = groupDistance / groups[state.groupIndex].length
        return (
            groupDistance * state.groupIndex +
            questionDistance * state.subgroupIndex
        )
    }

    const setAnswer = (index: number, answer: any) => {
        let state2 = { ...state }
        state2.questions[index].answer = answer

        if (answer === state2.questions[index].showstopper) {
            state2 = { ...state, modalOpen: true, disableSubmit: true }
        } else {
            state2 = { ...state, disableSubmit: false }
        }
        setState(state2)
    }

    const clickBack = () => {
        if (state.submitPage) {
            setState({ ...state, submitPage: false })
        } else if (state.subgroupIndex > 0) {
            setState({ ...state, subgroupIndex: state.subgroupIndex - 1 })
        } else if (state.groupIndex > 0) {
            setState({
                ...state,
                groupIndex: state.groupIndex - 1,
                subgroupIndex: groups[state.groupIndex - 1].length - 1,
            })
        }
    }

    const clickForward = async () => {
        if (state.subgroupIndex < groups[state.groupIndex].length - 1) {
            setState({ ...state, subgroupIndex: state.subgroupIndex + 1 })
        } else if (state.groupIndex < groups.length - 1) {
            setState({
                ...state,
                groupIndex: state.groupIndex + 1,
                subgroupIndex: 0,
            })
        } else {
            setState({ ...state, submitPage: true })
        }

        // if answer is set
        try {
            let testResponse = {
                questionId: 1,
                hostId: 1,
                responseValues: [1],
            }
            await postHostResponse(testResponse)
        } catch (e) {
            console.log('failed to  post answer')
        }
    }

    const handleClose = () => {
        setState({ ...state, modalOpen: false })
    }

    return (
        <MuiThemeProvider theme={theme}>
            <div style={{ position: 'relative' }}>
                <div style={{ marginBottom: 80 }}>
                    {props.stepwise && (
                        <LinearProgress
                            variant="determinate"
                            value={
                                state.submitPage
                                    ? 100
                                    : getStepperProgress() * 100
                            }
                        />
                    )}
                    {groups.map((group, i) => {
                        return (
                            <IconContainer
                                key={i}
                                style={{
                                    left: (i / groups.length) * 100 + '%',
                                }}
                            >
                                <div style={{ marginBottom: 6 }}>✔️</div>
                                {group[0][0].group}
                            </IconContainer>
                        )
                    })}
                    <IconContainer key={groups.length}>
                        <div style={{ marginBottom: 6 }}>✔️</div>
                    </IconContainer>
                </div>
                <QuestionContainer>
                    <form
                        noValidate
                        autoComplete="off"
                        onSubmit={props.onSubmit}
                    >
                        {!state.submitPage ? (
                            props.stepwise ? (
                                <>
                                    <h3 style={{ height: 14.2 }}>
                                        {
                                            groups[state.groupIndex][
                                                state.subgroupIndex
                                            ][0].subgroup
                                        }
                                    </h3>

                                    {groups[state.groupIndex][
                                        state.subgroupIndex
                                    ].map((question: QuestionType) => {
                                        const index = state.questions.indexOf(
                                            question
                                        )
                                        return (
                                            <Question
                                                key={index}
                                                index={index}
                                                question={question}
                                                setAnswer={setAnswer}
                                            ></Question>
                                        )
                                    })}
                                </>
                            ) : (
                                state.questions.map(
                                    (question: QuestionType, i) =>
                                        isNestedActive(question) && (
                                            <Box my={5}>
                                                <Question
                                                    key={i}
                                                    index={i}
                                                    question={question}
                                                    setAnswer={setAnswer}
                                                ></Question>
                                            </Box>
                                        )
                                )
                            )
                        ) : (
                            <StyledButton
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={state.disableSubmit}
                            >
                                Submit
                            </StyledButton>
                        )}
                    </form>
                </QuestionContainer>

                {props.stepwise ? (
                    <>
                        <StyledButton
                            variant="contained"
                            color="primary"
                            type="button"
                            onClick={clickBack}
                        >
                            Back
                        </StyledButton>
                        <StyledButton
                            variant="contained"
                            color="primary"
                            type="button"
                            onClick={clickForward}
                        >
                            Forward
                        </StyledButton>
                    </>
                ) : (
                    <StyledButton
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Submit
                    </StyledButton>
                )}
            </div>
            <MessageModal
                modalHeadingText={'Warning'}
                modalMessage={
                    "We're sorry but your answer disqualifies you from participating in this program"
                }
                modalOpen={state.modalOpen}
                onCancel={handleClose}
            />
        </MuiThemeProvider>
    )
}

export default QuestionPage
