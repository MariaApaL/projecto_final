import { DatePipe } from '@angular/common';
import { AbstractType, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Marker } from 'src/app/interfaces/marker';
//Declaramos la variable google para usar googlemaps
declare let google: any;

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.page.html',
  styleUrls: ['./add-new.page.scss'],
})

export class AddNewPage implements OnInit {


  public form: FormGroup;
  defaultDate
  checkbox: any[] = [];
  map: any;
  autocomplete: any;
 place: any;


  ngOnInit() {
    this.defaultDate = new Date().toISOString();
    // this.loadMap();
    this.loadSearchBox();
    // this.checkbox = [
    //   { label: 'Artes', value: 'artes', checked: false },
    //   { label: 'Deportes', value: 'deportes', checked: false },
    //   { label: 'Gastronomía', value: 'gastronomia', checked: false },
    //   { label: 'Educación', value: 'educacion', checked: false },
    //   { label: 'Aire libre', value: 'aire_libre', checked: false },
    //   { label: 'Animales', value: 'animales', checked: false },
    //   { label: 'Solidario', value: 'solidario', checked: false },
    // ];


  }



  constructor(
    private datePipe: DatePipe
  ) {

    this.form = new FormGroup({
      eventname: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(40)]),
      date: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(300)]),
      plazas: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required, Validators.min(0)]),
      category: new FormControl('', [Validators.required]),
    })
  }

  // loadMap(){
  //   //creamos mapa con un elemento de html

  //   const mapEle : HTMLElement | null = document.getElementById('map');

  //   //creamos objecto de coordenadas
  //   const myLatLng = {lat: 40.416775, lng: -3.703790};
  //   //creamos el mapa
  //   this.map = new google.maps.Map(mapEle, {
  //     center: myLatLng,
  //     zoom: 8
  //   });


  //   google.maps.event.addListenerOnce(this.map, 'idle', () => {
  //     mapEle.classList.add('show-map');
  //     const marker = {
  //       position:{
  //         lat: 40.416775,
  //         lng: -3.703790
  //       },
  //       title: 'Madrid'

  //     };
  //     this.addMarker(marker)
  //   });

  // }

  loadSearchBox() {
    const input: HTMLElement = document.getElementById('pac-input');
    console.log(input);
    const options = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
      types: ["establishment"],
    }
    let infowindow = new google.maps.InfoWindow();
    let autocomplete = new google.maps.places.Autocomplete(input,options);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      infowindow.close();
     
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
    }
    console.log(place);
    autocomplete = place;
    })
  };





  addMarker(marker: Marker) {
    return new google.maps.Marker({
      position: marker.position,
      title: marker.title,
      map: this.map
    });
  }

}












