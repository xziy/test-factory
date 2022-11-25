import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { UiService } from '@appSource/services';
import type { Feedback } from '../review.component';

@Component({
  selector: 'app-review-item',
  templateUrl: './review-item.component.html',
  styleUrls: ['./review-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewItemComponent {

  @Input() item!: Feedback;
  @Input() singleReview: boolean = false;

  constructor(private ui: UiService) { }
  trackByFn = this.ui.trackByFn
}
