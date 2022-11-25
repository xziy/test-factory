import { Component, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';
import type {OnDestroy } from '@angular/core';

@Component({
  selector: 'app-show-cookie',
  templateUrl: './show-cookie.component.html',
  styleUrls: ['./show-cookie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowCookieComponent implements OnDestroy {
  @Output() close = new EventEmitter<boolean>();
  @Input() textAboutCookie: string = '';
  
  constructor() { }

  closeInfo() {
    this.close.emit(false);
  }

  ngOnDestroy() {
    this.close.complete();
  }

}
