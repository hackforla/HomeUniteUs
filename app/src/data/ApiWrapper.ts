import { ApiConfig } from './config'
import { Guest, Host } from '../models' //for some reason accounts wont import here?
import { Accounts } from '../models/Accounts'
import { ShowstopperQuestionType } from '../models/ShowstopperQuestionType'
import { MatchingQuestionType } from '../models/MatchingQuestionType'
import { ResponseValue } from '../models/ResponseValue'

class ApiFetchError extends Error {}

const getJson = async (uri: string) => {
    try {
        const response = await fetch(uri)
        if (response.status !== 200) {
            throw new Error(response.statusText)
        }
        return await response.json()
    } catch (e) {
        throw new ApiFetchError(
            `error in getJson(): error fetching '${uri}': ${e}`
        )
    }
}

const postJson = async (uri: string, data: string) => {
    try {
        const response = await fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        })
        if (response.status !== 200) {
            throw new Error(response.statusText)
        }
        return await response.json()
    } catch (e) {
        throw new ApiFetchError(
            `error in getJson(): error fetching '${uri}': ${e}`
        )
    }
}

const putJson = async (uri: string, data: string) => {
    try {
        const response = await fetch(uri, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        })
        if (response.status !== 200) {
            throw new Error(response.statusText)
        }
        return await response.json()
    } catch (e) {
        throw new ApiFetchError(
            `error in getJson(): error fetching '${uri}': ${e}`
        )
    }
}

export class Fetcher<T> {
    private endpoint: string

    public constructor(resourceName: string) {
        this.endpoint = `${ApiConfig.UriPrefix}/${resourceName}`
    }

    public async getAll(): Promise<Array<T>> {
        return (await getJson(this.endpoint)) as Array<T>
    }

    public async getById(id: string): Promise<T> {
        return (await getJson(`${this.endpoint}/${id}`)) as T
    }

   // id
    public async putById(id: string, item: object): Promise<string> {
        return (await putJson(
            `${this.endpoint}/${id}`,
            JSON.stringify(item)
        )) as string
    }

     // type: contactForm, photoUpload, etc
    public async putByType(type: string, item: object): Promise<string> {
        return (await putJson(
            `${this.endpoint}/${type}`,
            JSON.stringify(item)
        )) as string
    }


    `/api/hosts/contactForm`
    `/api/hosts/uploadPhoto`

    public async postResponse(item: object): Promise<string> {
        return (await postJson(
            `${this.endpoint}`,
            JSON.stringify(item)
        )) as string
    }
}

export class ApiWrapper {
    private guestFetcher: Fetcher<Guest>
    private hostQuestionsFetcher: Fetcher<QuestionType>
    private hostQuestionsPost: Fetcher<string>

    public constructor() {
        this.guestFetcher = new Fetcher<Guest>('guests')
        this.hostQuestionsFetcher = new Fetcher<QuestionType>('v1/questions')
        this.hostQuestionsPost = new Fetcher<string>('hosts')
    }

    // Guests
    public async getAllGuests(): Promise<Array<Guest>> {
        return await this.guestFetcher.getAll()
    }

    public async getGuestById(id: string): Promise<Guest> {
        return await this.guestFetcher.getById(id)
    }

    // Hosts
    public async getHostQuestions(): Promise<Array<QuestionType>> {
        return await this.hostQuestionsFetcher.getAll()
    }

    public async postHostQuestion(
        id: string,
        item: ResponseValue
    ): Promise<string> {
        return await this.hostQuestionsPost.putById(id, item)
    }
}
