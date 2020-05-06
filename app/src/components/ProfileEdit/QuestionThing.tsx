import * as React from "react"
import { useParams, useHistory } from "react-router"
import { useHostHomeData } from "../../data/data-context"
import { ProgressPlugin } from "webpack"
import { Question } from "../../models/Question"
import { Answer } from "../../models/Answer"
import styled from "styled-components"
import { FormControl, FormControlLabel, FormGroup, RadioGroup, Radio, Checkbox, TextField } from '@material-ui/core';

const QuestionContainer = styled.div`
  min-height: 244px;
`

interface Props {
  question: Question,
  answer: Answer,
  setAnswer: (id: string, value: any) => void
};

const QuestionThing = (props: Props) => {
  const history = useHistory()
  const { question, answer } = props;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const questionId = e.target.name;
    console.log(questionId, e.target.value);
    if (e.target.type === 'checkbox') {
      props.setAnswer(questionId, e.target.checked);
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
            <RadioGroup aria-label={question.question} key={question.id} name={question.id} value={props.answer.value} onChange={handleChange}>
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
                    control={<Checkbox checked={(props.answer.value && props.answer.value.indexOf(option.value) !== -1)} onChange={handleChange} name={question.id + '[' + option.value + ']'} />}
                    label={option.label}
                  />
                )
              }
            </FormGroup>
          </FormControl>
        }
        {
          question.type === 'text' &&
          <TextField label="Your response" variant="outlined" value={props.answer.value} onChange={handleChange} />
        }
        {
          question.type === 'textarea' &&
          <TextField label="Your response" variant="outlined" value={props.answer.value} onChange={handleChange} multiline fullWidth />
        }
      </div>
    </QuestionContainer>
  )
}

export default QuestionThing
