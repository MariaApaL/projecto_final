import { DatePipe } from '@angular/common';
import { AbstractType, Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import * as moment from 'moment';
import { CreateEventModalComponent } from 'src/app/components/create-event-modal/create-event-modal.component';

import { EventService } from 'src/app/services/event.service';

declare let google: any;

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.page.html',
  styleUrls: ['./add-new.page.scss'],
})

export class AddNewPage implements OnInit {

  


  ngOnInit() {
  

  }


  constructor(
  
    public modalCtrl: ModalController
  ) {
    
  }

  openEventModal(){
    this.modalCtrl.create({
      component: CreateEventModalComponent,
      cssClass: 'event-modal'
    }).then(modalEl => {
      modalEl.present();
    });
  }
 




}







