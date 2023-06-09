import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { HomePage } from './home.page';

const routes: Routes = [
  
    {
      path:'',
      redirectTo:'', //Esto hace que cada vez que vayamos a HOME, no muestre INICIO por defecto
      pathMatch:'full',
      
      
    },
    {
      path: '',
      component: HomePage,
      

      children: [ //Definimo sla rutas hijas, donde irá las trés páginas principales del Inicio (Tabs)
      {
        path: 'user-page',
        loadChildren: () => import('./user-page/user-page.module').then( m => m.UserPagePageModule),
        
      },
      {
        path:'main',
        loadChildren:()=> import('./main/main.module').then(m => m.MainPageModule),
        data: { noCache: true } //Para que no se guarde en caché
        
        
      },
      {
        path: 'add-new',
        loadChildren: () => import('./add-new/add-new.module').then( m => m.AddNewPageModule),
        
      },
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule),
        
      },
      {
        path: 'calendar',
        loadChildren: () => import('./calendar/calendar.module').then( m => m.CalendarPageModule)
      }
        
    ]
  },

  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
