import { SortOptions } from "./sortOptions";

export interface QueryParams {
    page: number,
    searchName: string | undefined,
    sortOption: SortOptions | undefined
}