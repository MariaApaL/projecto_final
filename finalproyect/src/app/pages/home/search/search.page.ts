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

  //mapa google maps
  map: google.maps.Map;
  //recoge la informacion de la ventana
  infoWindow: google.maps.InfoWindow;
  latitude: any;
  longitude: any;
  //para el buscador
  GoogleAutocomplete: any;
  //guardar eventos
  events: EventsInterface[];
  //guardar eventos para filtrar
  eventsFiltered: EventsInterface[];

  //guardar el id del evento
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

  ionViewWillEnter() {
  }
  //obtener la ubicación actual por capacitor
  async getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
    const position = await Geolocation.getCurrentPosition();
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
  
    return { latitude, longitude };
  }

  //inicializar el mapa
  initMap(coordinates: { latitude: number; longitude: number }) {
    const mapOptions = {
      center: { lat: coordinates.latitude, lng: coordinates.longitude },
      zoom: 15,
      disableDefaultUI: false,
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    //marcador de la ubicación actual
    const marker = new google.maps.Marker({
      position: { lat: coordinates.latitude, lng: coordinates.longitude },
      map: this.map,
      title: 'Mi ubicación',
      icon: {
        url: '../../../../assets/marker.png', 
        scaledSize: new google.maps.Size(50, 50) 
      }
    });

    //circulo de la ubicación actual
    const circle = new google.maps.Circle({
      strokeColor: '#4285F4',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#4285F4',
      fillOpacity: 0.35,
      map: this.map,
      center: { lat: coordinates.latitude, lng: coordinates.longitude },
      radius: 50 
    });

    //botón para ir a la ubicación actual
    const myLocationButton = document.getElementById('myLocationButton');
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(myLocationButton);

    //evento para ir a la ubicación actual
    myLocationButton.addEventListener('click', () => {
      this.goToMyLocation();
    });
  }


  //inicializar el buscador
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
        
          return;
        }

        bounds.extend(place.geometry.location);
      });

      this.map.fitBounds(bounds);
    });
  }

  //ir a la ubicación actual
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
         
        }
      );
    }
  }

  capitalizeWords(str: string):string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  getEvents() {
    this.eventService.getEvents().subscribe({
      next: async (res: EventsInterface[]) => {
        this.events = res;
        this.eventsFiltered = this.events;
    
  
        const currentDate = new Date();
        this.eventsFiltered = this.events.filter(event => new Date(event.date) > currentDate);
        this.eventsFiltered.forEach((event: EventsInterface) => {
          event.name = this.capitalizeWords(event.name);
          console.log(event.name);
        }
        );
      
        this.showEventMarkers();

      },


    });
  }

  //muestra los marcadores donde esten los eventos
  showEventMarkers() {
    const geocoder = new google.maps.Geocoder();
    const infowindow = new google.maps.InfoWindow();

    for (const event of this.eventsFiltered) {
      geocoder.geocode({ address: event.location }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
  
          const marker = new google.maps.Marker({
            position: location,
            map: this.map,
            icon: {
              url: '../../../../assets/pin-marker.svg', 
              scaledSize: new google.maps.Size(40, 40) // Tamaño del marcador
            }
          });
          this.eventId = event._id;
     
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
