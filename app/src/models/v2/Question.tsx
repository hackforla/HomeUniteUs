export type QuestionType = 'qualifying' | 'matching' | 'info'

export interface GenericQuestion {
    _id: string
    id: string
    questionType: QuestionType
    group: string
    question: string
    order: string
}

export interface QualifyingQuestion extends GenericQuestion {
    options: Array<ResponseOption>
}

export interface ResponseOption {
    text: string
    id: string
    value: string
    label: string
}

export interface MatchingQuestion extends GenericQuestion {
    subgroup: string
    options: Array<ResponseOption>
    type: string
}

export interface InfoQuestion extends GenericQuestion {
    options: Array<ResponseOption>
    type: string
}

export type Question = InfoQuestion | MatchingQuestion | QualifyingQuestion

export interface GenericQuestionResponseSet {
    [index: string]: string | number | Array<string>
}
