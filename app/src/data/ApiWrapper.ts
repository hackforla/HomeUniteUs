import { ApiConfig } from './config'
import { Guest, Host } from '../models' //for some reason accounts wont import here?
import { Accounts } from '../models/Accounts'
import { ShowstopperQuestionType } from '../models/ShowstopperQuestionType'
import { MatchingQuestionType } from '../models/MatchingQuestionType'
import { HostResponse } from '../models/HostResponse'
import {
    MatchingQuestion,
    Photo,
    QualifyingQuestion,
    Question,
    QuestionType,
    ResponseOption,
} from '../models/v2'

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

type UserType = 'guest' | 'host'

export class ApiWrapper {
    private guestFetcher: Fetcher<Guest>
    private hostShowstopperQuestionsFetcher: Fetcher<QualifyingQuestion>
    private hostMatchingQuestionsFetcher: Fetcher<MatchingQuestion>
    private guestShowstopperQuestionsFetcher: Fetcher<QualifyingQuestion>
    private guestMatchingQuestionsFetcher: Fetcher<MatchingQuestion>
    private hostInformationForm: Fetcher<string>
    private hostContactForm: Fetcher<string>
    private hostAddressForm: Fetcher<string>
    private hostLanguageForm: Fetcher<string>
    private hostGenderForm: Fetcher<string>
    private hostShowstopperResponse: Fetcher<string>
    private hostMatchingResponse: Fetcher<string>

    public constructor(id?: number | string) {
        this.guestFetcher = new Fetcher<Guest>('guests')
        this.hostShowstopperQuestionsFetcher = new Fetcher<QualifyingQuestion>(
            `host/registration/qualifying`
        )
        this.hostMatchingQuestionsFetcher = new Fetcher<MatchingQuestion>(
            `host/registration/matching`
        )
        this.guestShowstopperQuestionsFetcher = new Fetcher<QualifyingQuestion>(
            `guest/registration/qualifying`
        )
        this.guestMatchingQuestionsFetcher = new Fetcher<MatchingQuestion>(
            `guest/registration/matching`
        )

        this.hostInformationForm = new Fetcher<string>(`host/registration/info`)
        this.hostContactForm = new Fetcher<string>(`host/registration/contact`)
        this.hostAddressForm = new Fetcher<string>(`host/registration/address`)
        this.hostLanguageForm = new Fetcher<string>(
            `host/registration/language`
        )

        this.hostGenderForm = new Fetcher<string>(`host/registration/gender`)

        this.hostShowstopperResponse = new Fetcher<string>(
            `host/registration/qualifying/${id}`
        )
        this.hostMatchingResponse = new Fetcher<string>(
            `host/registration/matching/${id}`
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
        Array<QualifyingQuestion>
    > {
        return await this.hostShowstopperQuestionsFetcher.getAll()
    }

    public async getHostMatchingQuestions(): Promise<Array<MatchingQuestion>> {
        return await this.hostMatchingQuestionsFetcher.getAll()
    }

    // Guests
    public async getGuestShowstopperQuestions(): Promise<
        Array<QualifyingQuestion>
    > {
        return await this.guestShowstopperQuestionsFetcher.getAll()
    }

    public async getGuestMatchingQuestions(): Promise<Array<MatchingQuestion>> {
        return await this.guestMatchingQuestionsFetcher.getAll()
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

    // TODO: Hassen
    public async putHostPictures(
        image: File,
        email: string,
        subject: string
    ): Promise<any> {
        try {
            const payload = new FormData()
            payload.append('email', email)
            payload.append('subject', subject)
            payload.append('image', image)
            const response = await fetch('/api/uploadImage', {
                method: 'POST',
                body: payload,
            })
            if (response.status !== 200) {
                throw new Error(`file ApiWrapper: ${response.statusText}`)
            }
        } catch (e) {
            throw new Error(`getHostPictures got an ${e}`)
        }
    }

    public async putMultiHostPictures(
        images: Array<File>,
        email: string,
        subject: string
    ): Promise<any> {
        try {
            const payload = new FormData()
            payload.append('email', email)
            payload.append('subject', subject)
            for (let image in images) {
                //i think this might work
                payload.append('image', image)
            }
            const response = await fetch('/api/uploadImage', {
                method: 'POST',
                body: payload,
            })
            if (response.status !== 200) {
                throw new Error(`file ApiWrapper: ${response.statusText}`)
            }
        } catch (e) {
            throw new Error(`getHostPictures got an ${e}`)
        }
    }

    public async downloadPhoto(imageId: string) {
        try {
            const response: Response = await fetch(
                `/api/host/images/download/${imageId}`
            )
            if (response.status !== 200) {
                throw new Error(
                    `fetch failed in downloadPhoto function: ${response.statusText}`
                )
            }
            return await response.blob()
        } catch (e) {
            throw new Error(`downloadPhoto failed for: ${imageId}, ${e}`)
        }
    }

    //TODO: hassen
    public async getHostPictures(
        hostEmail: string,
        subject: string
    ): Promise<Array<Photo>> {
        try {
            const response: Response = await fetch(
                `/api/host/images/${subject}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: hostEmail,
                    }),
                }
            )
            if (response.status !== 200) {
                throw new Error(`file ApiWrapper: ${response.statusText}`)
            }
            const responseJson = await response.json()
            return responseJson
        } catch (e) {
            throw new Error(`getHostPictures got an ${e}`)
        }
    }

    //TODO: hassen
    public async deleteHostPicture(
        hostEmail: string,
        imageId: number
    ): Promise<void> {
        try {
            const resp: Response = await fetch(`/api/host/image/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: JSON.stringify({
                    email: hostEmail,
                }),
            })
            if (resp.status !== 200) {
                throw new Error(`file ApiWrapper: ${resp.statusText}`)
            }
            const responseJson = await resp.json()
            return responseJson
        } catch (e) {
            throw new Error(`deleteHostPicture got an ${e}`)
        }
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

    public async putShowstopperQuestionResponse(
        id: number | string,
        item: HostResponse
    ): Promise<string> {
        return await this.hostShowstopperResponse.putById(id, item)
    }

    public async putMatchingQuestionResponse(
        id: number | string,
        item: HostResponse
    ): Promise<string> {
        return await this.hostMatchingResponse.putById(id, item)
    }

    public async addResponseOption(
        userType: UserType,
        questionId: string,
        responseOption: ResponseOption
    ) {
        try {
            const response = await fetch(
                `/api/questions/${userType}/registration/matching/${questionId}/options`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(responseOption),
                }
            )
            if (response.status !== 200) {
                throw new Error(
                    `bad response from server: ${response.statusText}`
                )
            }
            return await response.text()
        } catch (e) {
            throw new Error(`addResponseOption: error: ${e}`)
        }
    }

    public async deleteQuestion(
        userType: UserType,
        questionType: QuestionType,
        questionId: string
    ) {
        try {
            const response = await fetch(
                `/api/questions/${userType}/registration/${questionType}/${questionId}`,
                {
                    method: 'DELETE',
                }
            )
            if (response.status !== 200) {
                throw new Error(
                    `bad response from server: ${response.statusText}`
                )
            }
            return await response.text()
        } catch (e) {
            throw new Error(`deleteQuestion: error: ${e}`)
        }
    }
    public async updateQuestion(
        userType: UserType,
        questionType: QuestionType,
        question: Question
    ) {
        try {
            const response = await fetch(
                `/api/questions/${userType}/registration/${questionType.toLowerCase()}/${
                    question._id
                }`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(question),
                }
            )
            if (response.status !== 200) {
                throw new Error(
                    `bad response from server: ${response.statusText}`
                )
            }
            return await response.text()
        } catch (e) {
            throw new Error(`updateQuestion: error: ${e}`)
        }
    }
    public async updateResponseOption(
        userType: UserType,
        questionId: string,
        responseOption: ResponseOption
    ) {
        try {
            const response = await fetch(
                `/api/questions/${userType}/registration/matching/${questionId}/options/${responseOption.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(responseOption),
                }
            )
            if (response.status !== 200) {
                throw new Error(
                    `bad response from server: ${response.statusText}`
                )
            }
            return await response.text()
        } catch (e) {
            throw new Error(`updateQuestion: error: ${e}`)
        }
    }
}
