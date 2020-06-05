import * as React from 'react'
import Question from './Question'
import { QuestionType } from '../../models/QuestionType'

import styled from 'styled-components'
import { Box, Button, LinearProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'; //for modal
import Modal from '@material-ui/core/Modal'; //for modal
import Backdrop from '@material-ui/core/Backdrop'; //for modal
import Fade from '@material-ui/core/Fade'; //for modal


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

//for modal
const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
})); //for modal

export const QuestionPage = (props: Props) => {
    const classes = useStyles(); //for modal

    // sort by order
    props.questions.sort((a, b) => {
        return (a.order || 0) - (b.order || 0);
    })

    const initialState = {
        questions: props.questions,
        groupIndex: 0,
        subgroupIndex: 0,
        submitPage: false,
    }

    const [state, setState] = React.useState(initialState)
    const [open, setOpen] = React.useState(false) //for modal
    const [disableSubmit, setDisableSubmit] = React.useState(false)

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
        const indexQuesitons = [0, 1, 2, 3, 4, 5, 6, 7, 8] //for modalv
        indexQuesitons.find(indexId => {
            if (indexId === index && answer === "no") {
                setDisableSubmit(true)
                setOpen(true)
            } else {
                setDisableSubmit(false)
            }
            return
        })
        //for modal^
        var state2 = { ...state }
        state2.questions[index].answer = answer
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

    // for modal
    const handleClose = () => {
        setOpen(false);
    }; // for modal

    const handleClick = (e: any) => {
        e.preventDefault()
        console.log("Testing the submit button")
    }

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
                                    onClick={handleClick}
                                    disabled={disableSubmit}
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

            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={open}>
                        <div className={classes.paper}>
                            <h2 id="transition-modal-title" style={{ color: "red"}}>Warning</h2>
                            <p id="transition-modal-description">We're sorry this answer will disqualifies you from participating in this program.</p>
                        </div>
                    </Fade>
                </Modal>
            </div>
        </>
    )
}

export default QuestionPage
