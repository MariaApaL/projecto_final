import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { ModalController, NavController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { EventService } from 'src/app/services/event.service';
import { EventsInterface } from 'src/app/interfaces/event';

declare let google: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  map: google.maps.Map;
  infoWindow: google.maps.InfoWindow;
  latitude: any;
  longitude: any;
  GoogleAutocomplete: any;
  events: EventsInterface[];

  eventId: string;

  constructor(
    private eventService: EventService,
    public zone: NgZone,
    public navCtrl: NavController,

  ) {


  }
  

  async ngOnInit() {
    const coordinates = await this.getCurrentPosition();
    this.initMap(coordinates);
    this.initAutocomplete();
    this.getEvents();

  }

  async getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
    const position = await Geolocation.getCurrentPosition();
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log('Ubicación actual:', latitude, longitude);
    return { latitude, longitude };
  }

  initMap(coordinates: { latitude: number; longitude: number }) {
    const mapOptions = {
      center: { lat: coordinates.latitude, lng: coordinates.longitude },
      zoom: 15,
      disableDefaultUI: false,
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    const marker = new google.maps.Marker({
      position: { lat: coordinates.latitude, lng: coordinates.longitude },
      map: this.map,
      title: 'Mi ubicación',
      icon: {
        url: '../../../../assets/marker.png', // Ruta al archivo de imagen del marcador
        scaledSize: new google.maps.Size(50, 50) // Tamaño del marcador
      }
    });

    const circle = new google.maps.Circle({
      strokeColor: '#4285F4',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#4285F4',
      fillOpacity: 0.35,
      map: this.map,
      center: { lat: coordinates.latitude, lng: coordinates.longitude },
      radius: 50 // Radio del círculo en metros
    });

    const myLocationButton = document.getElementById('myLocationButton');
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(myLocationButton);

    myLocationButton.addEventListener('click', () => {
      this.goToMyLocation();
    });
  }


  initAutocomplete() {
    const input = document.getElementById('search');
    const searchBox = new google.maps.places.SearchBox(input);

    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds());
    });

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      const bounds = new google.maps.LatLngBounds();

      places.forEach((place: any) => {
        if (!place.geometry || !place.geometry.location) {
          console.log('Returned place contains no geometry');
          return;
        }

        bounds.extend(place.geometry.location);
      });

      this.map.fitBounds(bounds);
    });
  }

  goToMyLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const latLng = new google.maps.LatLng(latitude, longitude);
          this.map.panTo(latLng);
        },
        (error) => {
          console.log('Error al obtener la ubicación: ', error);
        }
      );
    }
  }

  getEvents() {
    this.eventService.getEvents().subscribe({
      next: async (res: EventsInterface[]) => {
        this.events = res;
        console.log(this.events);
        this.showEventMarkers();

      },


    });
  }

  showEventMarkers() {
    const geocoder = new google.maps.Geocoder();
    const infowindow = new google.maps.InfoWindow();

    for (const event of this.events) {
      geocoder.geocode({ address: event.location }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          console.log(location);
          const marker = new google.maps.Marker({
            position: location,
            map: this.map,
            icon: {
              url: '../../../../assets/pin-marker.svg', // Ruta al archivo de imagen del marcador
              scaledSize: new google.maps.Size(40, 40) // Tamaño del marcador
            }
          });
          this.eventId = event._id;
          console.log(this.eventId);
          marker.addListener('click', () => {
            const content = `
              <div class="infowindow-content">
                <h2>${event.name}</h2>
                <p>${event.description}</p>
              </div>`;
            infowindow.setContent(content);
            infowindow.open(this.map, marker);
          
            infowindow.addListener('domready', () => {
              const infoWindowElement = document.querySelector('.gm-style-iw');
              if (infoWindowElement) {
                infoWindowElement.addEventListener('click', (e) => {
                  const target = e.target as HTMLElement;
                  if (target.tagName === 'H2') {
                    console.log('click en el título',this.eventId);
                    this.openInfo(this.eventId);
                  }
                });
              }
            });
          });

        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
  }

  openInfo(id: string) {
   this.navCtrl.navigateForward(`/event-info/${id}`);

  }
}


// const infowindowElement = document.querySelector('.infowindow-title');
// infowindowElement.addEventListener('click', () => {
//   this.navCtrl.navigateForward(`/event-info/${event._id}`);
// });