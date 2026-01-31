import { User } from "./user";

export interface UserResponse {
    data: User[] | User,
    first: number,
    items: number,
    last: number,
    next: number | null,
    pages: number,
    prev: number | null
}