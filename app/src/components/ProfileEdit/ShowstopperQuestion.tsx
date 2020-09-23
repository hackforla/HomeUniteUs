import * as React from 'react'
import { useParams, useHistory } from 'react-router'
import { useHostHomeData } from '../../data/data-context'
import { ProgressPlugin } from 'webpack'
import { ShowstopperQuestionType } from '../../models/ShowstopperQuestionType'
import styled from 'styled-components'
import * as Fields from '../Registration'

interface Props {
    index: number
    question: ShowstopperQuestionType
    setAnswer: (index: number, value: any) => void
}

const QuestionLabel = styled.label`
    margin: 15px 0;
    display: block;
`

const ShowstopperQuestion = (props: Props) => {
    const { question } = props

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.setAnswer(props.index, e.target.value)
    }

    return (
        <div>
            <QuestionLabel>{question.question}</QuestionLabel>
            <div>
                {/* 
                    TODO: Pending back-end implementation,
                        use nullable boolean, int ID, or at least const strings 
                        defined elsewhere 
                */}
                <Fields.RadioButtons
                    ariaLabel={question.question}
                    name={question.id}
                    value={question.answer || ''}
                    options={question.options || []}
                    onChange={handleChange}
                />
            </div>
        </div>
    )
}

export default ShowstopperQuestion
