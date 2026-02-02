import { Component, effect, ElementRef, inject, signal } from '@angular/core';
import { UserCard } from "../user-card/user-card.component";
import { UsersAPI } from '../../services/users-api.service';
import { SortOptions } from '../../model/sortOptions';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-main-page',
  imports: [UserCard, RouterLink],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPage {
  private userService = inject(UsersAPI);

  page = signal(1);
  searchTerm = signal('');
  sortBy = signal<SortOptions>(SortOptions.NONE);

  timeout: number = 0;
  searchDelay: number = 700;
  pageBeforeSearch: number = 1;

  users = this.userService.getResponse;

  constructor() {
    // I'm not sure if this is a correct way to use effects, but I can't read up on them right now
    effect(() => {
      this.userService.querySet(this.page(), this.sortBy(), this.searchTerm());
    })

    effect(() => {
      if (!this.users() && (this.page() > 1 || this.page() <= 0)) {
        this.page.set(1);
      }
    })
  }

  onSortByHighest() {
    if (this.sortBy() == SortOptions.NONE || this.sortBy() == SortOptions.LOWEST)
      this.sortBy.set(SortOptions.HIGHEST);
    else
      this.sortBy.set(SortOptions.NONE);
  }

  onSortByLowest() {
    if (this.sortBy() == SortOptions.NONE || this.sortBy() == SortOptions.HIGHEST)
      this.sortBy.set(SortOptions.LOWEST);
    else
      this.sortBy.set(SortOptions.NONE);
  }

  onNextPage() {
    this.page.update(val => val + 1);
  }

  onPrevPage() {
    this.page.update(val => val - 1);
  }

  onInput(event: Event) {
    if(this.timeout)
      clearInterval(this.timeout);

    this.timeout = setInterval(() => {
      this.searchTerm.set((event.target as HTMLInputElement).value);
      clearInterval(this.timeout);
    }, 1000);
  }
}
