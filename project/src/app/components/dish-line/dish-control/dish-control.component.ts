import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ConfigurableComponent } from '@appSource/models/models';
import { CartService } from '@appSource/services';
import config from '../config.json';
import type { OnDestroy } from '@angular/core';
import { map, } from 'rxjs/operators';
import type { BehaviorSubject } from 'rxjs';
import type { FormGroup } from '@angular/forms';
import { isValue } from '@webresto/ng-gql';

@Component({
  selector: 'app-dish-control',
  templateUrl: './dish-control.component.html',
  styleUrls: [ './dish-control.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DishControlComponent extends ConfigurableComponent implements OnDestroy {

  constructor(
    private cartService: CartService,
  ) {
    super();
  }

  @Input() dish!: IDish | undefined;
  @Input() modifierForm?: FormGroup | undefined;
  @Input() amount: number | undefined;
  @Input() cartDish: IOrderDish | undefined;

  /* for use it in cart-components **/
  @Input() panelMode: boolean = false;

  /* for use in dishcard/dish-modal components */
  @Input() isLoading: BehaviorSubject<boolean> | undefined;
  @Output() editModifier = new EventEmitter<number>();
  @Output() openDishModal = new EventEmitter<void>();

  config = config;
  order$ = this.cartService.order$;
  dishInorder$ = this.cartService.order$.pipe(
    map(
      cart => isValue(cart) ? this.cartService.getCartDish(cart, this.dish!, this.cartDish?.id) ?? [] : null
    )
  );

  addToCart() {
    if (this.modifierForm) {
      this.editModifier.emit(+this.modifierForm.controls.amount.value + 1);
    } else {
      if (this.dish?.modifiers && this.dish?.modifiers.length > 0) {
        this.openDishModal.emit();
      } else {
        this.cartService.addToCart(this.isLoading!, this.dish!);
      };
    }
  }

  removeFromCart() {
    if (this.modifierForm) {
      const amount: number = +this.modifierForm.controls.amount.value;
      this.editModifier.emit(amount < 2 ? 0 : amount - 1);
    } else {
      this.cartService.removeFromCart(this.isLoading!, this.dish!, undefined);
    }
  }

  get dishTotalPrice(): number {
    const modifiers: Array<IModifier | IOrderModifier> = (this.cartDish ? this.cartDish.modifiers : this.selectedModifiers);
    return this.dish ? this.dish.price + modifiers.reduce<number>(
      (accumulator: number, current: IModifier | IOrderModifier) => {
        accumulator += current.dish.price * (current.amount ?? 0);
        return accumulator;
      }, 0) : 0;
  }

  get classForControl() {
    let cssClass = 'product__nav';
    if (config.buttonContent !== 'icon') {
      cssClass += config.buttonPosition == 'right' ?
        ` flex-end` :
        config.buttonPosition == 'center' ?
          ' center' :
          ' flex-start';
    }
    if (this.modifierForm) {
      cssClass += ' reverse';
    }
    if (this.panelMode) {
      cssClass += " dark-theme";
    }
    return cssClass;
  }

  get selectedModifiers(): IModifier[] {
    return this.dish?.modifiers?.reduce(
      (accumulator: IModifier[], current: IGroupModifier) => {
        accumulator.push(...current.childModifiers.filter(
          child => child.amount && child.amount > 0
        ));
        return accumulator;
      }, []
    ) || [];
  }

  get diffPrice(): number {
    if (this.dish) {
      if (this.dish.modifiers && this.dish.modifiers.length > 0) {
        return this.dish.price + this.dish.modifiers.filter(
          modifier => modifier.minAmount > 0
        ).reduce(
          (accumulator, current) => {
            const minimalChildPrice = current.childModifiers ? current.childModifiers.reduce(
              (accumulatorChild, currentChild) => currentChild.dish.price < accumulatorChild ? currentChild.dish.price : accumulatorChild
              , current.childModifiers[ 0 ]?.dish?.price ?? 0
            ) : 0;
            return accumulator + (current.minAmount * minimalChildPrice);
          }, 0
        );
      } else {
        return this.dish.price;
      }
    } else {
      return 0;
    }
  }

  getDishInCartAmount(dishInCart: IOrderDish[]) {
    return this.amount !== undefined ? this.amount : this.modifierForm ? this.modifierForm.value.amount : dishInCart.reduce((accumulator, current) => {
      accumulator += current.amount;
      return accumulator;
    }, 0);
  }

  ngOnDestroy() {
    this.editModifier.complete();
    this.openDishModal.complete();
    this.isLoading?.complete();
  }

}
