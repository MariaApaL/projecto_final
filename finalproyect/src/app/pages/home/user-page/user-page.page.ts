import { Component, OnInit } from '@angular/core';
import { AlertController, InfiniteScrollCustomEvent, ModalController, NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { BottomSheetModalComponent } from 'src/app/components/bottom-sheet-modal/bottom-sheet-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';

import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { EventsInterface } from 'src/app/interfaces/event';
import { UsersInterface } from 'src/app/interfaces/user';



@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.page.html',
  styleUrls: ['./user-page.page.scss'],
})
export class UserPagePage implements OnInit {
  //Recojo la info del usuario
  currentUser: UsersInterface;

  //para cambiar de segmento
  selectedSegment = 'my-favs';
  //Recoger el numero de eventos creados
  eventCount: number = 0;

  //recoger los eventos del usuario
  myEvents: EventsInterface[] = []
  //Recoger los eventos en los que participa el usuario
  joinedEvents: EventsInterface[] = []
  //Recoger los favoritos del usuario
  myFavs: EventsInterface[] = []
  //Recoger el id del usuario
  userId = localStorage.getItem('userId');
  //para el boton de favoritos
  isFavorite: boolean;
  //Donde guardo favoritos
  favorites: any[] = [];
  //para las valoraciones
  value: any;
  //para la imagen
  picture: string;

  //para recoger datos 
  suscription: Subscription;
  eventSuscription: Subscription;

  //para el infinite scroll de los eventos creados, favs y apuntados
  allJoined: EventsInterface[] = [];
  allCreated: EventsInterface[] = [];
  allFavs: EventsInterface[] = [];
  displayedCreated: EventsInterface[] = [];
  displayedJoined: EventsInterface[] = [];
  displayedFavs: EventsInterface[] = [];



  constructor(private modalCtrl: ModalController,
    private auth: AuthService,
    private eventService: EventService,
    private alertCtrl: AlertController,
    private navCtrl: NavController) {


  }
  ngOnInit() {



  }


  ionViewWillEnter() {

    //Para poder recoger los datos del usuario y mostrarlos en la página
    this.getUser();

    this.suscription= this.auth._refreshNeeded$.subscribe(() => {
      this.getUser();

    });

    this.eventSuscription= this.eventService._refreshNeeded$.subscribe(() => {
      this.findEventsByAuthorId(this.userId);
      this.getFavorites(this.userId);
      this.getEventsJoined(this.userId);
      this.getValorations(this.userId);
    });
    
    
    //Para poder recoger los eventos del usuario y mostrarlos en la página
    this.findEventsByAuthorId(this.userId);
    //recoger favoritos
    this.getFavorites(this.userId);
    // this.getFavoritesFromLocalStorage();

    this.getEventsJoined(this.userId);
    this.getValorations(this.userId);

  }

  //chequea si ls fecha del evento es valida
  isEventDateValid(date: string): boolean {
    const eventDate = new Date(date);
    const currentDate = new Date();

    return eventDate >= currentDate;
  }

  // muestra eventos por autor
  findEventsByAuthorId(authorId: any) {
    this.eventService.findEventsByAuthorId(authorId).subscribe({
      next: async (data: EventsInterface) => {
        this.myEvents = await Object.values(data);
        

        this.allCreated= this.myEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ordenar los eventos por fecha
        this.eventCount = this.myEvents.length;
        this.displayedCreated = this.allCreated.slice(0, 5);

         // Capitalizar la primera letra de event.name
         this.displayedCreated.forEach((event: EventsInterface) => {
          event.name = this.capitalizeWords(event.name);
          console.log(event.name);
        }
       );
      
        }
      });
    }
  
    capitalizeWords(str: string):string {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  
  //obtiene los eventos donde el usuario participa
  getEventsJoined(userId: any) {
    this.eventService.getEventsByParticipantId(userId).subscribe({
      next: (data: EventsInterface) => {
        this.joinedEvents = Object.values(data);
        this.allJoined =  this.joinedEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.displayedJoined = this.allJoined.slice(0, 5);
        this.displayedJoined.forEach((event: EventsInterface) => {
          event.name = this.capitalizeWords(event.name);
          console.log(event.name);
        }
        );
      
      }
    });
  }


  // para el infitiny scrll
  loadJoined(event: any) {
    // Simula una carga asincrónica con un retraso de 1 segundo
    setTimeout(() => {
      const startIndex = this.displayedJoined.length;
      const endIndex = startIndex + 5;
      const moreEvents = this.allJoined.slice(startIndex, endIndex);
      this.displayedJoined = this.displayedJoined.concat(moreEvents);
      this.displayedJoined.forEach((event: EventsInterface) => {
        event.name = this.capitalizeWords(event.name);
      
      });
      event.target.complete();

    }, 1000);
  }


  loadFavs(event: any) {
    // Simula una carga asincrónica con un retraso de 1 segundo
    setTimeout(() => {
      const startIndex = this.displayedFavs.length;
      const endIndex = startIndex + 5;
      const moreEvents = this.allFavs.slice(startIndex, endIndex);
      this.displayedFavs = this.displayedFavs.concat(moreEvents);
      this.displayedFavs.forEach((event: EventsInterface) => {
        event.name = this.capitalizeWords(event.name);
      
      });
      event.target.complete();
    }, 1000);
  }

  loadEvents(event: any) {
    // Simula una carga asincrónica con un retraso de 1 segundo
    setTimeout(() => {
      const startIndex = this.displayedCreated.length;
      const endIndex = startIndex + 5;
      const moreEvents = this.allCreated.slice(startIndex, endIndex);
      this.displayedCreated = this.displayedCreated.concat(moreEvents);
      this.displayedCreated.forEach((event: EventsInterface) => {
        event.name = this.capitalizeWords(event.name);
      
      });
      event.target.complete();

    }, 1000);
  }


  getUser() {
    this.auth.getUserById(this.userId).subscribe({
      next: async (data) => {
        
        this.currentUser = await data;
        this.picture = this.currentUser.picture;
      }
    });

  }

  // Para mostrar favoritos
  getFavorites(userId: any) {
    this.auth.getFavorites(userId).subscribe({
      next: (data) => {
       
        this.myFavs = Object.values(data);
        this.allFavs = this.myFavs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.displayedFavs = this.allFavs.slice(0, 5);
        this.displayedFavs.forEach((event: EventsInterface) => {
          event.name = this.capitalizeWords(event.name);
          console.log(event.name);
        }
        );
      
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


  //Para poder eliminar un evento
  deleteEvent(eventId: string) {

    if (this.selectedSegment == 'my-events') {
      this.eventService.deleteEventByIdAndAuthor(eventId, this.userId).subscribe({
        next: (data) => {
         
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
        
          }
        }, {
          text: 'Sí',
          handler: () => {
            this.ionViewWillEnter();
          
          }
        }
      ]
    });

    await alert.present();
  }



  //Para poder editar un evento
  editEvent(id: any) {
    if (this.selectedSegment == 'my-events') {

      this.navCtrl.navigateForward([`/edit-event/${id}`]);


    }
  }


  //Navega a la página de información del evento
  selectEvent(id: string) {
    localStorage.removeItem('previousUrl');
    this.navCtrl.navigateForward(`/event-info/${id}`);
    localStorage.setItem('previousUrl', location.href);
  }

  //Llama al servicio para eleminar los favoritos
  deleteFavorite(eventId: any) {
    this.auth.deleteFavorite(this.userId, eventId).subscribe({
      next: async (data) => {
        const favorites: EventsInterface = await data.favorites;

        this.ionViewWillEnter();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  //para  mostrar la media de las valoraciones en el perfil
  async getValorations(userId: string) {

    this.auth.getValuationsByAuthor(userId).subscribe({
      next: async (data) => {
        const valuations = await data;

        const values = valuations.valuations; 
        // array con los valores de "value"
        const valuesArray = values.map(valuation => valuation.value); 

        const sum = valuesArray.reduce((total, value) => total + value, 0); 
// Calcular el promedio o establecerlo como 0 si el array está vacío
        const average = valuesArray.length > 0 ? sum / valuesArray.length : 0; 

        this.value = isNaN(average) ? 0 : average.toFixed(1)// Verificar si el promedio es NaN y mostrar 0 en su lugar
      }
    });
  }

}
