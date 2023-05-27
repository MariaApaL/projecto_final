
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { BottomSheetModalComponent } from './bottom-sheet-modal/bottom-sheet-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { PrivacyModalComponent } from './privacy-modal/privacy-modal.component';
import { CreateEventModalComponent } from './create-event-modal/create-event-modal.component';
import { EventCardComponent } from './event-card/event-card.component';
import { EventMapComponent } from './event-map/event-map.component';
import { ParticipantsListComponent } from './participants-list/participants-list.component';
import { CommentsModalComponent } from './comments-modal/comments-modal.component';
import { ReportModalComponent } from './report-modal/report-modal.component';
import { ReportUserModalComponent } from './report-user-modal/report-user-modal.component';
import { PoliticsComponent } from './politics/politics.component';
import { SuccessComponent } from './success/success.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeUserComponent } from './change-user/change-user.component';
import { ChangeEmailComponent } from './change-email/change-email.component';









@NgModule({
  declarations: [
    PrivacyModalComponent,
    BottomSheetModalComponent,
    ErrorMessageComponent,
    CreateEventModalComponent,
    EventCardComponent,
    EventMapComponent,
    ParticipantsListComponent,
    CommentsModalComponent,
    ReportModalComponent,
    ReportUserModalComponent,
    PoliticsComponent,
    SuccessComponent,
    ChangePasswordComponent,
    ChangeUserComponent,
    ChangeEmailComponent
   
  
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
    EventCardComponent,
    EventMapComponent,
    ParticipantsListComponent,
    ReportUserModalComponent,
    CommentsModalComponent,
    ReportModalComponent,
    PoliticsComponent,
    SuccessComponent,
    ChangePasswordComponent,
    ChangeUserComponent,
    ChangeEmailComponent
 

    
   
   
    

  ]
})
export class ComponentsModule { }
