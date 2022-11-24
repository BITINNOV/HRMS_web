import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HiringComponent} from './hiring.component';

const routes: Routes = [
  {
    path: '',
    component: HiringComponent,
    children: [
      {path: 'skillarea', loadChildren: () => import('./skill-area/skill-area.module').then(m => m.SkillAreaModule)},
      {path: 'hiringtype', loadChildren: () => import('./hiring-type/hiring-type.module').then(m => m.HiringTypeModule)},
      {path: 'resumetype', loadChildren: () => import('./resume-type/resume-type.module').then(m => m.ResumeTypeModule)},
      {path: 'needstatus', loadChildren: () => import('./need-status/need-status.module').then(m => m.NeedStatusModule)},
      {path: 'hiringcycle', loadChildren: () => import('./hiring-cycle/hiring-cycle.module').then(m => m.HiringCycleModule)},
      {path: 'hiringphase', loadChildren: () => import('./hiring-phase/hiring-phase.module').then(m => m.HiringPhaseModule)},
      {path: 'resumestatus', loadChildren: () => import('./resume-status/resume-status.module').then(m => m.ResumeStatusModule)},
      {path: 'trainingtype', loadChildren: () => import('./training-type/training-type.module').then(m => m.TrainingTypeModule)},
      {path: 'contracttype', loadChildren: () => import('./contract-type/contract-type.module').then(m => m.ContractTypeModule)},
      {path: 'languagelevel', loadChildren: () => import('./language-level/language-level.module').then(m => m.LanguageLevelModule)},
      {path: 'traininglevel', loadChildren: () => import('./training-level/training-level.module').then(m => m.TrainingLevelModule)},
      // tslint:disable-next-line:max-line-length
      {
        path: 'publicationtype',
        loadChildren: () => import('./publication-type/publication-type.module').then(m => m.PublicationTypeModule)
      },
      // tslint:disable-next-line:max-line-length
      {
        path: 'hiringcycletype',
        loadChildren: () => import('./hiring-cycle-type/hiring-cycle-type.module').then(m => m.HiringCycleTypeModule)
      },
      // tslint:disable-next-line:max-line-length
      {
        path: 'disabilitynature',
        loadChildren: () => import('./disability-nature/disability-nature.module').then(m => m.DisabilityNatureModule)
      },
      // tslint:disable-next-line:max-line-length
      {
        path: 'publicationstatus',
        loadChildren: () => import('./publication-status/publication-status.module').then(m => m.PublicationStatusModule)
      },
      // tslint:disable-next-line:max-line-length
      {
        path: 'establishmenttype',
        loadChildren: () => import('./establishment-type/establishment-type.module').then(m => m.EstablishmentTypeModule)
      },
      // tslint:disable-next-line:max-line-length
      {
        path: 'publicationlinestatus',
        loadChildren: () => import('./publication-line-status/publication-line-status.module').then(m => m.PublicationLineStatusModule)
      },
      // tslint:disable-next-line:max-line-length
      {
        path: 'publicationplatform',
        loadChildren: () => import('./publication-platform/publication-platform.module').then(m => m.PublicationPlatformModule)
      },
    ],
  }];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class HiringRoutingModule {
}
