import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IrComponent} from './ir.component';

const routes: Routes = [{path: '', component: IrComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IrRoutingModule {
}
