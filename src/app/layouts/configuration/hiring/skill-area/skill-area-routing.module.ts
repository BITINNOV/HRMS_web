import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SkillAreaComponent} from './skill-area.component';

const routes: Routes = [{path: '', component: SkillAreaComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillAreaRoutingModule {
}
