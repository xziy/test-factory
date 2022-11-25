import { NgModule } from '@angular/core';
import {  RouterModule } from '@angular/router';
import type { Routes } from '@angular/router';
import { StaticComponent } from './static.component';

const routes: Routes = [{ path: ':id', component: StaticComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticRoutingModule { }
