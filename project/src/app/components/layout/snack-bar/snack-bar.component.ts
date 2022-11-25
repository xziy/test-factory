import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { UiService } from '@appSource/services';
import type { UiSnackBar } from '@appSource/services';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnackBarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: UiSnackBar, private ui: UiService) { }

  trackByFn = this.ui.trackByFn;

  get messageParagraph(): string[] {
    return this.data.message.split('\n');
  }

}

