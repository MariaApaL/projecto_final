import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';

import { MainPage } from './main.page';
import { ComponentsModule } from "../../../components/components.module";
import { SwiperModule } from 'swiper/angular';

@NgModule({
    declarations: [MainPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MainPageRoutingModule,
        ComponentsModule,
        SwiperModule
    ]
})
export class MainPageModule {}
