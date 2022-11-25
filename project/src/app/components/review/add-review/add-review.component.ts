import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UiService } from '@appSource/services';
import type { AfterViewInit } from '@angular/core';
import type { FormGroup } from '@angular/forms';

@Component({
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddReviewComponent implements AfterViewInit {

  constructor(
    private dialogRef: MatDialogRef<AddReviewComponent, any>,
    private ui: UiService,
    @Inject(MAT_DIALOG_DATA) public form: FormGroup
  ) { };

  ngAfterViewInit() {
    const element = document.getElementById(this.dialogRef.id);
    const host = element?.firstElementChild;
    if (element && host) {
      element.style.borderRadius = getComputedStyle(host).borderRadius;
    };
  }

  dateMax = this.ui.formatDate(Date.now(), 'yyyy-MM-dd', 'en');

  setRate(star: number) {
    this.form.controls.rate.setValue(star + 1);
  }

  trackByFn = this.ui.trackByFn

}
