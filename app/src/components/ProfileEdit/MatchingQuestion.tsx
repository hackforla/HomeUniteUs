import * as React from 'react'
import { useParams, useHistory } from 'react-router'
import { useHostHomeData } from '../../data/data-context'
import { ProgressPlugin } from 'webpack'
import { MatchingQuestionType } from '../../models/MatchingQuestionType'
import styled from 'styled-components'
import * as Fields from '../Registration'

interface Props {
  index: number
  question: MatchingQuestionType
  setAnswer: (index: number, value: any) => void
}

const QuestionLabel = styled.label`
  margin: 15px 0;
  display: block;
`

const MatchingQuestion = (props: Props) => {
  const { question } = props

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    if (e.target.type === 'checkbox') {
      if (!question.answer) question.answer = {}
      if ('checked' in e.target) {
        question.answer[e.target.value] = e.target.checked
      }
      props.setAnswer(props.index, question.answer)
    } else {
      props.setAnswer(props.index, e.target.value)
    }
  }

  return (
    <div>
      <QuestionLabel>{question.question}</QuestionLabel>
      <div>
        {question.type === 'radio' && (
          <Fields.RadioButtons
            ariaLabel={question.question}
            name={question.id}
            value={question.answer || ''}
            options={question.options || []}
            onChange={handleChange}
          />
        )}
        {question.type === 'checkbox' && (
          <Fields.Checkbox
            value={question.answer || {}}
            options={question.options || []}
            onChange={handleChange}
          />
        )}
        {question.type === 'text' && (
          <Fields.TextInput
            name={question.id}
            value={question.answer || ''}
            onChange={handleChange}
            autocomplete="off"
          />
        )}
        {question.type === 'textarea' && (
          <Fields.LargeTextInput
            name={question.id}
            value={question.answer || ''}
            onChange={handleChange}
            rows={8}
          />
        )}
      </div>
    </div>
  )
}

export default MatchingQuestion
