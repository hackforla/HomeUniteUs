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
    throw new ApiFetchError(`error in getJson(): error fetching '${uri}': ${e}`)
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
    throw new ApiFetchError(`error in getJson(): error fetching '${uri}': ${e}`)
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
    throw new ApiFetchError(`error in getJson(): error fetching '${uri}': ${e}`)
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

  // by id : string or integer
  public async putById(id: string, item: object): Promise<string> {
    return (await putJson(
      `${this.endpoint}/${id}`,
      JSON.stringify(item)
    )) as string
  }

  public async postResponse(item: object): Promise<string> {
    return (await postJson(`${this.endpoint}`, JSON.stringify(item))) as string
  }
}

export class ApiWrapper {
  private guestFetcher: Fetcher<Guest>
  private hostShowstopperQuestionsFetcher: Fetcher<ShowstopperQuestionType>
  private hostMatchingQuestionsFetcher: Fetcher<MatchingQuestionType>
  private hostInformationPost: Fetcher<string>
  private hostQuestionsPost: Fetcher<string>

  public constructor(id?: number | string) {
    this.guestFetcher = new Fetcher<Guest>('guests')
    this.hostShowstopperQuestionsFetcher = new Fetcher<ShowstopperQuestionType>(
      `hostQuestions`
    )
    this.hostMatchingQuestionsFetcher = new Fetcher<MatchingQuestionType>(
      `hostQuestions`
    )
    this.hostInformationPost = new Fetcher<string>('host/')
    this.hostQuestionsPost = new Fetcher<string>(`host/questions/${id}`)
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

  /*POST vs PUT: per our design
    -create and POST the client profile (empty to start)
    -every 'submit' thereafter is a series of updates to the profile up to and including the final submit page*/

  //id here is 'contact-info'
  public async postHostInformation(id: string, item: object): Promise<string> {
    return await this.hostInformationPost.putById(id, item)
  }

  //id here is questionID
  public async putHostSelectResponse(
    id: string,
    item: HostResponse
  ): Promise<string> {
    return await this.hostQuestionsPost.putById(id, item)
  }
}
