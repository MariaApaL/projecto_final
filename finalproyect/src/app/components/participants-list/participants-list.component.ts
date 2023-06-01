import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss'],
})
export class ParticipantsListComponent implements OnInit {

//para guardar el id del evento
eventId:any;
//para guardar los participantes
participants:any[]=[];


  constructor(private eventService:EventService,
    private modalCtrl:ModalController,
    navParams: NavParams,
    private navCtrl:NavController) { this.eventId = navParams.get('eventId'); }

  ngOnInit() {


    this.getParticipants();
  }


  dismiss() {
    this.modalCtrl.dismiss();
  }
  
//funcion para obtener los participantes
  getParticipants() {
    this.eventService.getParticipants(this.eventId).subscribe({
      next: (data) => {
        this.participants = Object.values(data);
    
      }
    });

  }

  //funcion para abrir el perfil de un usuario
  openUser(userId:string){
    if(userId==localStorage.getItem('userId')){
    this.modalCtrl.dismiss();
    this.navCtrl.navigateForward(`home/user-page`);
  }else{
    this.modalCtrl.dismiss();
    this.navCtrl.navigateForward(`/otheruser-page/${userId}`);
  }
}

}
