
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SwiperComponent, SwiperModule } from 'swiper/angular';
import { BottomSheetModalComponent } from './bottom-sheet-modal/bottom-sheet-modal.component';
import { FormsModule } from '@angular/forms';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { PrivacyModalComponent } from './privacy-modal/privacy-modal.component';
import { EditModalComponent } from './edit-modal/edit-modal.component';







@NgModule({
  declarations: [
    PrivacyModalComponent,
    BottomSheetModalComponent,
    ErrorMessageComponent,
    EditModalComponent
   
    

  
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SwiperModule,
   
    
  ],
  exports:[
   
    BottomSheetModalComponent,
    ErrorMessageComponent,
    PrivacyModalComponent,
    EditModalComponent
   
    

  ]
})
export class ComponentsModule { }
