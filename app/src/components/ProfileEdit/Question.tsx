import * as React from 'react'
import { useParams, useHistory } from 'react-router'
import { useHostHomeData } from '../../data/data-context'
import { ProgressPlugin } from 'webpack'
import { QuestionType } from '../../models/QuestionType'
import styled from 'styled-components'
import {
    FormControl,
    FormControlLabel,
    FormGroup,
    RadioGroup,
    Radio,
    Checkbox,
    TextField,
} from '@material-ui/core'

interface Props {
    question: QuestionType
    setAnswer: (id: string, value: any) => void
}

const QuestionLabel = styled.label`
    margin: 15px 0;
    display: block;
`

const Question = (props: Props) => {
    const { question } = props

    function handleChange(
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) {
        const questionId = props.question.id
        if (e.target.type === 'checkbox') {
            if ('checked' in e.target) {
                props.question.answer[e.target.value] = e.target.checked
            }
            props.setAnswer(questionId, props.question.answer)
        } else {
            props.setAnswer(questionId, e.target.value)
        }
    }

    return (
        <div>
            <QuestionLabel>{question.question}</QuestionLabel>
            <div>
                {question.type === 'radio' && (
                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label={question.question}
                            key={question.id}
                            name={question.id}
                            value={props.question.answer}
                            onChange={handleChange}
                        >
                            {question.options &&
                                question.options.map((option: any) => (
                                    <FormControlLabel
                                        key={option.value}
                                        value={option.value}
                                        control={<Radio />}
                                        label={option.label}
                                    />
                                ))}
                        </RadioGroup>
                    </FormControl>
                )}
                {question.type === 'checkbox' && (
                    <FormControl component="fieldset">
                        <FormGroup>
                            {question.options &&
                                question.options.map((option: any) => (
                                    <FormControlLabel
                                        key={option.value}
                                        control={
                                            <Checkbox
                                                checked={
                                                    props.question.answer[
                                                        option.value
                                                    ]
                                                }
                                                name={option.value}
                                                value={option.value}
                                                onChange={handleChange}
                                            />
                                        }
                                        label={option.label}
                                    />
                                ))}
                        </FormGroup>
                    </FormControl>
                )}
                {question.type === 'text' && (
                    <TextField
                        label=""
                        variant="outlined"
                        value={props.question.answer}
                        onChange={handleChange}
                    />
                )}
                {question.type === 'textarea' && (
                    <TextField
                        label=""
                        variant="outlined"
                        value={props.question.answer}
                        onChange={handleChange}
                        multiline
                        rows={8}
                        fullWidth
                    />
                )}
            </div>
        </div>
    )
}

export default Question
