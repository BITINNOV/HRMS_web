import { Error500Component } from './error-500.component';
import { NgModule } from '@angular/core';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [Error500Component],
    imports: [
        SharedModule

    ],

})
export class Error500Module { }
