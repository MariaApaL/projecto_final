import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';

import { MainPage } from './main.page';
import { ComponentsModule } from "../../../components/components.module";


@NgModule({
    declarations: [MainPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MainPageRoutingModule,

    
 
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainPageModule {}
