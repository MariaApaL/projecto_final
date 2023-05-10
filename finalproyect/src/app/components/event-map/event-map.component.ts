import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-event-map',
  templateUrl: './event-map.component.html',
  styleUrls: ['./event-map.component.scss'],
})
export class EventMapComponent implements OnInit {

  constructor(private modalCtrl:ModalController,
    navParams: NavParams) { this.location = navParams.get('location');}

  

  location: string;
  
  ngOnInit() {
    this.initMap();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
  
  async cargarMapa() {

    await new Promise(resolve => setTimeout(resolve, 1000));
    this.initMap();

  }

  initMap() {
    let geocoder: google.maps.Geocoder = new google.maps.Geocoder();
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {

        zoom: 20,
        fullscreenControl: false,

      }
    );

    geocoder.geocode({ address: this.location }, (results, status) => {
      if (status === "OK") {
        const location = results[0].geometry.location;
        map.setCenter(location);
        new google.maps.Marker({
          position: location,
          map: map,
        });
      } else {
        console.error("Geocode was not successful for the following reason: " + status);
      }
    });
  }


  closeModal(){
    this.modalCtrl.dismiss();
      
  }
}
