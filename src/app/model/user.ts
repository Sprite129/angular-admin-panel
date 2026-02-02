import { Status } from "./statuses";

export interface User {
    id?: number,
    name: string,
    dateOfBirth: Date,
    info: string[],
    status: Status,
    debt: number,
    address: string,
    contacts: string[]
}