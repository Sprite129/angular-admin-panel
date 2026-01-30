import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../model/user';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { UserResponse } from '../model/response';

@Injectable({
  providedIn: 'root',
})
export class UsersAPI {
  private http = inject(HttpClient);

  private url = "http://localhost:3000/users";

  usersPerPage = 10;

  getUserPage(page: number) {
    const params = new HttpParams().set(
      "_page", page
    ).set(
      "_per_page", this.usersPerPage
    );

    const request = this.http.get<UserResponse | undefined>(this.url, {params: params}).pipe(
      map(response => {
        if(!response)
          return;
        if(response.last < page)
          return;
        return response.data as User[];
      })
    );

    return toSignal(request, {initialValue: []});
  }

  getByName(name: string, page: number) {
    const params = new HttpParams().set("_sort", "-name")

    // I can't write a backend right now, so I'll filter by the whole database
    // Terrible for production (bc database may be enormous), but good enough for a quick pet project
    const request = this.http.get<User[] | undefined>(this.url, {params: params}).pipe( //Couldn't use the same type as in the last method due to json-server returning array of data on get all instead of response-like object
      map(users => {
        if(!users)
          return;
        const usersContainName = users.filter(user => user.name.includes(name))
        const arrayPage = (page - 1) * this.usersPerPage;
        return usersContainName.slice(arrayPage, arrayPage + this.usersPerPage)
      })
    )

    return toSignal(request, {initialValue: []})
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

    const request = this.http.get<UserResponse | undefined>(this.url, {params: params}).pipe(
      map(response => {
        if(!response)
          return;
        if(response.last < page)
          return;
        return response.data as User[];
      })
    );

    return toSignal(request, {initialValue: []});
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

    const request = this.http.get<UserResponse | undefined>(this.url, {params: params}).pipe(
      map(response => {
        if(!response)
          return;
        if(response.last < page)
          return;
        return response.data as User[];
      })
    );

    return toSignal(request, {initialValue: []});
  }
}
