import { NgModule } from '@angular/core';
import { ProductsComponent } from './products.component';
import { DishcardModule } from '@appSource/components/dishcard/dishcard.module';
import { ProductsRoutingModule } from './products-routing.module';
import { CartPanelModule } from '@appSource/components/cart-panel/cart-panel.module';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { ContactsModule } from '@appSource/components/contacts/contacts.module';
import { ReviewModule } from '@appSource/components/review/review.module';

@NgModule({
  declarations: [ProductsComponent],
  exports: [ProductsComponent],
  imports: [
    CommonModule,
    DishcardModule,
    ProductsRoutingModule,
    CartPanelModule,
    MatChipsModule,
    ContactsModule,
    ReviewModule
  ]
})
export class ProductsModule { }
