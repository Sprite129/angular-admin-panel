import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { UsersAPI } from '../../services/users-api.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Status } from '../../model/statuses';
import { User } from '../../model/user';

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
    name: new FormControl('', { nonNullable: true }),
    dateOfBirth: new FormControl(new Date(), { nonNullable: true }),
    info: new FormControl('', { nonNullable: true }),
    status: new FormControl(Status.ACTIVE, { nonNullable: true }),
    debt: new FormControl(0, { nonNullable: true }),
    address: new FormControl('', { nonNullable: true }),
    contacts: new FormControl('', { nonNullable: true })
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
    if (!contacts)
      return;

    let message = "";

    contacts.forEach((string, index, array) => {
      if (index < array.length - 1)
        message += string + ", ";
      else
        message += string + ".";
    })
    return message;
  }

  enableEditing() {
    this.userForm.enable();
    this.isDisabled.set(false);
  }

  buildUser(): User {
    const dbData = this.user();

    if (!dbData) {
      throw new Error("User not loaded");
    }
    const formData = this.userForm.getRawValue();

    return {
      ...dbData,
      ...formData,
      contacts: this.contactsToArray(formData.contacts),
      info: [...dbData.info, formData.info]
    };
  }

  cancelEditing() {
    const dbData = this.user();

    if (!dbData) {
      return;
    }

    this.userForm.setValue({
      name: dbData.name,
      dateOfBirth: dbData.dateOfBirth,
      info: dbData.info.at(-1) ?? '',
      status: dbData.status,
      debt: dbData.debt,
      address: dbData.address,
      contacts: this.stringArraytoContacts(dbData.contacts) ?? '',
    });

    this.userForm.disable();
    this.isDisabled.set(true);
  }

  save() {
    const updatedUser = this.buildUser();
    this.userService.updateUserQuery(updatedUser);

    this.userForm.disable();
    this.isDisabled.set(true);
  }
}
