export interface QuestionType {
    id: string,
    question: string,
    type: string,
    parent?: string,
    options?: Array<any>,
    answer?: any
}
