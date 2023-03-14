import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PresentationPageRoutingModule } from './presentation-routing.module';

import { PresentationPage } from './presentation.page';
import { SwiperModule } from 'swiper/angular';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PresentationPageRoutingModule,
    SwiperModule,
    ComponentsModule
  

  ],
  declarations: [PresentationPage]
})
export class PresentationPageModule {}
