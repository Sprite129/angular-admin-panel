import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserCard } from "./components/user-card/user-card.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserCard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-admin-panel');
}
