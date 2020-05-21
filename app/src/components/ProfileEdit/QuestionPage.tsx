import * as React from 'react'
import Question from './Question'
import { QuestionType } from '../../models/QuestionType'

import styled from 'styled-components'
import { Button, LinearProgress } from '@material-ui/core'

const StyledButton = styled(Button)`
    font-size: 16px;
    margin: 15px 5px 0 0 !important;
`

const QuestionContainer = styled.div`
    min-height: 244px;
`

const getQuestions = (org: string, section: string) => {
    const questions = [
        {
            id: '7',
            question: 'First Name',
            type: 'text',
            answer: 'house',
        },
        {
            id: '8',
            question: 'Middle Name',
            type: 'text',
            parent: '7',
            answer: 'house',
        },
        {
            id: '9',
            question: 'Last Name',
            type: 'text',
            parent: '7',
            answer: 'house',
        },
        {
            id: '1',
            question: 'How would you describe your home?',
            type: 'radio',
            options: [
                { label: 'Owned Single-Unit', value: 'single' },
                { label: 'Owned Multi-Unit', value: 'multi' },
                { label: 'Owned House', value: 'house' },
            ],
            answer: 'house',
        },
        {
            id: '2',
            question: 'Do you allow drinking there?',
            type: 'radio',
            options: [
                { label: 'Yes', value: 'yes' },
                { label: "We don't drink, but it is allowed", value: 'we-dont' },
                { label: 'No', value: 'no' },
            ],
            answer: 'yes',
        },
        {
            id: '3',
            question: 'Do you allow smoking at your residence?',
            type: 'radio',
            options: [
                { label: 'Yes, we smoke inside', value: 'inside' },
                { label: 'Yes, but only outside', value: 'outside' },
                { label: 'No', value: 'no' },
            ],
            answer: 'outside',
        },
        {
            id: '4',
            question: 'Do you allow substance use at your residence?',
            type: 'radio',
            options: [
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
            ],
            answer: 'no',
        },
        {
            id: '5',
            question: 'What are your interests?',
            type: 'checkbox',
            options: [
                { label: 'Tinkering', value: 'tinkering' },
                { label: 'Trashy TV', value: 'tv' },
                { label: 'Puzzles', value: 'puzzles' },
                { label: 'Cheesecakes', value: 'cheesecakes' },
            ],
            answer: {
                tinkering: false,
                tv: true,
                puzzles: false,
                cheesecakes: true,
            },
        },
        {
            id: '6',
            question: 'Tell us about yourself',
            type: 'textarea',
            answer: 'I have many leather-bound books',
        },
    ]
    return questions
}

const initialState = {
    questionIndex: 0,
    questions: getQuestions('spy', 'basic'),
}

export const QuestionPage = () => {
    const [state, setState] = React.useState(initialState)

    const topLevelQuestions = state.questions.filter((question) => !question.parent)

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
            <LinearProgress
                variant="determinate"
                value={(state.questionIndex / topLevelQuestions.length) * 100}
            />
            <QuestionContainer>
                <form noValidate autoComplete="off">
                    <Question
                        question={topLevelQuestions[state.questionIndex]}
                        setAnswer={setAnswer}
                    ></Question>
                    {state.questions
                        .filter(
                            (question: QuestionType) =>
                                question.parent ===
                                state.questions[state.questionIndex].id
                        )
                        .map((question: QuestionType) => {
                            return (
                                <Question
                                    question={question}
                                    setAnswer={setAnswer}
                                ></Question>
                            )
                        })}
                </form>
            </QuestionContainer>
            <StyledButton
                variant="contained"
                color="primary"
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
                onClick={() =>
                    state.questionIndex < topLevelQuestions.length - 1 &&
                    setQuestionIndex(state.questionIndex + 1)
                }
            >
                Forward
            </StyledButton>
        </div>
    )
}

export default QuestionPage
