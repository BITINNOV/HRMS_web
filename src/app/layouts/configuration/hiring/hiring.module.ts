import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HiringRoutingModule} from './hiring-routing.module';
import {HiringCycleTypeComponent} from './hiring-cycle-type/hiring-cycle-type.component';
import {PublicationLineStatusComponent} from './publication-line-status/publication-line-status.component';
import {PublicationTypeComponent} from './publication-type/publication-type.component';
import {NeedStatusComponent} from './need-status/need-status.component';
import {HiringTypeComponent} from './hiring-type/hiring-type.component';
import {ResumeTypeComponent} from './resume-type/resume-type.component';
import {DisabilityNatureComponent} from './disability-nature/disability-nature.component';
import {ResumeStatusComponent} from './resume-status/resume-status.component';
import {TrainingTypeComponent} from './training-type/training-type.component';
import {TrainingLevelComponent} from './training-level/training-level.component';
import {EstablishmentTypeComponent} from './establishment-type/establishment-type.component';
import {SkillAreaComponent} from './skill-area/skill-area.component';
import {LanguageLevelComponent} from './language-level/language-level.component';
import {PublicationStatusComponent} from './publication-status/publication-status.component';
import {HiringComponent} from './hiring.component';
import {SharedModule} from '../../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import { ContractTypeComponent } from './contract-type/contract-type.component';
import { HiringCycleComponent } from './hiring-cycle/hiring-cycle.component';
import { HiringPhaseComponent } from './hiring-phase/hiring-phase.component';
import { PublicationPlatformComponent } from './publication-platform/publication-platform.component';


@NgModule({
  declarations: [
    HiringComponent,
    HiringCycleTypeComponent,
    PublicationLineStatusComponent,
    PublicationTypeComponent,
    NeedStatusComponent,
    HiringTypeComponent,
    ResumeTypeComponent,
    DisabilityNatureComponent,
    ResumeStatusComponent,
    TrainingTypeComponent,
    TrainingLevelComponent,
    EstablishmentTypeComponent,
    SkillAreaComponent,
    LanguageLevelComponent,
    PublicationStatusComponent,
    ContractTypeComponent,
    HiringCycleComponent,
    HiringPhaseComponent,
    PublicationPlatformComponent
  ],
  imports: [
    HiringRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule
  ]
})
export class HiringModule {
}
