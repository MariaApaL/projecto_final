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
  userId = localStorage.getItem('userId');
 

  constructor(private modalCtrl: ModalController,
    private auth: AuthService, 
    private eventService: EventService,
    private alertCtrl: AlertController,
    private navCtrl:NavController) {

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
  ngOnInit() {
    //Para poder recoger los datos del usuario y mostrarlos en la página

    //Para poder recoger los eventos del usuario y mostrarlos en la página
    this.eventService.findEventsByAuthorId(this.userId).subscribe({
      next: (data) => {
        this.myEvents =  Object.values(data);
        this.myEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ordenar los eventos por fecha
        console.log(this.myEvents);
        console.log(data);
        this.eventCount = this.myEvents.length;
        return this.myEvents;
      }
    });
 
  
    
  } 
  
  //Para poder recoger los datos del usuario y mostrarlos en la página
  // getUserInfo(){
  //   this.auth.getUser().subscribe({
  //     next: (data) => {
  //       this.currentUser = data;
  //       console.log(data);
       
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   });

  // }

  //Para poder recoger los eventos del usuario y mostrarlos en la página
  // getUserEvents(userId:String){
  //   this.eventService.findEventsByAuthorId(userId).subscribe({
  //     next: (data) => {
  //       this.myEvents =  Object.values(data);
  //       this.myEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ordenar los eventos por fecha
  //       console.log(this.myEvents);
  //       console.log(data);
  //       this.eventCount = this.myEvents.length;
  //       return this.myEvents;
  //     }
  //   });
    
  // }


  ionViewDidEnter() {
   
    //refrescamos la página para que se muestren los datos del usuario
    this.auth.getUser().subscribe({
     next: (data) => {
       this.currentUser = data;
       console.log("refresco getuser");
     },
     error: (err) => {
       console.log(err);
     }
   });
 
 //Refrescamos la página para que se muestren los eventos 
 this.eventService.findEventsByAuthorId(this.userId).subscribe({
  next: (data) => {
    this.myEvents =  Object.values(data);
    
    this.myEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ordenar los eventos por fecha
    console.log("refresco eventos")
    this.eventCount = this.myEvents.length;
    return this.myEvents;
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
}

