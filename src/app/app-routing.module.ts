import { AuthGuard } from './shared/guards/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./layouts/layout.module').then(m => m.LayoutModule) },
  { path: 'core', loadChildren: () => import('./layouts/layout.module').then(m => m.LayoutModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'not-found', loadChildren: () => import('./error-404/error-404.module').then(m => m.Error404Module) },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full'  },

];

@NgModule({
  declarations: [

  ],
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true, relativeLinkResolution: 'legacy' })
  ],
  exports: [
    RouterModule,
  ]
})

export class AppRoutingModule { }
