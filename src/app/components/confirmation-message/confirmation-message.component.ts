import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirmation-message',
  imports: [],
  templateUrl: './confirmation-message.component.html',
  styleUrl: './confirmation-message.component.scss',
})
export class ConfirmationMessage {
  message = input("No message");
  isShown = input(false);
  confirm = output<boolean>();
}
