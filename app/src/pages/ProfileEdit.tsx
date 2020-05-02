import * as React from "react"
import { AboutStyle } from "./style"
import QuestionThing from "../components/ProfileEdit/QuestionThing"

import styled from "styled-components"
import { FormControl, FormControlLabel, Button, RadioGroup, Radio, LinearProgress } from '@material-ui/core';

const Container = styled.div`
  margin: 30px auto;
  padding: 0 15px;
  max-width: 1140px;
`

const ProgressBar = styled.div`
  width: 500px;
  height: 6px;
  background: blue;
  margin-bottom: 30px;
`

const QuestionContainer = styled.div`
  margin: 30px;
`

const StyledButton = styled(Button)`
  background: #1b1b70;
  color: white;
  padding: 10px 30px;
  margin-right: 20px;
  border: 0;
  font-size: 16px;
  cursor: pointer;
`

let questionIndex = 0;

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
    answer: ['cheesecakes', 'tv']
  },
  {
    id: '6',
    question: 'Tell us about yourself',
    type: 'textarea',
    answer: 'my name is philbert rosenthal'
  }
];

export interface ProfileEditProps {
  questions: [object]
}

export const ProfileEditPage = (props: ProfileEditProps) => {
  const [answers, setAnswers] = React.useState([
  ]);

  return(
    <Container>
      <LinearProgress variant="determinate" value={30} />
      <form noValidate autoComplete="off">
        {
          questions.map((question, i) => 
            <QuestionThing question={question} setAnswers={setAnswers}></QuestionThing>
          )
        }
      </form>
      <Button color="primary">Back</Button>
      <StyledButton color="primary">Forward</StyledButton>
    </Container>
  )
}
