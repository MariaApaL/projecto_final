import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CalendarPageRoutingModule } from './calendar-routing.module';
import { CalendarPage } from './calendar.page';




@NgModule({
  imports: [

   
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarPageRoutingModule,

  ],
  declarations: [CalendarPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CalendarPageModule {}
