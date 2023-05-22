import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';

import { MainPage } from './main.page';

import { FilterpipePipe } from 'src/app/pipes/filterpipe.pipe';


@NgModule({
    declarations: [MainPage, FilterpipePipe],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MainPageRoutingModule,
       

    
 
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainPageModule {}
