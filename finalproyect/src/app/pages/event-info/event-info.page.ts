import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { EventService } from 'src/app/services/event.service';
import { Location } from '@angular/common';

import { AuthService } from 'src/app/services/auth.service';
declare let google: any;

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.page.html',
  styleUrls: ['./event-info.page.scss'],
})
export class EventInfoPage implements OnInit {


  eventId: string;
  event: any;
  isFavorite: boolean;
  participants: any;
  isJoined = false;

  userId = localStorage.getItem('userId');
  location:string;

  fav: any;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    
    private navCtrl: NavController,
    private auth: AuthService,) {
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('id');
      //Ya tenemo el id de la URL guardado en una variable 
    });

   



  }



  ngOnInit() {
    this.getEvent();
    // this.initMap();
    


  }

  ionViewDidEnter() {
    this.getEvent();



  }
  //llama al servicio para obtener los eventos
  getEvent() {
    this.eventService.getEvent(this.eventId).subscribe({
      next: (data) => {
        this.event = data;
        console.log(this.event)
        this.location=this.event.location;
        this.isFavorite = localStorage.getItem(`favorite_${this.eventId}`) === 'true';
      
        this.participants = this.event.plazas.length;
        return this.event;
      }
    });
  }

  navigateBack() {
  
    this.navCtrl.navigateBack('/home/main');
  }

  addFavorite() {
    if (this.isFavorite) {
      this.deleteFavorite(this.eventId);
    } else {
      this.setFavoriteEvent(this.eventId);
    }
    this.isFavorite = !this.isFavorite;
    localStorage.setItem(`favorite_${this.eventId}`, JSON.stringify(this.isFavorite));
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

  joinEvent() {
    this.eventService.addParticipant(this.eventId, this.userId).subscribe({
      next: (data) => {
        console.log(data);
        this.event=data;
        this.participants = this.event.plazas.length;
      }
    });
}

deleteParticipant() {
  this.eventService.deleteParticipant(this.eventId, this.userId).subscribe({
    next: (data) => {
      console.log(data);
      this.event=data;
      if(this.event.plazas.length!=0){
      this.participants = this.event.plazas.length;
    }
  }
  });

}

getParticipants(eventId: any) {
  // this.eventService.getParticipants(eventId).subscribe({
  //   next: (data) => {
  //     console.log(data);
  //   }
  // });

}



joinOrLeaveEvent() {
  if (this.isJoined) {
    this.deleteParticipant();
    this.ionViewDidEnter();
  } else {
    this.joinEvent();
    this.ionViewDidEnter();
  }
  this.isJoined = !this.isJoined;
}

// initMap() {
//   let map: google.maps.Map;
//   let geocoder: google.maps.Geocoder = new google.maps.Geocoder();
//   let address = this.location;
//   async function initMap(): Promise<void> {
//   const { Map } = await google.maps.importLibrary("maps");
//     map = new Map(document.getElementById("map") as HTMLElement, {
//       zoom: 8,
//     });

//     geocoder.geocode({ address: "NOMBRE_DE_LA_UBICACION" }, (results, status) => {
//       if (status === "OK") {
//         const location = results[0].geometry.location;
//         map.setCenter(location);
//         new google.maps.Marker({
//           position: location,
//           map: map,
//         });
//       } else {
//         console.error("Geocode was not successful for the following reason: " + status);
//       }
//     });
//   }
// }


// initMap() {
//   let geocoder: google.maps.Geocoder = new google.maps.Geocoder();
//   const map = new google.maps.Map(
//     document.getElementById("map") as HTMLElement,
//     {
      
//       zoom: 13,
//       mapTypeId: "roadmap",
//     }
//   );
//   geocoder.geocode({ address: this.location }, (results, status) => {
//           if (status === "OK") {
//             const location = results[0].geometry.location;
//             map.setCenter(location);
//             new google.maps.Marker({
//               position: location,
//               map: map,
//             });
//           } else {
//             console.error("Geocode was not successful for the following reason: " + status);
//           }
//         });
//   }



}














