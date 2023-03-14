
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { SwiperComponent, SwiperModule } from 'swiper/angular';
import { BottomSheetModalComponent } from './bottom-sheet-modal/bottom-sheet-modal.component';

import { FormsModule } from '@angular/forms';
import { ErrorMessageComponent } from './error-message/error-message.component';





@NgModule({
  declarations: [
    HeaderComponent,
    BottomSheetModalComponent,
    ErrorMessageComponent
  



  
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SwiperModule
    
  ],
  exports:[
    HeaderComponent, 
    BottomSheetModalComponent,
    ErrorMessageComponent

  ]
})
export class ComponentsModule { }
