import * as React from 'react'
import ShowstopperQuestion from './ShowstopperQuestion'
import MatchingQuestion from './MatchingQuestion'
import { ShowstopperQuestionType } from '../../models/ShowstopperQuestionType'
import { MatchingQuestionType } from '../../models/MatchingQuestionType'
import MUIModal from '../MUIModal/MUIModal'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { theme } from '../Registration/theme'
import { useHostDashboardData } from '../../data/host-context'
import styled from 'styled-components'
import { Box, Button, LinearProgress } from '@material-ui/core'
import MessageModal from '../MUIModal/MessageModal/MessageModal'
import ConfirmationModal from '../MUIModal/ConfirmationModal/ConfirmationModal'

interface Props {
  showstopperQuestions: Array<ShowstopperQuestionType>
  matchingQuestions: Array<MatchingQuestionType>
  stepwise: boolean
  onSubmit: React.EventHandler<React.FormEvent<HTMLFormElement>>
}

const StyledButton = styled(Button)`
  font-size: 16px;
  margin: 15px 5px 0 0 !important;
`

const Container = styled.div`
  margin: 30px auto;
  padding: 0 44px;
  max-width: 1140px;
`

const QuestionContainer = styled.div`
  min-height: 415px;
`

const StyledLinearProgress = styled(LinearProgress)`
  background: #efefef !important;
  height: 12px !important;
`

const StyledDiv = styled.div`
  text-align: center;
  max-width: 100px;
  position: absolute;
  top: -11px;
  transform: translateX(-50%);
  font-size: 14px;
`

const IconContainer = (props: {
  active: boolean
  group: string
  left: string
}) => {
  return (
    <StyledDiv style={{ left: props.left }}>
      <div style={{ marginTop: 7, marginBottom: 10 }}>
        {props.active ? <span>✅</span> : <span>✅</span>}
      </div>
      <div style={{ color: props.active ? 'black' : '#999' }}>
        {props.group}
      </div>
    </StyledDiv>
  )
}

export const QuestionPage = (props: Props) => {
  const { data, putHostResponse } = useHostDashboardData()
  console.log('testing custom hook', data)

  // sort by order
  let questions = props.showstopperQuestions.concat(props.matchingQuestions)
  questions.sort((a, b) => {
    return (a.order || 0) - (b.order || 0)
  })

  const initialState = {
    questions: questions,
    groupIndex: 0,
    subgroupIndex: 0,
    submitPage: false,
    modalOpen: false,
    disableSubmit: false,
  }

  const [state, setState] = React.useState(initialState)

  const isNestedActive = (
    question: ShowstopperQuestionType | MatchingQuestionType
  ) => {
    if (
      !('conditional_id' in question) ||
      !('conditional_value' in question) ||
      question.conditional_id === undefined ||
      question.conditional_value === undefined
    ) {
      return true
    }
    let parentQuestion:
      | ShowstopperQuestionType
      | MatchingQuestionType
      | undefined
    for (let i = 0; i < state.questions.length; i += 1) {
      if (state.questions[i].id === question.conditional_id) {
        parentQuestion = state.questions[i]
        break
      }
    }
    if (!parentQuestion) return true
    if ('type' in parentQuestion && parentQuestion.type === 'checkbox') {
      if (!parentQuestion.answer) return false
      return parentQuestion.answer[question.conditional_value]
    } else {
      return parentQuestion.answer === question.conditional_value
    }
  }

  // get group structure
  let groups: Array<Array<
    Array<ShowstopperQuestionType | MatchingQuestionType>
  >> = []
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
    const groupDistance = 1 / (groups.length + 1)
    const questionDistance = groupDistance / groups[state.groupIndex].length
    return (
      groupDistance * state.groupIndex + questionDistance * state.subgroupIndex
    )
  }

  const setAnswer = (index: number, answer: any) => {
    let newState = { ...state }

    //set on state directly vs via the questions object in the questions array
    newState.questions[index].answer = answer

    if (answer === 'no') {
      newState = { ...state, modalOpen: true, disableSubmit: true }
    } else {
      newState = { ...state, disableSubmit: false }
    }
    setState(newState)
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

    try {
      //dummy set state modeled as the HostResponse type
      //responseValues value should be result of setAnswer on state
      let testResponse = {
        questionId: 1,
        hostId: 1,
        responseValues: [1],
      }
      await putHostResponse(state.groupIndex, testResponse)
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
        <div style={{ marginTop: 30, marginBottom: 80 }}>
          {props.stepwise && (
            <StyledLinearProgress
              variant="determinate"
              value={
                state.submitPage
                  ? 100 - 100 / (groups.length + 1)
                  : getStepperProgress() * 100
              }
            />
          )}
          {groups.map((group, i) => {
            return (
              <IconContainer
                key={i + 1}
                active={state.groupIndex >= i}
                group={group[0][0].group || ''}
                left={((i + 1) / (groups.length + 1)) * 100 + '%'}
              ></IconContainer>
            )
          })}
        </div>
        <Container>
          <QuestionContainer>
            <form noValidate autoComplete="off" onSubmit={props.onSubmit}>
              {!state.submitPage ? (
                props.stepwise ? (
                  <>
                    <h3 style={{ height: 14.2 }}>
                      {
                        groups[state.groupIndex][state.subgroupIndex][0]
                          .subgroup
                      }
                    </h3>

                    {groups[state.groupIndex][state.subgroupIndex].map(
                      (
                        question: ShowstopperQuestionType | MatchingQuestionType
                      ) => {
                        const index = state.questions.indexOf(question)
                        return 'type' in question ? (
                          <MatchingQuestion
                            key={index}
                            index={index}
                            question={question}
                            setAnswer={setAnswer}
                          ></MatchingQuestion>
                        ) : (
                          <ShowstopperQuestion
                            key={index}
                            index={index}
                            question={question}
                            setAnswer={setAnswer}
                          ></ShowstopperQuestion>
                        )
                      }
                    )}
                  </>
                ) : (
                  state.questions.map(
                    (
                      question: ShowstopperQuestionType | MatchingQuestionType,
                      i
                    ) =>
                      isNestedActive(question) && (
                        <Box my={5}>
                          {'type' in question ? (
                            <MatchingQuestion
                              key={i}
                              index={i}
                              question={question}
                              setAnswer={setAnswer}
                            ></MatchingQuestion>
                          ) : (
                            <ShowstopperQuestion
                              key={i}
                              index={i}
                              question={question}
                              setAnswer={setAnswer}
                            ></ShowstopperQuestion>
                          )}
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
            <StyledButton variant="contained" color="primary" type="submit">
              Submit
            </StyledButton>
          )}
        </Container>
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
