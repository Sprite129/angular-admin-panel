import { Status } from "./statuses";

export interface User {
    id: string,
    name: string,
    dateOfBirth: Date,
    info: string[],
    status: Status,
    debt: number,
    address: string,
    contacts: string[]
}