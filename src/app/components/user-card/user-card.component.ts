import { Component, input, signal } from '@angular/core';
import { User } from '../../model/user';
import { Status } from '../../model/statuses';
import { SlicePipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-user-card',
  imports: [SlicePipe, RouterLink],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCard {
  user = input<User | undefined>();
  
  getColor() {
    if (this.user()) {
      if (this.user()?.status == Status.ACTIVE) return "green";
      if (this.user()?.status == Status.EXPIRED) return "red";
    }
    return "orange";
  }
}
