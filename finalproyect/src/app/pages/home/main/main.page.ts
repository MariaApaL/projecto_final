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
       
        this.myEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ordenar los eventos por fecha
        
        return this.myEvents;
      }

    });

  }



  //Navega a la página de información del evento
  selectEvent(id: string) {
 
    this.navCtrl.navigateForward(`/event-info/${id}`);
    
  }





}
