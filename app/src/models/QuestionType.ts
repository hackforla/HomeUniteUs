export interface QuestionType {
    id: string,
    question: string,
    type: string,
    options?: Array<any>,
    answer?: any,
    group?: string,
    subgroup?: string,
    order?: number,
    conditional_id?: string,
    conditional_value?: string
    showstopper?: string
}
