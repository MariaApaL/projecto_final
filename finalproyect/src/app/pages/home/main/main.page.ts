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

      this.getEvents();
      
    }


  categories: any[] = [];
  myEvents: any[] = [];
  favorites: any[] = [];
  userId = localStorage.getItem('userId');
  isFavorite: boolean = false;

  ngOnInit() {
    this.categories = [
      { id: 1, name: 'Cultura' },
      { id: 2, name: 'Deportes' },
      { id: 3, name: 'Gastronomía' },
      { id: 4, name: 'Animales' },
      { id: 4, name: 'Solidario' }
    ];

    
    
    this.getEvents();
    // this.ionViewWillEnter();
    
  }

 
  

  ionViewDidEnter() {
    console.log('recarga')
    this.getEvents();

  }

  //llama al servicio para obtener los eventos
  getEvents() {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.myEvents = Object.values(data);
       
        this.myEvents = data.map(event => ({
          ...event,
          favorite: localStorage.getItem(`favorite_${event._id}`) === 'true'
        }));

        this.myEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ordenar los eventos por fecha
        
        return this.myEvents;
      }

    });

  }


  addFavorites(eventId: any) {
    const event = this.myEvents.find(e => e._id === eventId);
    if (event.favorite) {
      this.deleteFavorite(eventId);
    } else {
      this.setFavoriteEvent(eventId);
    }
    event.favorite = !event.favorite; // cambiar el estado de favorito del evento seleccionado
    localStorage.setItem(`favorite_${eventId}`, JSON.stringify(event.favorite)); // guardar el estado del evento favorito en el almacenamiento local
  }
  

  //llama al servicio para añadir un evento a favoritos
  setFavoriteEvent(eventId: any) {
    this.auth.setFavorite(this.userId, eventId).subscribe({
      next: (data) => {
        console.log(data);
       
    
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
       
      
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  //Navega a la página de información del evento
  selectEvent(id: string) {
    localStorage.removeItem('previousUrl');
    this.navCtrl.navigateForward(`/event-info/${id}`);
    localStorage.setItem('previousUrl', location.href);
  }





}
