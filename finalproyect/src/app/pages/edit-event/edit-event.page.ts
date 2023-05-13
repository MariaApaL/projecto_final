import { Component, NgZone, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
declare let google: any;

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {



  categories =[
    { label: 'Cultura', value: 'cultura', checked: false },
    { label: 'Deportes', value: 'deportes', checked: false },
    { label: 'Gastronomía', value: 'gastronomia', checked: false },
    { label: 'Ocio', value: 'ocio', checked: false },
    { label: 'Solidario', value: 'solidario', checked: false },
    { label: 'Relax', value: 'relax', checked: false },

  ]
 

  constructor( public zone: NgZone,
    private route: ActivatedRoute, 
    private eventService: EventService, 
    private navCtrl: NavController) { 
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('id');
      //Ya tenemo el id de la URL guardado en una variable 
    });

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  //datos del evento
  name: string;
  description: string;
  date: Date;
  location: string;
  newLocation: string;
  price: number;
  numPlazas: number;
  category: string;


  //id del evento
  eventId: string;

  //informacion del evento
  eventData: any;

//id del usuario
  userId = localStorage.getItem('userId');

  //boton desactivado
  disableButton = true;

  //propiedades del google maps autocomplete
  autocomplete: { input: string; };
  autocompleteItems: any[];
  placeid: any;
  GoogleAutocomplete: any;


  ngOnInit() {
    
   this.eventService.getEvent(this.eventId).subscribe({
      next: (data) => {
        this.eventData = data;
        console.log(this.eventData);
        this.name = this.eventData.name;
        this.description = this.eventData.description;
        this.date = this.eventData.date;
        this.location = this.eventData.location;
        this.price = this.eventData.price;
        this.numPlazas = this.eventData.numPlazas;
        this.category = this.eventData.category;
      
      }

  });
  }
  navigateback() {
    this.navCtrl.navigateBack('/home/user-page');
  }


  onNameChange(event: any) {
    this.name = event.target.value;
    this.disableButton = false;
  }


  onDescriptionChange(event: any) {
    this.description = event.target.value;
    this.disableButton = false;
  }


  onNumPlazasChange(event: any) {
    this.numPlazas = event.target.value;
    this.disableButton = false;
  }


  onPriceChange(event: any) {
    this.price = event.target.value;
    this.disableButton = false;
  }

  onCategoryChange(event: any) {
    this.category = event.target.value;
    this.disableButton = false;
  }

  onLocationChange(event: any) {
    this.location = this.autocomplete.input;
    this.newLocation = this.location;
     this.newLocation = event.target.value;
     this.disableButton = false;
  }


  saveChanges() {
    
    const updatedData = { name: this.name, description: this.description,
      date: this.date, location: this.newLocation, price: this.price, numPlazas: this.numPlazas, category: this.category};
    this.eventService.updateEvent(this.eventId,updatedData).subscribe({
      next: (data) => {
        console.log(data);
        this.navCtrl.navigateBack('/home/user-page');
      }
  });
}


UpdateSearchResults() {
  if (this.autocomplete.input == '') {
    this.autocompleteItems = [];
    return;
  }
  this.GoogleAutocomplete.getPlacePredictions(
    {
      input: this.autocomplete.input,
      componentRestrictions: {
        country: 'es'
      }
    },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
}

ClearAutocomplete() {
  this.autocompleteItems = []
  this.autocomplete.input = ''
}

SelectSearchResult(item: any) {
  this.autocomplete.input = item.description;
  console.log(item.description)
  this.autocompleteItems = [];

}
}


