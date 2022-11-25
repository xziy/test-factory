import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UiService } from '@appSource/services';
import { switchMap, filter, map, shareReplay } from 'rxjs/operators';
import { StocksService } from '../stocks.service';
import type { IStock } from '../stocks.service';

type StockForView = {
  srcIndicator: keyof Slide;
  stock: IStock;
}


@Component({
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockPageComponent {

  constructor(private ui: UiService, private stocks: StocksService) { }

  stock$ = this.ui.locationPathName$.pipe(
    switchMap(
      url => this.stocks.getStockOnMnemonicId(this.ui.getLastParamFromUrl(url))
    ),
    filter((stock): stock is IStock => !!stock),
    switchMap(
      stock => this.ui.viewport$.pipe(
        map(
          viewport => <StockForView>({
            srcIndicator: viewport.innerWidth > 1140 ? 'url@2x' : viewport.innerWidth > 320 ? 'url' : 'url@0_5x',
            stock
          })
        )
      )
    ),
    shareReplay(1)
  );

}
