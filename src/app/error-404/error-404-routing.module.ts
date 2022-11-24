import { Error404Component } from './error-404.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: Error404Component }
];

@NgModule({
  declarations: [

  ],
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
  ]
})

export class AppError404RoutingModule { }
