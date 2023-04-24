import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule, ModalController } from '@ionic/angular';

import { AddNewPageRoutingModule } from './add-new-routing.module';

import { AddNewPage } from './add-new.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddNewPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    HttpClientModule 
  ],
  declarations: [AddNewPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddNewPageModule {}
