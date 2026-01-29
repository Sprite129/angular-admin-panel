import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserCard } from "./components/user-card/user-card.component";
import { Status } from './model/statuses';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserCard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-admin-panel');

  exampleUser = signal({
  id: 1,
  name: "John Doe",
  dateOfBirth: new Date("1990-05-15"),
  info: ["Verified", "Premium member"],
  status: Status.ACTIVE,
  debt: 0,
  address: "123 Main St, Springfield",
  contacts: ["john.doe@example.com", "+1-555-1234"]
});
}
