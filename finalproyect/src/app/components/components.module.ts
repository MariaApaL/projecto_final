
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SwiperComponent, SwiperModule } from 'swiper/angular';
import { BottomSheetModalComponent } from './bottom-sheet-modal/bottom-sheet-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { PrivacyModalComponent } from './privacy-modal/privacy-modal.component';
import { CreateEventModalComponent } from './create-event-modal/create-event-modal.component';








@NgModule({
  declarations: [
    PrivacyModalComponent,
    BottomSheetModalComponent,
    ErrorMessageComponent,
    CreateEventModalComponent


   
    

  
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SwiperModule,
    ReactiveFormsModule
   
    
  ],
  exports:[
   
    BottomSheetModalComponent,
    ErrorMessageComponent,
    PrivacyModalComponent,
    CreateEventModalComponent
    
   
   
    

  ]
})
export class ComponentsModule { }
