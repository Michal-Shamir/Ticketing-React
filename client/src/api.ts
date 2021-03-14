import axios from 'axios';
import {APIRootPath} from '@fed-exam/config';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
}

export type ApiClient = {
    getTickets: (value: string, page : number, sort: boolean) => Promise<Ticket[]>;
}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: (value : string, page : number, sort: boolean) => {
            return axios.get(`${APIRootPath}?search=${value}&sort=${sort}&page=${page}`).then((res) => res.data);
        }
    }
}
