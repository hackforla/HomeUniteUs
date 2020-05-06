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
  // questions: Array<Question>,
  // answers: Array<Answer>
}

const questions = [
  {
    id: '1',
    question: 'How would you describe your home?',
    type: 'radio',
    options: [
      {label: 'Owned Single-Unit', value: 'single'}, 
      {label: 'Owned Multi-Unit', value: 'multi'},
      {label: 'Owned House', value: 'house'}
    ]
  },
  {
    id: '2',
    question: 'Do you allow drinking there?',
    type: 'radio',
    options: [
      {label: 'Yes', value: 'yes'}, 
      {label: 'We don\'t drink, but it is allowed', value: 'we-dont'}, 
      {label: 'No', value: 'no'}
    ],
  },
  {
    id: '3',
    question: 'Do you allow smoking at your residence?',
    type: 'radio',
    options: [
      {label: 'Yes, we smoke inside', value: 'inside'},
      {label: 'Yes, but only outside', value: 'outside'},
      {label: 'No', value: 'no'}
    ]
  },
  {
    id: '4',
    question: 'Do you allow substance use at your residence?',
    type: 'radio',
    options: [
      {label: 'Yes', value: 'yes'},
      {label: 'No', value: 'no'},
    ]
  },
  {
    id: '5',
    question: 'What are your interests?',
    type: 'checkbox',
    options: [
      {label: 'Tinkering', value: 'tinkering'},
      {label: 'Trashy TV', value: 'tv'},
      {label: 'Puzzles', value: 'puzzles'},
      {label: 'Cheesecakes', value: 'cheesecakes'}
    ]
  },
  {
    id: '6',
    question: 'Tell us about yourself',
    type: 'textarea'
  }
];

const answers = [
  {id: '1', value: 'house'},
  {id: '2', value: ''},
  {id: '3', value: 'outside'},
  {id: '4', value: 'no'},
  {id: '5', value: ['cheesecakes', 'tv']},
  {id: '6', value: 'my name is philbert rosenthal'}
];

const initialState = {
  questions,
  answers,
  questionIndex: 0
};

export const ProfileEditPage = (props: ProfileEditProps) => {
  const [state, setState] = React.useState(initialState);

  function setAnswer(id: string, value: any) {
    setState({
      ...state,
      answers: state.answers.map(a => {
        if (a.id === id) {
          return {...a, value};
        } else {
          return a;
        }
      })
    });
  }

  function setQuestionIndex(index: number) {
    setState({
      ...state,
      questionIndex: index
    });
  }

  return(
    <Container>
      <LinearProgress variant="determinate" value={state.questionIndex / state.questions.length * 100} />
      <form noValidate autoComplete="off">
        <QuestionThing question={state.questions[state.questionIndex]} answer={state.answers[state.questionIndex]} setAnswer={setAnswer}></QuestionThing>
      </form>
      <StyledButton variant="contained" color="primary" onClick={() => state.questionIndex > 0 && setQuestionIndex(state.questionIndex - 1)}>Back</StyledButton>
      <StyledButton variant="contained" color="primary" onClick={() => state.questionIndex < state.questions.length - 1 && setQuestionIndex(state.questionIndex + 1)}>Forward</StyledButton>
    </Container>
  )
}
