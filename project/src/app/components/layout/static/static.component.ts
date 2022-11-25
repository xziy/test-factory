import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UiService } from '@appSource/services';
import { switchMap, shareReplay, map } from 'rxjs';

@Component({
  selector: 'app-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaticComponent {

  constructor(private ui: UiService, private sanitizer: DomSanitizer) { }

  pageContent$ = this.ui.locationPathName$.pipe(
    switchMap(
      url => this.ui.customQuery<{ content: string }, 'pages', {
        criteria: {
          slug: string | undefined
        }
      }>('pages', {
        content: true
      }, {
        criteria: {
          slug: this.ui.getLastParamFromUrl(url)
        }
      })
    ),
    map(v => this.sanitizer.bypassSecurityTrustHtml(v[0].content)),
    shareReplay(1)
  );

}
