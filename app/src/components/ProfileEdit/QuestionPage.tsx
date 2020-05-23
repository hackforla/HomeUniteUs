import * as React from 'react'
import Question from './Question'
import { QuestionType } from '../../models/QuestionType'

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
    min-height: 244px;
`

export const QuestionPage = (props: Props) => {
    const initialState = {
        questionIndex: 0,
        questions: props.questions,
    }

    const [state, setState] = React.useState(initialState)

    const topLevelQuestions = state.questions.filter(
        (question) => !question.parent
    )

    function setAnswer(id: string, answer: any) {
        setState({
            ...state,
            questions: state.questions.map((q) => {
                if (q.id === id) {
                    return { ...q, answer }
                } else {
                    return q
                }
            }),
        })
    }

    function setQuestionIndex(index: number) {
        setState({
            ...state,
            questionIndex: index,
        })
    }

    return (
        <div>
            {props.stepwise && (
                <LinearProgress
                    variant="determinate"
                    value={
                        (state.questionIndex / topLevelQuestions.length) * 100
                    }
                />
            )}
            <QuestionContainer>
                <form noValidate autoComplete="off" onSubmit={props.onSubmit}>
                    {topLevelQuestions[state.questionIndex] ? (
                        props.stepwise ? (
                            <>
                                <Question
                                    question={
                                        topLevelQuestions[state.questionIndex]
                                    }
                                    setAnswer={setAnswer}
                                ></Question>
                                {state.questions
                                    .filter(
                                        (question: QuestionType) =>
                                            question.parent ===
                                            state.questions[state.questionIndex]
                                                .id
                                    )
                                    .map((question: QuestionType) => {
                                        return (
                                            <Question
                                                question={question}
                                                setAnswer={setAnswer}
                                            ></Question>
                                        )
                                    })}
                            </>
                        ) : (
                            state.questions.map((question: QuestionType) => (
                                <Box my={5}>
                                    <Question
                                        question={question}
                                        setAnswer={setAnswer}
                                    ></Question>
                                </Box>
                            ))
                        )
                    ) : (
                        <StyledButton
                            variant="contained"
                            color="primary"
                            type="submit"
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
                        onClick={() =>
                            state.questionIndex > 0 &&
                            setQuestionIndex(state.questionIndex - 1)
                        }
                    >
                        Back
                    </StyledButton>
                    <StyledButton
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={() =>
                            state.questionIndex < topLevelQuestions.length &&
                            setQuestionIndex(state.questionIndex + 1)
                        }
                    >
                        Forward
                    </StyledButton>
                </>
            ) : (
                <StyledButton variant="contained" color="primary" type="submit">
                    Submit
                </StyledButton>
            )}
        </div>
    )
}

export default QuestionPage
