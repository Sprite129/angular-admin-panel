import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationMessage } from './confirmation-message.component';

describe('ConfirmationMessage', () => {
  let component: ConfirmationMessage;
  let fixture: ComponentFixture<ConfirmationMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationMessage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationMessage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
