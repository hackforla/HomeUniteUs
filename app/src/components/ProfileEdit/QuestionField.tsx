import * as React from "react"
import { useParams, useHistory } from "react-router"
import { useHostHomeData } from "../../data/data-context"
import { ProgressPlugin } from "webpack"
import { Question } from "../../models/Question"
import styled from "styled-components"
import { FormControl, FormControlLabel, FormGroup, RadioGroup, Radio, Checkbox, TextField } from '@material-ui/core';

const QuestionContainer = styled.div`
  min-height: 244px;
`

interface Props {
  question: QuestionResponse,
  setAnswer: (id: string, value: any) => void
};


interface QuestionLabelProps {
  label: string;
  value: string;
}

interface QuestionResponse {
  id: string;
  question: string;
  type: string;
  options?: Array<QuestionLabelProps>;
  answer: string | {[key:string]: boolean};
};


const QuestionField = (props: Props) => {
  const { question } = props;

  function handleChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
    const questionId = props.question.id;
    if (e.target.type === 'checkbox') {
      if ('checked' in e.target) {
        (props.question.answer as {[key:string]: boolean})[e.target.value] = e.target.checked;
      }
      props.setAnswer(questionId, props.question.answer);
    } else {
      props.setAnswer(questionId, e.target.value);
    }
  }

  return (
    <QuestionContainer>
      <h2>{question.question}</h2>
      <div>
        {
          question.type === 'radio' && 
          <FormControl component="fieldset">
            <RadioGroup aria-label={question.question} key={question.id} name={question.id} value={props.question.answer} onChange={handleChange}>
              {
                question.options && question.options.map((option: any) => 
                  <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
                )
              }
            </RadioGroup>
          </FormControl>
        }
        {
          question.type === 'checkbox' &&
          <FormControl component="fieldset">
            <FormGroup>
              {
                question.options && question.options.map((option: any) => 
                  <FormControlLabel
                    key={option.value}
                    control={<Checkbox checked={props.question.answer[option.value]} name={option.value} value={option.value} onChange={handleChange} />}
                    label={option.label}
                  />
                )
              }
            </FormGroup>
          </FormControl>
        }
        {
          question.type === 'text' &&
          <TextField label="Your response" variant="outlined" value={props.question.answer} onChange={handleChange} />
        }
        {
          question.type === 'textarea' &&
          <TextField label="Your response" variant="outlined" value={props.question.answer} onChange={handleChange} multiline rows={8} fullWidth />
        }
      </div>
    </QuestionContainer>
  )
}

export default QuestionField
