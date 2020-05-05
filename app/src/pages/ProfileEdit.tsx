import * as React from "react"
import QuestionThing from "../components/ProfileEdit/QuestionThing"

import styled from "styled-components"
import { Button, LinearProgress } from '@material-ui/core';
import { Question } from "../models/Question"
import { Answer } from "../models/Answer"

const Container = styled.div`
  margin: 30px auto;
  padding: 0 15px;
  max-width: 1140px;
`

const StyledButton = styled(Button)`
  font-size: 16px;
  margin: 5px !important;
`

interface ProfileEditProps {
  questions: Array<Question>,
  answers: Array<Answer>
}

export const ProfileEditPage = (props: ProfileEditProps) => {
  const [questionIndex, setQuestionIndex] = React.useState(0);

  return(
    <Container>
      <LinearProgress variant="determinate" value={questionIndex / props.questions.length * 100} />
      <form noValidate autoComplete="off">
        <QuestionThing question={props.questions[questionIndex]} answer={props.answers[questionIndex]}></QuestionThing>
      </form>
      <StyledButton variant="contained" color="primary" onClick={() => questionIndex > 0 && setQuestionIndex(questionIndex - 1)}>Back</StyledButton>
      <StyledButton variant="contained" color="primary" onClick={() => questionIndex < props.questions.length - 1 && setQuestionIndex(questionIndex + 1)}>Forward</StyledButton>
    </Container>
  )
}
