import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {  ModalController, NavController } from '@ionic/angular';

import { ReportModalComponent } from 'src/app/components/report-modal/report-modal.component';
import { EventsInterface } from 'src/app/interfaces/event';
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
  createdEvents:EventsInterface[]=[];
  value:any;
  displayedEvents: EventsInterface[] = [];
  events:EventsInterface[]=[] // Eventos que se muestran actualmente en la página
 
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
    this.getValorations(this.profileUserId);
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
      this.events = this.createdEvents
    
      this.createdEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ordenar los eventos por fecha
      console.log("refresco eventos")
      this.eventCount = this.createdEvents.length;
      this.displayedEvents = this.events.slice(0, 5);
      
    }
  });
}



    //Navega a la página de información del evento
    selectEvent(id: string) {
      localStorage.removeItem('previousUrl');
      this.navCtrl.navigateForward(`/event-info/${id}`);
      localStorage.setItem('previousUrl', location.href);
    }

    loadMoreEvents(event: any) {
      // Simula una carga asincrónica con un retraso de 1 segundo
      setTimeout(() => {
        const startIndex = this.displayedEvents.length;
        const endIndex = startIndex + 5;
        console.log("0",endIndex);
    
        
          const moreEvents = this.events.slice(startIndex, endIndex);
          console.log("1", moreEvents);
          this.displayedEvents = this.displayedEvents.concat(moreEvents);
          console.log("2", this.displayedEvents);
    
          event.target.complete();
    
        
        
      }, 1000);
    }
     
    openConver(){
      this.navCtrl.navigateForward(`/chat/${this.profileUserId}`);
    }


    goBack(){
      this.navCtrl.back();
    }

    async getValorations(userId:string){
      this.auth.getValuationsByAuthor(userId).subscribe({
        next: async (data) => {
          const valuations = await data;
          
          const values = valuations.valuations; // Acceder al array de valores
          const valuesArray = values.map(valuation => valuation.value); // Obtener un nuevo array con los valores de "value"
          
          const sum = valuesArray.reduce((total, value) => total + value, 0); // Sumar los valores
          const average = valuesArray.length > 0 ? sum / valuesArray.length : 0; // Calcular el promedio o establecerlo como 0 si el array está vacío
          
          console.log("Valores:", valuesArray);
          console.log("Suma:", sum);
          this.value= isNaN(average) ? 0 : average.toFixed(1)// Verificar si el promedio es NaN y mostrar 0 en su lugar
        }
      });
    }
}
