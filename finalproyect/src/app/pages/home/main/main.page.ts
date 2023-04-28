import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { EventService } from 'src/app/services/event.service';
import SwiperCore, { SwiperOptions, Pagination } from 'swiper';
// install Swiper modules
SwiperCore.use([Pagination]);

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor(private navCtrl: NavController, private eventService: EventService, private alertCtrl: AlertController) { }
  categoryConfig: SwiperOptions;
  eventConfig: SwiperOptions;
  categories: any[] = [];
  myEvents: any[] = [];
  isMine:boolean = true;
  userId = localStorage.getItem('userId');



  ngOnInit() {
    this.categories = [
      { id: 1, name: 'Cultura' },
      { id: 2, name: 'Deportes' },
      { id: 3, name: 'Gastronomía' },
      { id: 4, name: 'Animales' },
      { id: 4, name: 'Solidario' }
    ];

    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.myEvents = Object.values(data);
        this.myEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ordenar los eventos por fecha
        console.log(this.myEvents);
        console.log(data);
        return this.myEvents;
      }

    });

  }
  searchAll() {
    this.navCtrl.navigateForward("/home/search");
  }

  ngAfterContentChecked() {
    this.categoryConfig = {
      slidesPerView: 2.1,
    
    };
    this.eventConfig = {
      slidesPerView: 2.1,

    };
  }

  ionViewDidEnter() {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.myEvents = Object.values(data);
        this.myEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ordenar los eventos por fecha
        console.log(this.myEvents);
        console.log(data);
        return this.myEvents;
      }

    });
  }

    //Para poder eliminar un evento
    deleteEvent(name:string,author:string) {  
      if(!this.isMine){
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

}
