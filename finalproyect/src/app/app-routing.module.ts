import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'presentation', //REDIRECCIONA A 'HOME/INICIO'
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'presentation',
    loadChildren: () => import('./pages/presentation/presentation.module').then( m => m.PresentationPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'forgot-pass',
    loadChildren: () => import('./pages/forgot-pass/forgot-pass.module').then( m => m.ForgotPassPageModule)
  },
  {
    path: 'new-pass',
    loadChildren: () => import('./pages/new-pass/new-pass.module').then( m => m.NewPassPageModule)
  },
  {
    path: 'home-admin',
    loadChildren: () => import('./pages/home-admin/home-admin.module').then( m => m.HomeAdminPageModule),
    canActivate: [AuthGuard],
    
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./pages/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'edit-event/:id',
    loadChildren: () => import('./pages/edit-event/edit-event.module').then( m => m.EditEventPageModule)
  },
  {
    path: 'event-info/:id',
    loadChildren: () => import('./pages/event-info/event-info.module').then( m => m.EventInfoPageModule)
  },
  {
    path: 'otheruser-page/:id',
    loadChildren: () => import('./pages/otheruser-page/otheruser-page.module').then( m => m.OtheruserPagePageModule)
  }



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
