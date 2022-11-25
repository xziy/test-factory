import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { isValue } from '@webresto/ng-gql';

@Component({
  selector: 'app-calories-info',
  templateUrl: './calories-info.component.html',
  styleUrls: [ './calories-info.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaloriesInfoComponent {
  @Input() dish!: IDish;
  constructor() { }

  checkExists(value: any): boolean {
    return isValue(value);
  }

}
