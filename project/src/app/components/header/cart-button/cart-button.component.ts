import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-cart-button',
  templateUrl: './cart-button.component.html',
  styleUrls: ['./cart-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartButtonComponent {

  constructor() { }
@Input() cart:ICart |null = null;

}
