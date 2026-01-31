import { Component, effect, inject, input, OnInit } from '@angular/core';
import { UsersAPI } from '../../services/users-api.service';

@Component({
  selector: 'app-user-page',
  imports: [],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss',
})
export class UserPage implements OnInit {
  id = input.required<string>();

  userService = inject(UsersAPI);

  user = this.userService.getByIdResponse;

  ngOnInit(): void {
    this.userService.querySetId(+this.id());
  }
}
