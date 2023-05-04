import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor(private navCtrl: NavController,
    private eventService: EventService,
    private alertCtrl: AlertController,
    private auth: AuthService) { 

     
      
    }


  categories: any[] = [];
  myEvents: any[] = [];
  favorites: any[] = [];
  userId = localStorage.getItem('userId');


  ngOnInit() {
    this.categories = [
      { id: 1, name: 'Cultura' },
      { id: 2, name: 'Deportes' },
      { id: 3, name: 'Gastronomía' },
      { id: 4, name: 'Animales' },
      { id: 4, name: 'Solidario' }
    ];

    this.getEvents();
    this.getFavoritesFromLocalStorage();
    
  }

  

  ionViewDidEnter() {
    this.getEvents();
    this.getFavoritesFromLocalStorage();
    this.getFavorites();
  }

  //llama al servicio para obtener los eventos
  getEvents() {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.myEvents = Object.values(data);
        this.myEvents.forEach((event) => {
          event.favorite = this.favorites.includes(event._id);
        });
        this.myEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ordenar los eventos por fecha
        console.log(this.myEvents);
        console.log(data);
        return this.myEvents;
      }

    });

  }

  addFavorites(eventId: any) {
    if (this.favorites.includes(eventId)) {
     this.deleteFavorite(eventId);
    } else {
      this.setFavoriteEvent(eventId);
    }
  }
  

  //llama al servicio para añadir un evento a favoritos
  setFavoriteEvent(eventId: any) {
    this.auth.setFavorite(this.userId, eventId).subscribe({
            next: (data) => {
              console.log(data);
              this.favorites.push(eventId);
              this.myEvents.find((event) => event._id === eventId).favorite = true;
              localStorage.setItem('favorites', JSON.stringify(this.favorites)); // guarda los favoritos en localStorage
            },
            error: (err) => {
              console.log(err);
            }
          });
  }

  //Llama al servicio para eleminar los favoritos
  deleteFavorite(eventId: any) {
    this.auth.deleteFavorite(this.userId, eventId).subscribe({
            next: (data) => {
              console.log(data);
              this.favorites = this.favorites.filter((id) => id !== eventId);
              this.myEvents.find((event) => event._id === eventId).favorite = false;
              localStorage.setItem('favorites', JSON.stringify(this.favorites)); // guarda los favoritos
            },
            error: (err) => {
              console.log(err);
            }
          });
  }


  //Navega a la página de información del evento
  selectEvent(id: string) {
    this.navCtrl.navigateForward(`/event-info/${id}`);
  }

  //recogemos los favoritos del usuario
  getFavorites() {
    this.auth.getFavorites(this.userId).subscribe({
      next: (data) => {
        this.favorites = data.map((fav) => fav.event_id);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
//recogemos los favoritos del usuario de localStorage
getFavoritesFromLocalStorage() {
  const favorites = localStorage.getItem('favorites');
  if (favorites) {
  this.favorites = JSON.parse(favorites);
  this.myEvents.forEach((event) => {
  event.favorite = this.favorites.includes(event._id);
  });
  }
}

}
