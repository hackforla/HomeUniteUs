import * as React from "react"
import QuestionField from "../components/ProfileEdit/Question"

import styled from "styled-components"
import { Button, LinearProgress } from '@material-ui/core';
import { QuestionType } from "../models/QuestionType"
import { Fetcher } from "../data/ApiWrapper";
import { GuestQuestion, ResponseValue } from "../models";

const Container = styled.div`
  margin: 30px auto;
  padding: 0 15px;
  max-width: 1140px;
`

const StyledButton = styled(Button)`
  font-size: 16px;
  margin: 5px !important;
`

interface GuestQuestionsPageProps {

}

const initialState = {
  questions: new Array<QuestionResponse>(),
  questionIndex: 0
};


interface QuestionLabelProps {
  label: string;
  value: string;
}
interface QuestionResponse {
  id: string;
  question: string;
  type: string;
  options: Array<QuestionLabelProps>;
  answer: string;
};

// {
//   id: '1',
//   question: 'How would you describe your home?',
//   type: 'radio',
//   options: [
//     {label: 'Owned Single-Unit', value: 'single'}, 
//     {label: 'Owned Multi-Unit', value: 'multi'},
//     {label: 'Owned House', value: 'house'}
//   ],
//   answer: 'house'
// }

export const GuestQuestionsPage = () => {
  const [state, setState] = React.useState(initialState);

  const fetcher = new Fetcher<GuestQuestion>('hostQuestions');
  const rvFetcher = new Fetcher<ResponseValue>('responseValues');

  React.useEffect(() => {

    rvFetcher.getAll().then((rvs: Array<ResponseValue>) => {
      fetcher.getAll().then((questions: Array<GuestQuestion>) => {
        setState({
          ...state,
          questions: questions.map((q, index) => {
            return {
              type: 'radio',
              question: q.text,
              answer: '',
              id: `${index}`,
              options: q.responseValues.map((rvId: number) => {
                try {
                  const rv = rvs.filter(v => v.id === rvId)[0];
                  return {
                    label: rv.text,
                    value: rv.text
                  }
                }
                catch(e) {
                  return {
                    label: `error for rvId ${rvId}: ${e}`,
                    value: 'error'

                  };
                }
              })
            }
          })
        })
      });

    })

  }, []);

  function setAnswer(id: string, answer: any) {
    setState({
      ...state,
      questions: state.questions.map(q => {
        if (q.id === id) {
          return { ...q, answer };
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

  return (
    <Container>
      <LinearProgress variant="determinate" value={state.questionIndex / state.questions.length * 100} />
      <form noValidate autoComplete="off">
        <QuestionField question={state.questions[state.questionIndex]} setAnswer={setAnswer}></QuestionField>
      </form>
      <StyledButton variant="contained" color="primary" onClick={() => state.questionIndex > 0 && setQuestionIndex(state.questionIndex - 1)}>Back</StyledButton>
      <StyledButton variant="contained" color="primary" onClick={() => state.questionIndex < state.questions.length - 1 && setQuestionIndex(state.questionIndex + 1)}>Forward</StyledButton>
    </Container>
  )
}


export default GuestQuestionsPage
