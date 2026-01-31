import { SortOptions } from "./sortOptions";

export interface QueryParams {
    page: number,
    sortOption: SortOptions | undefined
    searchName: string | undefined,
}