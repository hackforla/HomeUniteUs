export interface Host {
    // The Mongo ID
    _id: string

    // Account email
    email: string

    //TODO: named interface with nullable fields, based on UI form
    info: any

    //TODO: named interface with nullable fields, based on UI form
    contact: any

    //TODO: named interface with nullable fields, based on UI form
    address: any

    //TODO: named interface with nullable fields, based on UI form
    language: any

    //TODO: named interface with nullable fields, based on UI form
    gender: any

    //TODO: Map of matching question IDs to responses:
    //    Object<string, string | number | Array<string>>
    matchingResponses: GenericQuestionResponseSet

    //TODO: Map of qualifying question IDs to responses:
    //    Object<string, string | number | Array<string>>
    qualifyingResponses: GenericQuestionResponseSet
}
