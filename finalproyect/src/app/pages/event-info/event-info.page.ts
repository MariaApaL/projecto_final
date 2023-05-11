import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController} from '@ionic/angular';
import { EventService } from 'src/app/services/event.service';


import { AuthService } from 'src/app/services/auth.service';
import { EventMapComponent } from 'src/app/components/event-map/event-map.component';
import { Observable } from 'rxjs';
import { ParticipantsListComponent } from 'src/app/components/participants-list/participants-list.component';
import { CommentsModalComponent } from 'src/app/components/comments-modal/comments-modal.component';
import { ReportModalComponent } from 'src/app/components/report-modal/report-modal.component';
import { EventsInterface } from 'src/app/interfaces/event';
declare let google: any;

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.page.html',
  styleUrls: ['./event-info.page.scss'],
})
export class EventInfoPage implements OnInit {

  eventId: string;
  event: EventsInterface;
  isFavorite: boolean;
  participants: any;
  isJoined = false;
  eventName: string;
  eventAuthor: string;
  userAuthor: any;
  isFull: boolean;
  userId = localStorage.getItem('userId');
  location: string;
 
  favorites: any[] = [];  

  fav: any;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,

    private navCtrl: NavController,
    private auth: AuthService,
    private modalCtrl: ModalController) {
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('id');
      //Ya tenemo el id de la URL guardado en una variable 
    });





  }



  ngOnInit() {
    this.getEvent();



  }


  ionViewDidEnter() {
    this.getEvent();
 
    // this.getUserEvent(this.eventAuthor);
   



  }
  //llama al servicio para obtener los eventos
  async getEvent() {
    this.eventService.getEvent(this.eventId).subscribe({
      next: async (data) => {
        this.event = await data;
        console.log(this.event)
   // actualiza el número de participantes
        this.participants = this.event.plazas.length;
        // console.log("get", this.event.plazas.length);
        // Comprueba si el usuario está en la lista de participantes
        
        const plazas = this.event.plazas?.find((plaza: any) => plaza == this.userId);
        // Si el usuario está en la lista de participantes, cambia el estado del botón de unirse
        if (plazas) {
          this.isJoined = true;
        }else{
          this.isJoined = false;
        }
        
        
        this.getUserEvent(this.event.author).subscribe({
          next: async (data) => {
            this.userAuthor = await data;
          }
        }); 
        
        this.eventName = this.capitalizeWords(this.event.name);
        this.isFavorite = localStorage.getItem(`favorite_${this.eventId}`) === 'true';
        this.checkParticipants();

        return this.event;
      }
    });
  }

  getUserEvent(eventAuthor: string): Observable<any> {
    return this.auth.getUserById(eventAuthor);
  }
  

  capitalizeWords(eventName: string) {
    return eventName.replace(/\b\w/g, l => l.toUpperCase());
  }


  navigateBack() {

    this.navCtrl.back();
  }

  addFavorite() {
    if (this.isFavorite) {
      this.deleteFavorite(this.eventId);
    } else {
      this.setFavoriteEvent(this.eventId);
    }
    this.isFavorite = !this.isFavorite;
    // localStorage.setItem(`favorite_${this.eventId}`, JSON.stringify(this.isFavorite));
  }


  //llama al servicio para añadir un evento a favoritos
  setFavoriteEvent(eventId: any) {
    this.auth.setFavorite(this.userId, eventId).subscribe({
      next: async (data) => {
        console.log(data);
        
      },
      error: async (err) => {
        console.log(err);
      }
    });
  }

  //Llama al servicio para eleminar los favoritos
  deleteFavorite(eventId: any) {
    this.auth.deleteFavorite(this.userId, eventId).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  //Abre el modal de participantes
 async openParticipants() {
    const modal = await this.modalCtrl.create({
      component: ParticipantsListComponent,
      componentProps: {
        eventId: this.eventId
      },
    });
    await modal.present();

  }
  
  
  async joinOrLeaveEvent() {
    if (this.isJoined) {
      this.leaveEvent();
      console.log("leave:", this.participants);
    } else {
      this.joinEvent();
      console.log("join:", this.participants);
    }
    this.isJoined = !this.isJoined;
    
    // Si el número de participantes ha llegado al máximo y no se ha unido aún, desactiva el botón de unirse
    this.checkParticipants();
  }


  checkParticipants() {
    if (this.participants == this.event.numPlazas && !this.isJoined) {
      this.isFull = true;
    } else {
      this.isFull = false;
    }
  }
  

  joinEvent() {
    this.eventService.addParticipant(this.eventId, this.userId).subscribe({
      next: async (data) => {
        const event : EventsInterface = await data.event;
          
          this.participants = event.plazas.length;
          console.log("Data", data);
          console.log("Plazas", event.plazas.length);
          this.checkParticipants(); 
         // Actualiza si el evento está lleno o no
        // }
      }
    });
  }
  
  leaveEvent() {
    this.eventService.deleteParticipant(this.eventId, this.userId).subscribe({
      next: async (data) => {
        const event:EventsInterface = await data.event;
        console.log('ELIMINAR',data);
        // if (data.plazas) {
          this.participants = event.plazas.length;
          console.log("Data", data);
          console.log("Plazas", event.plazas.length);
        
          this.checkParticipants();
         // Actualiza si el evento está lleno o no
        // }
      }
    });
  }


  goToProfile() {
    if(this.event.author == this.userId){
    this.navCtrl.navigateForward(`/home/user-page`);
    }else{
      this.navCtrl.navigateForward(`/otheruser-page/${this.event.author}`);
    }
  }


  
//Abre el modal de denuncias
 async openReportModal(){
  const modal = await this.modalCtrl.create({
    component: ReportModalComponent,
  
    breakpoints: [0, 0.5, 1],
    initialBreakpoint: 1,
    handleBehavior: 'none'
    
  });
  await modal.present();
 }

//Abre el modal del mapa
  async openLocation() {
    const modal = await this.modalCtrl.create({
      component: EventMapComponent,
      componentProps: {
        location: this.event.location
      },
    });
    await modal.present();

  }

  //Abre el modal de comentarios
 async openComments(){
  const modal = await this.modalCtrl.create({
    component: CommentsModalComponent,
    componentProps: {
      eventId: this.eventId
    },
  });
  await modal.present();

  }


//Llama al servicio para obtener los favoritos
  getFavorites() {
    this.auth.getFavorites(this.userId).subscribe({
      next: async (data) => {
        this.favorites = Object.values(data);
        console.log(this.favorites);

      },
      error: async (err) => {
        console.log(err);
      }
    });

}












}