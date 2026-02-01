import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../model/user';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, Subject, switchMap } from 'rxjs';
import { UserResponse } from '../model/response';
import { QueryParams } from '../model/queryParams';
import { SortOptions } from '../model/sortOptions';

@Injectable({
  providedIn: 'root',
})
export class UsersAPI {
  private http = inject(HttpClient);

  private url = "http://localhost:3000/users";

  private query$ = new Subject<QueryParams>();
  private idQuery$ = new Subject<number>();
  private updateQuery$ = new Subject<User>();

  private response$ = this.query$.pipe(
    switchMap(query => {
      if (query.searchName && query.page)
        return this.getByName(query.searchName, query.page);

      if (query.sortOption == SortOptions.LOWEST && query.page)
        return this.getUserPageToHighDebt(query.page);

      if (query.sortOption == SortOptions.HIGHEST)
        return this.getUserPageToLowDebt(query.page);

      return this.getUsersPage(query.page);
    })
  );

  private idResponse$ = this.idQuery$.pipe(
    switchMap(id => {
      return this.getUserById(id);
    })
  )

  private updateResponse$ = this.updateQuery$.pipe(
    switchMap(user => this.updateUser(user))
  );

  getByIdResponse = toSignal(this.idResponse$);
  getResponse = toSignal(this.response$);
  updateResponse = toSignal(this.updateResponse$);

  usersPerPage: number = 12;

  querySetId(id: number) {
    this.idQuery$.next(id);
  }

  querySet(page: number, sortOption?: SortOptions, searchName?: string) {
    const params: QueryParams = {
      page: page,
      sortOption: sortOption ? sortOption : undefined,
      searchName: searchName ? searchName : undefined
    }

    this.query$.next(params);
  }

  updateUserQuery(user: User) {
    this.updateQuery$.next(user);
  }

  private updateUser(user: User) {
    return this.http.put<User>(`${this.url}/${user.id}`, user);
  }

  getUsersPage(page: number) {
    const params = new HttpParams().set(
      "_page", page
    ).set(
      "_per_page", this.usersPerPage
    );

    return this.http.get<UserResponse | undefined>(this.url, { params: params }).pipe(
      map(response => {
        if (!response)
          return;
        if (response.last < page)
          return;
        return response.data as User[];
      })
    );
  }

  getByName(name: string, page: number) {
    const params = new HttpParams().set("_sort", "-name")

    // I can't write a backend right now, so I'll filter by the whole database
    // Terrible for production (bc database may be enormous), but good enough for a quick pet project
    return this.http.get<User[] | undefined>(this.url, { params: params }).pipe( //Couldn't use the same type as in the last method due to json-server returning array of data on get all instead of response-like object
      map(users => {
        if (!users)
          return;
        const usersContainName = users.filter(user => user.name.includes(name))
        const arrayPage = (page - 1) * this.usersPerPage;
        const returnedUsersArray = usersContainName.slice(arrayPage, arrayPage + this.usersPerPage)
        if (!returnedUsersArray.length)
          return;
        return returnedUsersArray;
      })
    )
  }

  getUserPageToLowDebt(page: number) {
    const params = new HttpParams().set(
      "_page", page
    )
      .set(
        "_per_page", this.usersPerPage
      )
      .set(
        "_sort", "-debt"
      );

    return this.http.get<UserResponse | undefined>(this.url, { params: params }).pipe(
      map(response => {
        if (!response)
          return;
        if (response.last < page)
          return;
        return response.data as User[];
      })
    );
  }

  getUserPageToHighDebt(page: number) {
    const params = new HttpParams().set(
      "_page", page
    )
      .set(
        "_per_page", this.usersPerPage
      )
      .set(
        "_sort", "debt"
      );

    return this.http.get<UserResponse | undefined>(this.url, { params: params }).pipe(
      map(response => {
        if (!response)
          return;
        if (response.last < page)
          return;
        return response.data as User[];
      })
    );
  }

  getUserById(id: number) {
    return this.http.get<User>(`${this.url}/${id}`);
  }
}
