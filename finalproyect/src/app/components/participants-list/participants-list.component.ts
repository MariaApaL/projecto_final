import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss'],
})
export class ParticipantsListComponent implements OnInit {

  constructor(private eventService:EventService,
    private modalCtrl:ModalController,
    navParams: NavParams,
    private navCtrl:NavController) { this.eventId = navParams.get('eventId'); }

  ngOnInit() {


    this.getParticipants();
  }

eventId:any;
participants:any[]=[];

  dismiss() {
    this.modalCtrl.dismiss();
  }
  

  getParticipants() {
    this.eventService.getParticipants(this.eventId).subscribe({
      next: (data) => {
        this.participants = Object.values(data);
        console.log(data);
      }
    });

  }

  openUser(userId:string){
    this.modalCtrl.dismiss();
    this.navCtrl.navigateForward(`/otheruser-page/${userId}`);
  }
}
