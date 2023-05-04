import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { BottomSheetModalComponent } from 'src/app/components/bottom-sheet-modal/bottom-sheet-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import {Event} from 'src/app/interfaces/event'
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';



@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.page.html',
  styleUrls: ['./user-page.page.scss'],
})
export class UserPagePage implements OnInit {

  currentUser: any = {};
  isFav:boolean = true;
  eventCount: number = 0;
  myEvents:any[] = []
  myFavs:any[] = []
  userId = localStorage.getItem('userId');
 
  favorites: any[]=[];
 

  constructor(private modalCtrl: ModalController,
    private auth: AuthService, 
    private eventService: EventService,
    private alertCtrl: AlertController,
    private navCtrl:NavController) {

      //Para poder recoger los datos del usuario y mostrarlos en la página
      this.getUser();

  }
  ngOnInit() {
    

    //Para poder recoger los eventos del usuario y mostrarlos en la página
    this.findEventsByAuthorId(this.userId);
    //recoger favoritos
    this.getFavorites(this.userId);
    // this.getFavoritesFromLocalStorage();
  } 
 

  ionViewDidEnter() {
   
    //refrescamos la página 
  this.getUser();
  this.findEventsByAuthorId(this.userId);
  this.getFavorites(this.userId);
  // this.getFavoritesFromLocalStorage();

  }
  
  // muestra eventos por autor
  findEventsByAuthorId(authorId: any) {
    this.eventService.findEventsByAuthorId(authorId).subscribe({
      next: (data) => {
        this.myEvents =  Object.values(data);
        this.myEvents.forEach((event) => {
          event.favorite = this.favorites.includes(event._id);
        });
        this.myEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ordenar los eventos por fecha
        console.log("refresco eventos")
        this.eventCount = this.myEvents.length;
        return this.myEvents;
      }
    });
  }

  //Para mostrar los datos del usuario
  getUser() {
    this.auth.getUser().subscribe({
      next: (data) => {
        
        this.currentUser = data;
        console.log(this.currentUser);
        // this.ionViewDidEnter();
        
       
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // Para mostrar favoritos
  getFavorites(userId:any) {
    this.auth.getFavorites(userId).subscribe({
      next: (data) => {
        console.log(data);
        this.myFavs = Object.values(data);
        this.favorites = data.map((fav) => fav.event_id);
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
  segmentChanged(event:any){
    const chose = event.detail.value;

    this.isFav = chose === 'my-favs';
  }

  //Para poder eliminar un evento
  deleteEvent(name:string,author:string) {  
    if(!this.isFav){
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
    if(!this.isFav){
     
      this.navCtrl.navigateForward([`/edit-event/${id}`]);
      
    }
  }



  //Llama al servicio para eleminar los favoritos
  // deleteFavorites(eventId: any) {
  //   this.auth.deleteFavorite(this.userId, eventId).subscribe({
  //           next: (data) => {
  //             console.log(data);
  //             this.favorites = this.favorites.filter((id) => id !== eventId);
  //             this.myFavs.find((event) => event._id === eventId).favorite = false;
  //             localStorage.setItem('favorites', JSON.stringify(this.favorites));
  //            this.ionViewDidEnter();
  //           },
  //           error: (err) => {
  //             console.log(err);
  //           }
  //         });
  // }

  deleteFavorites(eventId: any) {
    this.auth.deleteFavorite(this.userId, eventId).subscribe({
      next: (data) => {
        console.log(data);
        this.favorites = this.favorites.filter((id) => id !== eventId);
        const index = this.myFavs.findIndex((event) => event._id === eventId);
        if (index > -1) {
          this.myFavs.splice(index, 1);
        }
  
        // Recuperar los favoritos existentes del localStorage
        let favorites = JSON.parse(localStorage.getItem('favorites'));
  
        // Eliminar el evento seleccionado de los favoritos
        const indexToRemove = favorites.indexOf(eventId);
        if (indexToRemove > -1) {
          favorites.splice(indexToRemove, 1);
        }
  
        // Guardar los favoritos actualizados en el localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getFavoritesFromLocalStorage() {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
    this.favorites = JSON.parse(favorites);
    this.myEvents.forEach((event) => {
    event.favorite = this.favorites.includes(event._id);
    });
    }
  }

    //Navega a la página de información del evento
    selectEvent(id: string) {
      this.navCtrl.navigateForward(`/event-info/${id}`);
    }

}

