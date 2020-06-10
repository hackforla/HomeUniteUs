import * as React from 'react'
import Question from './Question'
import { QuestionType } from '../../models/QuestionType'
import MUIModal from '../MUIModal/MUIModal'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { theme } from '../Registration/theme'

import styled from 'styled-components'
import { Box, Button, LinearProgress } from '@material-ui/core'

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
    min-height: 374px;
`

export const QuestionPage = (props: Props) => {
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
        if (question.conditional_id === undefined) {
            return true
        }
        let parentQuestion
        for (let i = 0; i < state.questions.length; i += 1) {
            if (state.questions[i].id === question.conditional_id) {
                parentQuestion = state.questions[i]
                break
            }
        }
        return (
            !parentQuestion ||
            parentQuestion.answer === question.conditional_value
        )
    }

    // get group structure
    let groups: [[QuestionType[]]] = [[[]]]
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

    const clickForward = () => {
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
    }

    const handleClose = () => {
        setState({ ...state, modalOpen: false })
    }

    return (
        <MuiThemeProvider theme={theme}>
            <div>
                {props.stepwise && (
                    <>
                        <LinearProgress
                            variant="determinate"
                            value={(state.groupIndex / groups.length) * 100}
                        />
                        <Box my={3}></Box>
                        <LinearProgress
                            variant="determinate"
                            value={
                                (state.subgroupIndex /
                                    groups[state.groupIndex].length) *
                                100
                            }
                        />
                    </>
                )}
                <QuestionContainer>
                    <form
                        noValidate
                        autoComplete="off"
                        onSubmit={props.onSubmit}
                    >
                        {!state.submitPage ? (
                            props.stepwise ? (
                                <>
                                    <h2 style={{ height: 24.8 }}>
                                        {
                                            groups[state.groupIndex][
                                                state.subgroupIndex
                                            ][0].group
                                        }
                                    </h2>
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
            <MUIModal handleClose={handleClose} modalOpen={state.modalOpen}>
                <h2 id="transition-modal-title" style={{ color: 'red' }}>
                    Warning
                </h2>
                <p id="transition-modal-description">
                    We're sorry but your answer disqualifies you from
                    participating in this program
                </p>
            </MUIModal>
        </MuiThemeProvider>
    )
}

export default QuestionPage
