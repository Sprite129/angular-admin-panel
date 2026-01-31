import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Status } from '../../model/statuses';
import { UserCard } from "../user-card/user-card.component";
import { UsersAPI } from '../../services/users-api.service';
import { User } from '../../model/user';
import { SortOptions } from '../../model/sortOptions';

@Component({
  selector: 'app-main-page',
  imports: [UserCard],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPage implements OnInit{
  private userService = inject(UsersAPI);

  page = signal(1);
  searchTerm = signal('');
  sortBy = signal<SortOptions>(SortOptions.NONE);

  users = this.userService.getResponse;

  ngOnInit(): void {
    this.userService.querySet(1, SortOptions.HIGHEST);
  }
}
