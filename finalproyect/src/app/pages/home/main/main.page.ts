import { Component, OnInit } from '@angular/core';
import { AlertController, InfiniteScrollCustomEvent, NavController } from '@ionic/angular';
import { EventsInterface } from 'src/app/interfaces/event';
import { UsersInterface } from 'src/app/interfaces/user';
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

  scrollEvents = 8;
  categories: any[] = [];
  myEvents: EventsInterface[] = [];
  userId = localStorage.getItem('userId');
  userAuthor: string;


  ngOnInit() {
    this.categories = [
      { id: 1, name: 'Cultura' },
      { id: 2, name: 'Deportes' },
      { id: 3, name: 'Gastronomía' },
      { id: 4, name: 'Relax' },
      { id: 5, name: 'Ocio' },
      { id: 6, name: 'Solidario' }
    ];

    
    
    console.log('ngOnInit');
    // this.ionViewWillEnter();
   
    
  }


  ionViewWillEnter() {
    console.log('ionWillEnter')
    this.getEvents();

  }

  //llama al servicio para obtener los eventos
  getEvents() {
    this.eventService.getEvents().subscribe({
      next: async (data) => {
        this.myEvents = await Object.values(data);
       
        this.myEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ordenar los eventos por fecha
      
       
      }
    });
    }

  


  //Navega a la página de información del evento
  selectEvent(id: string) {
 
    this.navCtrl.navigateForward(`/event-info/${id}`);
    
  }

  onIonInfinite(ev) {
    this.getEvents();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  



}
