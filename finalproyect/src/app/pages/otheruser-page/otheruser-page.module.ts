import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtheruserPagePageRoutingModule } from './otheruser-page-routing.module';

import { OtheruserPagePage } from './otheruser-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtheruserPagePageRoutingModule
  ],
  declarations: [OtheruserPagePage]
})
export class OtheruserPagePageModule {}
