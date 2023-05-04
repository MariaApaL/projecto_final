
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { BottomSheetModalComponent } from './bottom-sheet-modal/bottom-sheet-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { PrivacyModalComponent } from './privacy-modal/privacy-modal.component';
import { CreateEventModalComponent } from './create-event-modal/create-event-modal.component';
import { EventCardComponent } from './event-card/event-card.component';








@NgModule({
  declarations: [
    PrivacyModalComponent,
    BottomSheetModalComponent,
    ErrorMessageComponent,
    CreateEventModalComponent,
    EventCardComponent


   
    

  
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
 
    ReactiveFormsModule
   
    
  ],
  exports:[
   
    BottomSheetModalComponent,
    ErrorMessageComponent,
    PrivacyModalComponent,
    CreateEventModalComponent,
    EventCardComponent
    
   
   
    

  ]
})
export class ComponentsModule { }
