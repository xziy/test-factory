import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-contacts-item',
  templateUrl: './contacts-item.component.html',
  styleUrls: ['../contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsItemComponent {
  @Input() item: ContactsItemData | undefined;
  constructor() { }

}
