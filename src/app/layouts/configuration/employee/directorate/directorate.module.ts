import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DirectorateRoutingModule} from './directorate-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DirectorateRoutingModule,
    SharedModule
  ]
})
export class DirectorateModule {
}
