import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {  ModalController, NavController } from '@ionic/angular';

import { ReportModalComponent } from 'src/app/components/report-modal/report-modal.component';
import { AuthService } from 'src/app/services/auth.service';import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-otheruser-page',
  templateUrl: './otheruser-page.page.html',
  styleUrls: ['./otheruser-page.page.scss'],
})
export class OtheruserPagePage implements OnInit {
  
  
  isFavorite: boolean;
  userId = localStorage.getItem('userId');
  profileUserId:string;
  profileUser:any;
  eventCount: number = 0;
  createdEvents:any[]=[];
 
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,

    private navCtrl: NavController,
    private auth: AuthService,
    private modalCtrl: ModalController) {
    this.route.paramMap.subscribe(params => {
      this.profileUserId = params.get('id');
      //Ya tenemo el id de la URL guardado en una variable 
    });


  }


  ngOnInit() {
    
    this.getUserById(this.profileUserId);
    this.findEventsByAuthorId(this.profileUserId);
  } 
 
  
  // muestra eventos por autor
  getUserById(userId: any) {
  this.auth.getUserById(userId).subscribe({ 
    next: async (data) => {
      this.profileUser= await data;

    }
  });
}


findEventsByAuthorId(authorId: any) {
  this.eventService.findEventsByAuthorId(authorId).subscribe({
    next: async (data) => {
      this.createdEvents =  Object.values(data);
    
      this.createdEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ordenar los eventos por fecha
      console.log("refresco eventos")
      this.eventCount = this.createdEvents.length;
      
    }
  });
}



    //Navega a la página de información del evento
    selectEvent(id: string) {
      localStorage.removeItem('previousUrl');
      this.navCtrl.navigateForward(`/event-info/${id}`);
      localStorage.setItem('previousUrl', location.href);
    }

    


    goBack(){
      this.navCtrl.back();
    }
}
