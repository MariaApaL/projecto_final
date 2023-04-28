import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { EventService } from 'src/app/services/event.service';
declare let google: any;

@Component({
  selector: 'app-create-event-modal',
  templateUrl: './create-event-modal.component.html',
  styleUrls: ['./create-event-modal.component.scss'],
})
export class CreateEventModalComponent implements OnInit {


  newCategory: string;

  public form: FormGroup;
  
 
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;

  categories =[
    { label: 'Cultura', value: 'cultura', checked: false },
    { label: 'Deportes', value: 'deportes', checked: false },
    { label: 'Gastronomía', value: 'gastronomia', checked: false },
    { label: 'Animales', value: 'animales', checked: false },
    { label: 'Solidario', value: 'solidario', checked: false },

  ]


  ngOnInit() {
  

  }


  constructor(
     public zone: NgZone, 
    public eventService: EventService,
    public alertController: AlertController,
    public navCtrl: NavController,
    public modal: ModalController
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    
    

    this.form = new FormGroup({
      eventname: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(40)]),
      date: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.maxLength(300)]),
      plazas: new FormControl('', [Validators.required, Validators.pattern('^[1-9][0-9]{0,2}$'),Validators.maxLength(3)]),
      price: new FormControl(0, [ Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'),Validators.maxLength(3)]),
    })
  
  }


// validateDate(dateString) {
//     const today = new Date();
//     const oneYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
//     const date = new Date(dateString); 
//     const menos = date < today;
//     const mas = date > oneYear;
    
//     if(date<=today || date>=oneYear){
//       return false
//     }else if(date>today && date<oneYear){
//       return true

//     }else{
//       return false
//     }

// }
  
  
  createEvent(){
   
    const name = this.form.value.eventname.toLowerCase();
    const date = this.form.value.date;
  
    const description = this.form.value.description;
    const numPlazas = this.form.value.plazas;
    const price = this.form.value.price;
    const category = this.newCategory
    const location = this.autocomplete.input;
    const author = localStorage.getItem('userId');
    

   
    this.eventService.createEvent(name,date,location,author,
      numPlazas,description,price,category )
      .subscribe({
        next: (data) => {
          localStorage.setItem('eventName', data.name);

          this.presentAlert("Evento creado", "El evento se ha creado correctamente")
         this.closeModal();
      },
      error: err => {
        if((location == '' || location == undefined || location == null)
        && (category=='' || category == undefined || category == null)
        && (date=='' || date == undefined || date == null)){
        this.presentAlert("Error al crear el evento", "Debes rellenar todos los campos")
        console.error(err);
      }
    }

      
  });

}

async presentAlert(header: string, message: string) {
  const alert = await this.alertController.create({
    cssClass: "",
    header: header,
    message: message,
    buttons: ["OK"]
  });
  await alert.present();
  const { role } = await alert.onDidDismiss();
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
  
  closeModal(){
    this.modal.dismiss();
  }

}
