import { ApiConfig } from './config'
import { Guest, Host } from '../models' //for some reason accounts wont import here?
import { Accounts } from '../models/Accounts'
import { ShowstopperQuestionType } from '../models/ShowstopperQuestionType'
import { MatchingQuestionType } from '../models/MatchingQuestionType'
import { HostResponse } from '../models/HostResponse'

class ApiFetchError extends Error {}

/* purists about HTTP: https://restfulapi.net/rest-put-vs-post/ */

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

    public async putById(id: number | string, item: object): Promise<string> {
        return (await putJson(
            `${this.endpoint}/${id}`,
            JSON.stringify(item)
        )) as string
    }

    public async putResponse(item: object): Promise<string> {
        return (await putJson(
            `${this.endpoint}`,
            JSON.stringify(item)
        )) as string
    }
}

export class ApiWrapper {
    private guestFetcher: Fetcher<Guest>
    private hostShowstopperQuestionsFetcher: Fetcher<ShowstopperQuestionType>
    private hostMatchingQuestionsFetcher: Fetcher<MatchingQuestionType>
    private hostInformationForm: Fetcher<string>
    private hostContactForm: Fetcher<string>
    private hostAddressForm: Fetcher<string>
    private hostLanguageForm: Fetcher<string>
    private hostGenderForm: Fetcher<string>
    private hostQuestionsResponse: Fetcher<string>

    public constructor(id?: number | string) {
        this.guestFetcher = new Fetcher<Guest>('guests')
        this.hostShowstopperQuestionsFetcher = new Fetcher<
            ShowstopperQuestionType
        >(`v1/questions/host/qualifying`)
        this.hostMatchingQuestionsFetcher = new Fetcher<MatchingQuestionType>(
            `v1/questions/host/matching`
        )

        this.hostInformationForm = new Fetcher<string>(`host/registration/info`)
        this.hostContactForm = new Fetcher<string>(`host/registration/contact`)
        this.hostAddressForm = new Fetcher<string>(`host/registration/address`)
        this.hostLanguageForm = new Fetcher<string>(
            `host/registration/language`
        )
        this.hostGenderForm = new Fetcher<string>(`host/registration/gender`)
        this.hostQuestionsResponse = new Fetcher<string>(
            `/api/v1/hostRegisterQuestions/${id}`
        )
    }

    // Guests
    public async getAllGuests(): Promise<Array<Guest>> {
        return await this.guestFetcher.getAll()
    }

    public async getGuestById(id: string): Promise<Guest> {
        return await this.guestFetcher.getById(id)
    }

    // Hosts
    public async getHostShowstopperQuestions(): Promise<
        Array<ShowstopperQuestionType>
    > {
        return await this.hostShowstopperQuestionsFetcher.getAll()
    }

    public async getHostMatchingQuestions(): Promise<
        Array<MatchingQuestionType>
    > {
        return await this.hostMatchingQuestionsFetcher.getAll()
    }

    /*POST vs PUT: 
    -create and POST the client profile (empty to start)
    -every 'submit' thereafter is a series of updates to the profile up to and including the final submit page*/

    public async putHostInformation(item: object): Promise<string> {
        return await this.hostInformationForm.putResponse(item)
    }

    public async putHostContact(item: object): Promise<string> {
        return await this.hostContactForm.putResponse(item)
    }

    public async putHostAddress(item: object): Promise<string> {
        return await this.hostAddressForm.putResponse(item)
    }

    public async putHostLanguage(item: object): Promise<string> {
        return await this.hostLanguageForm.putResponse(item)
    }

    public async putHostGender(item: object): Promise<string> {
        return await this.hostGenderForm.putResponse(item)
    }

    // TODO: point this call to the appropriate API route /matching or /qualifying
    //    because they will be kept in separate collections. add an extra param
    //    to this call for string interpolation or define a dedicated function for each
    //    HostResponse may not be appropriate as currently defined,
    //        Matching PUT body: { "email": string, "response": Response ID(s) or a string }
    //question ID
    public async putHostRegistrationResponse(
        id: number | string,
        item: HostResponse
    ): Promise<string> {
        return await this.hostQuestionsResponse.putById(id, item)
    }
}
