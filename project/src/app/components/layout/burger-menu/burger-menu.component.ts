import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import headerConfig from '@appSource/components/header/config.json'
import { UiService, NavigationService } from '@appSource/services';
import type { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BurgerMenuComponent implements OnDestroy {
  headerConfig = headerConfig;
  @Output() closeBurger = new EventEmitter<void>();

  constructor(
    private navigation: NavigationService,
    private ui: UiService
  ) { }

  navigationPoints$ = this.navigation.getComponentNavigationPoints('head');

  trackByFn = this.ui.trackByFn;

  startMenuSlug$ = this.navigation.startMenuSlug$;

  ngOnDestroy() {
    this.closeBurger.complete();
  }

  close() {
    this.closeBurger.emit();
  }

  isHttpLink(link: string): boolean {
    return this.navigation.isHttpLink(link)
  };

}
