import { Component, OnInit } from '@angular/core';
import { AlertController, InfiniteScrollCustomEvent, ModalController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { BottomSheetModalComponent } from 'src/app/components/bottom-sheet-modal/bottom-sheet-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';

import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { EventsInterface } from 'src/app/interfaces/event';



@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.page.html',
  styleUrls: ['./user-page.page.scss'],
})
export class UserPagePage implements OnInit {
//Recojo la info del usuario
  currentUser: any = {};

  //para cambiar de segmento
  selectedSegment = 'my-favs';
//Recoger el numero de eventos creados
  eventCount: number = 0;

//recoger los eventos del usuario
  myEvents:EventsInterface[] = []
  //Recoger los eventos en los que participa el usuario
  joinedEvents:EventsInterface[] = []
  //Recoger los favoritos del usuario
  myFavs:EventsInterface[] = []
  //Recoger el id del usuario
  userId = localStorage.getItem('userId');
  //para el boton de favoritos
  isFavorite: boolean;
 //Donde guardo favoritos
  favorites: any[]=[];
 

  constructor(private modalCtrl: ModalController,
    private auth: AuthService, 
    private eventService: EventService,
    private alertCtrl: AlertController,
    private navCtrl:NavController) {

     

  }
  async ngOnInit() {
    
     //Para poder recoger los datos del usuario y mostrarlos en la página
     this.getUser();

    //Para poder recoger los eventos del usuario y mostrarlos en la página
    this.findEventsByAuthorId(this.userId);
    //recoger favoritos
    this.getFavorites(this.userId);
    // this.getFavoritesFromLocalStorage();

    this.getEventsJoined(this.userId);
  } 
 

  ionViewDidEnter() {
   
    //refrescamos la página 
  this.getUser();
  this.findEventsByAuthorId(this.userId);
  this.getFavorites(this.userId);
  this.getEventsJoined(this.userId);
  // this.getFavoritesFromLocalStorage();

  }
  
  // muestra eventos por autor
  findEventsByAuthorId(authorId: any) {
    this.eventService.findEventsByAuthorId(authorId).subscribe({
      next: async (data:EventsInterface) => {
        this.myEvents =  await Object.values(data);
        this.myEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ordenar los eventos por fecha
        console.log("refresco eventos")
        this.eventCount = this.myEvents.length;
        
        return this.myEvents;
      }
    });
  }

  getEventsJoined(userId:any){
    this.eventService.getEventsByParticipantId(userId).subscribe({
      next: (data:EventsInterface) => {
        this.joinedEvents =  Object.values(data);
;
        this.joinedEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
       console.log(this.joinedEvents)
       return this.joinedEvents;
      }
    });
  }
  //Para mostrar los datos del usuario
  getUser() {
    this.auth.getUser().subscribe({
      next: async (data) => {
        
        this.currentUser = await data;
        console.log(this.currentUser);
        // this.ionViewDidEnter();
       
      }
    });
  }

  // Para mostrar favoritos
  getFavorites(userId:any) {
    this.auth.getFavorites(userId).subscribe({
      next: (data) => {
        console.log(data);
        this.myFavs = Object.values(data);
        this.myFavs = data.map(event => ({
          ...event,
          favorite: localStorage.getItem(`favorite_${event._id}`) === 'true'
        }));

        this.myFavs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return this.myFavs
      }
    });
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: BottomSheetModalComponent,
    
      breakpoints: [0, 0.3],
      initialBreakpoint: 0.3,
      handleBehavior: 'none'
      
    });
    await modal.present();
  }

  //Cambia entre favoritos y mis eventos

  segmentChanged(event) {
    this.selectedSegment = event.detail.value;
  }
  // segmentChanged(event:any){
  //   const chose = event.detail.value;

  //   this.isFav = chose === 'my-favs';
   
    
  // }


  //Para poder eliminar un evento
  deleteEvent(name:string,author:string) {  
    if(this.selectedSegment=='my-events'){
      this.eventService.deleteEventByNameAndAuthor(name,author).subscribe({
        next: (data) => {
          console.log(data);
          this.presentAlert();
          
        },
        error: (err) => {
          console.log(err);
        }
    });
    }
   
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Borrar Evento',
      message: '¿Estás seguro de que quieres borrar el evento?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.modalCtrl.dismiss();
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Sí',
          handler: () => {
            this.ionViewDidEnter();
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
  //Para poder editar un evento
  editEvent(id: any) {
    if(this.selectedSegment=='my-events'){
    
      this.navCtrl.navigateForward([`/edit-event/${id}`]);
      this.ionViewDidEnter();
      
    }
  }

  // deleteFavorites(eventId: any) {
  //   const event = this.myEvents.find(e => e._id === eventId);
  //   this.auth.deleteFavorite(this.userId, eventId).subscribe({
  //     next: (data) => {
  //       console.log(data);
  //       this.ionViewDidEnter();
  //       localStorage.removeItem(`favorite_${eventId}`)
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   });
    
    
  // }



    //Navega a la página de información del evento
    selectEvent(id: string) {
      localStorage.removeItem('previousUrl');
      this.navCtrl.navigateForward(`/event-info/${id}`);
      localStorage.setItem('previousUrl', location.href);
    }

    //Llama al servicio para eleminar los favoritos
    deleteFavorite(eventId: any) {
      this.auth.deleteFavorite(this.userId, eventId).subscribe({
        next:async (data) => {
          const favorites:EventsInterface = await data.favorites;
          
          this.ionViewDidEnter();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  
   
    
}

