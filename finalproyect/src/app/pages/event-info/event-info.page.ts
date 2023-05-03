import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.page.html',
  styleUrls: ['./event-info.page.scss'],
})
export class EventInfoPage implements OnInit {

  
  eventId: string;
  event: any;

  constructor( 
    private route: ActivatedRoute, 
    private eventService: EventService, 
    private navCtrl: NavController) { 
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('id');
      //Ya tenemo el id de la URL guardado en una variable 
    });

  }

  ngOnInit() {
    this.eventService.getEvent(this.eventId).subscribe({
      next: (data) => {
        this.event = data;
        console.log(this.event);
    
      
      }

  });

}

}
