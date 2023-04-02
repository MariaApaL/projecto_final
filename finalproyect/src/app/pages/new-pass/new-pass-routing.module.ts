import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewPassPage } from './new-pass.page';

const routes: Routes = [
  {
    path: '',
    component: NewPassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewPassPageRoutingModule {}
