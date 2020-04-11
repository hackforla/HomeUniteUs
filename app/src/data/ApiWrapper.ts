import { ApiConfig } from './config';
import { Guest } from '../models';

class ApiFetchError extends Error {}

const getJson = async (uri: string) => {
    try {
        const response = await fetch(uri);
        if(response.status !== 200) {
            throw new Error(response.statusText);
        }
        return await response.json();
    } catch(e) {
        throw new ApiFetchError(`error in getJson(): error fetching '${uri}': ${e}`);
    }
};

export class Fetcher<T> {

    // private resourceName: string;
    private endpoint: string;

    public constructor(resourceName: string) {
        this.endpoint = `${ApiConfig.UriPrefix}/${resourceName}`;
    }

    public async getAll(): Promise<Array<T>> {
        return await getJson(this.endpoint) as Array<T>;
    }

    public async getById(id: string): Promise<T> {
        return await getJson(`${this.endpoint}/${id}`) as T;
    }

};

export class ApiWrapper {

    private guestFetcher: Fetcher<Guest>;

    public constructor() {
        this.guestFetcher = new Fetcher<Guest>('guests');
    }

    // Guests
    public async getAllGuests(): Promise<Array<Guest>> {
        return await this.guestFetcher.getAll();
    }

    public async getGuestById(id: string): Promise<Guest> {
        return await this.guestFetcher.getById(id);
    }

};