import * as React from 'react'
import { useHistory } from 'react-router'

interface BasicOption {
  text: string
  value: number
}

interface Question {
  text: string
  type: 'text' | 'date' | 'single'
  options?: Array<BasicOption>
}

interface GroupQuestion {
  next: Map<number, GroupQuestion>
  question: Question
}

interface GroupQuestionPromptProps {
  groupQuestion: GroupQuestion
}

export const GroupQuestionPrompt = function (props: GroupQuestionPromptProps) {
  const history = useHistory()

  const [state, setState] = React.useState({
    response: 0,
  })

  return (
    <>
      {(() => {
        switch (props.groupQuestion.question.type) {
          case 'date':
            return (
              <input
                type="date"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setState({
                    ...state,
                    response: event.target.value,
                  })
                }
              />
            )

          case 'text':
            return (
              <input
                type="text"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setState({
                    ...state,
                    response: event.target.value,
                  })
                }
              />
            )

          case 'single':
            return (
              <select
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  setState({
                    ...state,
                    response: event.target.value,
                  })
                }
              >
                {props.groupQuestion.question.options?.map(
                  (option: BasicOption) => {
                    ;<option value={option.value}>{option.text}</option>
                  }
                )}
              </select>
            )

          default:
            return <div></div>
        }
      })()}
      <button
        onClick={() => {
          history.push(
            `/groupQuestion/${props.groupQuestion.next.get(state.response)}`
          )
        }}
      >
        Go
      </button>
    </>
  )
}
