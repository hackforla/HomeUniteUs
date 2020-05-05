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
  answer: Answer
}

const QuestionThing = (props: Props) => {
  const history = useHistory()
  const { question } = props;

  const [answer, setAnswer] = React.useState(props.answer);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const questionId = e.target.name;
    if (e.target.type === 'checkbox') {
      // todo checkboxes
      // question.answer[] = e.target.value;
    } else {
      answer.value = e.target.value;
    }
    console.log(questionId, e.target.value, answer);
    setAnswer(answer);
  }  

  console.log('!', answer);

  return (
    <QuestionContainer>
      <h2>{question.question}</h2>
      <div>
        {
          question.type === 'radio' && 
          <FormControl component="fieldset">
            <RadioGroup aria-label={question.question} key={question.id} name={question.id} value={answer.value} onChange={handleChange}>
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
                    control={<Checkbox checked={(answer.value && answer.value.indexOf(option.value) !== -1)} onChange={handleChange} name={question.id + '[' + option.value + ']'} />}
                    label={option.label}
                  />
                )
              }
            </FormGroup>
          </FormControl>
        }
        {
          question.type === 'text' &&
          <TextField label="Your response" variant="outlined" value={answer.value} onChange={handleChange} />
        }
        {
          question.type === 'textarea' &&
          <TextField label="Your response" variant="outlined" value={answer.value} onChange={handleChange} multiline fullWidth />
        }
      </div>
    </QuestionContainer>
  )
}

export default QuestionThing
