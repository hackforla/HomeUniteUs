import { ApiConfig } from './config'
import { Guest, Host } from '../models' //for some reason accounts wont import here?
import { Accounts } from '../models/Accounts'
import { QuestionType } from '../models/QuestionType'

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

const hasAccount = async (uri: string, data: any | undefined) => {
    try {
        const response = await fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        })
        if (response.status !== 200) {
            return { errorMessage: "User doesn't exist " }
        }
        return await response.json()
    } catch (e) {
        throw new ApiFetchError(
            `error in hasAccount(): error fetching '${uri}': ${e}`
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

    public async putById(id: string, item: T): Promise<string> {
        return (await putJson(
            `${this.endpoint}/${id}`,
            JSON.stringify(item)
        )) as string
    }
}

export class ApiWrapper {
    private guestFetcher: Fetcher<Guest>
    private hostQuestionsFetcher: Fetcher<QuestionType>

    public constructor() {
        this.guestFetcher = new Fetcher<Guest>('guests')
        this.hostQuestionsFetcher = new Fetcher<QuestionType>('v1/questions')
    }

    // Guests
    public async getAllGuests(): Promise<Array<Guest>> {
        return await this.guestFetcher.getAll()
    }

    public async getGuestById(id: string): Promise<Guest> {
        return await this.guestFetcher.getById(id)
    }

    public async getUserAccount(data: any): Promise<any> {
        return await hasAccount(`${ApiConfig.UriPrefix}/checkEmail`, data)
    }

    // Hosts
    public async getHostQuestions(): Promise<Array<QuestionType>> {
        return await this.hostQuestionsFetcher.getAll()
    }
}
