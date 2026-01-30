import { Component, effect, inject, signal } from '@angular/core';
import { Status } from '../../model/statuses';
import { UserCard } from "../user-card/user-card.component";
import { UsersAPI } from '../../services/users-api.service';

@Component({
  selector: 'app-main-page',
  imports: [UserCard],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPage {
  exampleUser = signal({
  id: 1,
  name: "John Doe",
  dateOfBirth: new Date("1990-05-15"),
  info: ["Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis eius, fugiat veritatis nesciunt mollitia odio temporibus corporis nostrum consequatur? Quas.", "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque ducimus dolorem rerum soluta ad quis beatae iure distinctio repellat sed maxime harum maiores delectus labore, repudiandae id adipisci? Expedita, aut."],
  status: Status.ACTIVE,
  debt: 0,
  address: "123 Main St, Springfield",
  contacts: ["john.doe@example.com", "+1-555-1234"]
});

  private userService = inject(UsersAPI);

  // testing the api
  users = this.userService.getUserPage(1);

  // testing custom name getter (Will be needed for search)
  // users = this.userService.getByName("John", 1);
  
  // These will be needed for sorting
  // users = this.userService.getUserPageToLowDebt(1);
  // users = this.userService.getUserPageToHighDebt(1);

  constructor() {
    effect(() => {
      console.log(this.users());
    })
  }
}
