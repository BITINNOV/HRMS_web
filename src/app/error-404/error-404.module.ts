import { AppError404RoutingModule } from './error-404-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404Component } from './error-404.component';


@NgModule({
  declarations: [Error404Component],
  imports: [
    CommonModule, AppError404RoutingModule
  ]
})
export class Error404Module { }
