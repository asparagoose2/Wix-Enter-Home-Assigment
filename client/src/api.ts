import axios from 'axios';
import {APIRootPath} from '@fed-exam/config';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
    isPinned: boolean;
}

export type ApiClient = {
    getTickets: (page?: Number) => Promise<Ticket[]>;
    totalTickets: () => Promise<number>;
}

interface ServerData {
    page: number
}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: (p?) => {
            return axios.get(APIRootPath,{
                params:{page:p}
            }).then((res) => res.data["tickets"]);
        },
        totalTickets: () => {
            return axios.get(APIRootPath).then((res) => res.data["len"]);
        }
    }
}


// export const nextPage = () :ApiClient => {

//     axios.request

//     return {
//         getTickets: () => {
//             return axios.get(APIRootPath,).then((res) => res.data);
//         }
//     }
// }