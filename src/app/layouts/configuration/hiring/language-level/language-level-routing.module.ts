import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LanguageLevelComponent} from './language-level.component';

const routes: Routes = [{path: '', component: LanguageLevelComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LanguageLevelRoutingModule {
}
