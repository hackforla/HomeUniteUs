import * as React from "react"
import Question from "../components/ProfileEdit/Question"

import styled from "styled-components"
import { Button, LinearProgress } from '@material-ui/core';

const Container = styled.div`
  margin: 30px auto;
  padding: 0 15px;
  max-width: 1140px;
`

const StyledButton = styled(Button)`
  font-size: 16px;
  margin: 5px !important;
`

const questions = [
  {
    id: '1',
    question: 'How would you describe your home?',
    type: 'radio',
    options: [
      {label: 'Owned Single-Unit', value: 'single'}, 
      {label: 'Owned Multi-Unit', value: 'multi'},
      {label: 'Owned House', value: 'house'}
    ],
    answer: 'house'
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
    answer: 'yes'
  },
  {
    id: '3',
    question: 'Do you allow smoking at your residence?',
    type: 'radio',
    options: [
      {label: 'Yes, we smoke inside', value: 'inside'},
      {label: 'Yes, but only outside', value: 'outside'},
      {label: 'No', value: 'no'}
    ],
    answer: 'outside'
  },
  {
    id: '4',
    question: 'Do you allow substance use at your residence?',
    type: 'radio',
    options: [
      {label: 'Yes', value: 'yes'},
      {label: 'No', value: 'no'},
    ],
    answer: 'no'
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
    ],
    answer: {
      tinkering: false,
      tv: true,
      puzzles: false,
      cheesecakes: true,
    }
  },
  {
    id: '6',
    question: 'Tell us about yourself',
    type: 'textarea',
    answer: 'I have many leather-bound books'
  }
];

const initialState = {
  questions,
  questionIndex: 0
};

export const ProfileEditPage = () => {
  const [state, setState] = React.useState(initialState);

  function setAnswer(id: string, answer: any) {
    setState({
      ...state,
      questions: state.questions.map(q => {
        if (q.id === id) {
          return {...q, answer};
        } else {
          return q;
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
        <Question question={state.questions[state.questionIndex]} setAnswer={setAnswer}></Question>
      </form>
      <StyledButton variant="contained" color="primary" onClick={() => state.questionIndex > 0 && setQuestionIndex(state.questionIndex - 1)}>Back</StyledButton>
      <StyledButton variant="contained" color="primary" onClick={() => state.questionIndex < state.questions.length - 1 && setQuestionIndex(state.questionIndex + 1)}>Forward</StyledButton>
    </Container>
  )
}
