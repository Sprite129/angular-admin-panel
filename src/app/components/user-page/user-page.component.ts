import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { UsersAPI } from '../../services/users-api.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Status } from '../../model/statuses';

@Component({
  selector: 'app-user-page',
  imports: [ReactiveFormsModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss',
})
export class UserPage implements OnInit {
  id = input<number>(0);
  isDisabled = signal<boolean>(false);

  userService = inject(UsersAPI);

  user = this.userService.getByIdResponse;

  Status = Status;
  statusValues = Object.values(Status) as Status[];

  userForm = new FormGroup({
    name: new FormControl(''),
    dateOfBirth: new FormControl(new Date()),
    info: new FormControl(''),
    status: new FormControl(Status.ACTIVE),
    debt: new FormControl(0),
    address: new FormControl(''),
    contacts: new FormControl('')
  })

  constructor() {
    effect(() => {
      if (this.id() != 0) {
        this.isDisabled.set(true);
        this.userForm.disable()
      }
    });

    effect(() => {
      if (this.user())
        this.userForm.setValue({
          name: this.user()?.name ?? "",
          dateOfBirth: this.user()?.dateOfBirth ?? new Date(),
          info: this.user()?.info.at(-1) ?? "",
          status: this.user()?.status ?? Status.ACTIVE,
          debt: this.user()?.debt ?? 0,
          address: this.user()?.address ?? "",
          contacts: this.stringArraytoContacts(this.user()?.contacts) ?? ""
        });
    });
  }

  ngOnInit(): void {
    this.userService.querySetId(this.id());
  }

  contactsToArray(contacts: string) {
    return contacts.split(", ");
  }

  stringArraytoContacts(contacts: string[] | undefined) {
    if(!contacts)
      return;

    let message = "";

    contacts.forEach((string, index, array) => {
      if(index < array.length - 1)
        message += string + ", ";
      else
        message += string + ".";
    })
    console.log(message);
    return message;
  }

  enableEditing() {
    this.userForm.enable();
  }
}
