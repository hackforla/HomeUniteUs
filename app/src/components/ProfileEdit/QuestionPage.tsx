import * as React from 'react'
import Question from './Question'
import { QuestionType } from '../../models/QuestionType'
import MUIModal from '../MUIModal'

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

    const initialState = {
        questions: props.questions,
        groupIndex: 0,
        subgroupIndex: 0,
        submitPage: false,
        modalOpen: false,
        disableSubmit: false
    }

    const [state, setState] = React.useState(initialState)

    // get group structure
    var groups: [[QuestionType[]]] = [[[]]] 
    var groupI = 0
    var subgroupI = 0
    for (var i = 0; i < state.questions.length; i += 1) {
        if (state.questions[i - 1]) {
            if (state.questions[i].group === undefined || state.questions[i].group !== state.questions[i - 1].group) {
                groupI++
                subgroupI = 0
            } else if (state.questions[i].subgroup === undefined || state.questions[i].subgroup !== state.questions[i - 1].subgroup) {
                subgroupI++
            }
        }
        if (!groups[groupI]) groups[groupI] = [[]]
        if (!groups[groupI][subgroupI]) groups[groupI][subgroupI] = []
        groups[groupI][subgroupI].push(state.questions[i])
    }
    
    function setAnswer(index: number, answer: any) {
        var state2 = { ...state }
        state2.questions[index].answer = answer

        if(answer === "no" && state2.questions[index].showstopper){
            state2 = { ...state, modalOpen: true, disableSubmit: true }
        } else {
            state2 = { ...state, disableSubmit: false }
        }
        setState(state2)
    }

    function clickBack() {
        if (state.submitPage) {
            setState({ ...state, submitPage: false });
        } else if (state.subgroupIndex > 0) {
            setState({ ...state, subgroupIndex: state.subgroupIndex - 1 })
        } else if (state.groupIndex > 0) {
            setState({ ...state, groupIndex: state.groupIndex - 1, subgroupIndex: groups[state.groupIndex - 1].length - 1 })
        }
    }

    function clickForward() {
        if (state.subgroupIndex < groups[state.groupIndex].length - 1) {
            setState({ ...state, subgroupIndex: state.subgroupIndex + 1 })
        } else if (state.groupIndex < groups.length - 1) {
            setState({ ...state, groupIndex: state.groupIndex + 1, subgroupIndex: 0 })
        } else {
            setState({ ...state, submitPage: true });
        }
    }

    const handleClose = () => {
        setState({ ...state, modalOpen: false});
    }; 

    return (
        <>
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
                        {!state.submitPage ? (
                            props.stepwise ? (
                                <>
                                    <h2 style={{ height: 24.8 }}>{groups[state.groupIndex][state.subgroupIndex][0].group}</h2>
                                    <h3 style={{ height: 14.2 }}>{groups[state.groupIndex][state.subgroupIndex][0].subgroup}</h3>

                                    {groups[state.groupIndex][state.subgroupIndex]
                                        .map((question: QuestionType) => {
                                            const index = state.questions.indexOf(question)
                                            return (
                                                <Question
                                                    key={index}
                                                    index={index}
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
                        <StyledButton variant="contained" color="primary" type="submit">
                            Submit
                        </StyledButton>
                    )}
            </div>
            <MUIModal handleClose={handleClose} modalOpen={state.modalOpen} headerText={"Warning"} text={"We're sorry this answer will disqualifies you from participating in this program."}/>
        </>
    )
}

export default QuestionPage
