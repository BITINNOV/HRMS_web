import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DocumentTypeRoutingModule} from './document-type-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DocumentTypeRoutingModule,
    SharedModule
  ]
})
export class DocumentTypeModule {
}
