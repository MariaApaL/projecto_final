
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PresentationPageRoutingModule } from './presentation-routing.module';

import { PresentationPage } from './presentation.page';

import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [PresentationPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PresentationPageRoutingModule,

  

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
  
})
export class PresentationPageModule {}
