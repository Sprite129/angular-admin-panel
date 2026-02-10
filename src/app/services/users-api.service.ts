import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../model/user';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, of, Subject, switchMap } from 'rxjs';
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
  private idQuery$ = new Subject<string | null>();
  private updateQuery$ = new Subject<User>();
  private postQuery$ = new Subject<Omit<User, "id">>();

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
      if(id == null)
        // In the process of making this project I realised that it's better to use "null" for empty returns. I may refactor this code in future to resolve this oversight
        return of(undefined); 

      return this.getUserById(id);
    })
  )

  private updateResponse$ = this.updateQuery$.pipe(
    switchMap(user => this.updateUser(user))
  );

  private postResponse$ = this.postQuery$.pipe(
    switchMap(user => {
      return this.postUser(user);
    })
  );

  getByIdResponse = toSignal(this.idResponse$);
  getResponse = toSignal(this.response$);
  updateResponse = toSignal(this.updateResponse$);
  postResponse = toSignal(this.postResponse$);

  usersPerPage: number = 12;

  querySetId(id: string) {
    this.idQuery$.next(id);
  }

  resetByIdResponse() {
    this.idQuery$.next(null);
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

  postUserQuery(user: Omit<User, "id">) {
    this.postQuery$.next(user);
  }

  private updateUser(user: User) {
    return this.http.put<User>(`${this.url}/${user.id}`, user);
  }

  private getUsersPage(page: number) {
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

  private getByName(name: string, page: number) {
    const params = new HttpParams().set("_sort", "-name")

    // I can't write a backend right now, so I'll filter by the whole database
    // Terrible for production (bc database may be enormous), but good enough for a quick pet project
    return this.http.get<User[] | undefined>(this.url, { params: params }).pipe( //Couldn't use the same type as in the last method due to json-server returning array of data on get all instead of response-like object
      map(users => {
        if (!users)
          return;
        const usersContainName = users.filter(user => {
          const nameNoCase = user.name.toLowerCase();

          return nameNoCase.includes(name.toLowerCase());
        })
        const arrayPage = (page - 1) * this.usersPerPage;
        const returnedUsersArray = usersContainName.slice(arrayPage, arrayPage + this.usersPerPage)
        if (!returnedUsersArray.length)
          return;
        return returnedUsersArray;
      })
    )
  }

  private getUserPageToLowDebt(page: number) {
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

  private getUserPageToHighDebt(page: number) {
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

  private getUserById(id: string) {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  // We omit ID to let backend generate it
  private postUser(user: Omit<User, "id">) {
    return this.http.post<User>(this.url, user);
  }
}
