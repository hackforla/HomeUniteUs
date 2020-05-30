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
    min-height: 374px;
`

export const QuestionPage = (props: Props) => {
    // sort by order
    props.questions.sort((a, b) => {
        return (a.order || 0) - (b.order || 0);
    })

    // get group structure
    var groups: [[QuestionType[]]] = [[[]]]
    var groupI = 0
    var subgroupI = 0
    var questionI = 0
    var lastQuestion
    for (var i = 0; i < props.questions.length; i += 1) {
        if (lastQuestion) {
            if (props.questions[i].group === undefined || props.questions[i].group !== lastQuestion.group) {
                groupI++
                subgroupI = 0
                questionI = 0
            } else if (props.questions[i].subgroup === undefined || props.questions[i].subgroup !== lastQuestion.subgroup) {
                subgroupI++
                questionI = 0
            } else {
                questionI++
            }
        }
        if (!groups[groupI]) groups[groupI] = [[]]
        if (!groups[groupI][subgroupI]) groups[groupI][subgroupI] = []
        groups[groupI][subgroupI][questionI] = props.questions[i]
        lastQuestion = props.questions[i]
    }

    const initialState = {
        questions: props.questions,
        groupIndex: 0,
        subgroupIndex: 0,
    }

    const [state, setState] = React.useState(initialState)

    function setAnswer(index: number, answer: any) {
        state.questions[index].answer = answer
        setState(state)
    }

    function clickBack() {
        if (state.subgroupIndex > 0) {
            setState({...state, subgroupIndex: state.subgroupIndex - 1})
        } else if (state.groupIndex > 0) {
            setState({...state, groupIndex: state.groupIndex - 1, subgroupIndex: groups[state.groupIndex - 1].length - 1})
        }
    }

    function clickForward() {
        if (state.subgroupIndex < groups[state.groupIndex].length - 1) {
            setState({...state, subgroupIndex: state.subgroupIndex + 1})
        } else if (state.groupIndex < groups.length - 1) {
            setState({...state, groupIndex: state.groupIndex + 1, subgroupIndex: 0})
        } else {
            // the end
        }
    }

    return (
        <div>
            {props.stepwise && (
                <>
                    <LinearProgress
                        variant="determinate"
                        value={
                            (state.groupIndex / groups.length) * 100
                        }
                    />
                    <Box my={3}></Box>
                    <LinearProgress
                        variant="determinate"
                        value={
                            (state.subgroupIndex / groups[state.groupIndex].length) * 100
                        }
                    />
                </>
            )}
            <QuestionContainer>
                <form noValidate autoComplete="off" onSubmit={props.onSubmit}>
                    {groups[state.groupIndex] ? (
                        props.stepwise ? (
                            <>
                                <h2 style={{height: 24.8}}>{groups[state.groupIndex][state.subgroupIndex][0].group}</h2>
                                <h3 style={{height: 14.2}}>{groups[state.groupIndex][state.subgroupIndex][0].subgroup}</h3>

                                {groups[state.groupIndex][state.subgroupIndex]
                                    .map((question: QuestionType) => {
                                        return (
                                            <Question
                                                index={props.questions.indexOf(question)}
                                                question={question}
                                                setAnswer={setAnswer}
                                            ></Question>
                                        )
                                    })
                                }
                            </>
                        ) : (
                            state.questions.map((question: QuestionType, i) => (
                                <Box my={5}>
                                    <Question
                                        index={i}
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
                <StyledButton variant="contained" color="primary" type="submit">
                    Submit
                </StyledButton>
            )}
        </div>
    )
}

export default QuestionPage
