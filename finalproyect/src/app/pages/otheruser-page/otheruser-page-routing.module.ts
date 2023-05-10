import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtheruserPagePage } from './otheruser-page.page';

const routes: Routes = [
  {
    path: '',
    component: OtheruserPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtheruserPagePageRoutingModule {}
