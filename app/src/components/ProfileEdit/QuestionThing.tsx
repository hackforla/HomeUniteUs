import * as React from "react"
import { useParams, useHistory } from "react-router"
import { useHostHomeData } from "../../data/data-context"
import { ProgressPlugin } from "webpack"
import { Question } from "../../models/Question"
import { FormControl, FormControlLabel, FormGroup, RadioGroup, Radio, Checkbox, TextField } from '@material-ui/core';

interface Props {
  question: Question,
  setAnswers: React.EventHandler<any>
}

const QuestionThing = ({ question }: Props) => {
  const history = useHistory()
  // let { question } = useParams()
  // const { markAsInterested, markAsNotInterested } = useHostHomeData()

  function handleChange(e: any) {

  }

  return (
    <div>
      <h2>{question.question}</h2>
      <div>
        {
          question.type === 'radio' && 
          <FormControl component="fieldset">
            <RadioGroup aria-label={question.question} key={question.id} name={question.id} value={question.answer} onChange={handleChange}>
              {
                question.options && question.options.map((option: any) => 
                  <FormControlLabel value={option.value} control={<Radio />} label={option.label} />
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
                    control={<Checkbox checked={(question.answer && question.answer.indexOf(option.value) !== -1)} onChange={handleChange} name={question.id + '[' + option.value + ']'} />}
                    label={option.label}
                  />
                )
              }
            </FormGroup>
          </FormControl>
        }
        {
          question.type === 'text' &&
          <TextField label="Your response" variant="outlined" value={question.answer} onChange={handleChange} />
        }
        {
          question.type === 'textarea' &&
          <TextField label="Your response" variant="outlined" value={question.answer} onChange={handleChange} multiline fullWidth />
        }
      </div>
    </div>
  )
}

export default QuestionThing
