export interface MatchingQuestionType {
    id: string
    question: string
    type: string
    options?: Array<any>
    answer?: any
    group?: string
    subgroup?: string
    order?: number
    conditional_id?: string
    conditional_value?: string
}
