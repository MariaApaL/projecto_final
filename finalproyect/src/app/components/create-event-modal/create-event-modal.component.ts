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


  newCategory: string = "";

  public form: FormGroup;
  
 currentDate :string;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  image: any;

  categories =[
    { label: 'Cultura', value: 'cultura', checked: false },
    { label: 'Deportes', value: 'deportes', checked: false },
    { label: 'Gastronomía', value: 'gastronomia', checked: false },
    { label: 'Ocio', value: 'ocio', checked: false },
    { label: 'Solidario', value: 'solidario', checked: false },
    { label: 'Relax', value: 'relax', checked: false },

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
      eventname: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z]).+$/), Validators.minLength(10), Validators.maxLength(40)]),
      date: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z]).+$/), Validators.maxLength(300)]),
      plazas: new FormControl('', [Validators.required, Validators.pattern(/^(?!0$)[1-9][0-9]{0,2}$/),Validators.maxLength(3)]),
      price: new FormControl('', [ Validators.required, Validators.pattern(/^(?!.*[.,]$)(?!^[-+])(?!^0[.,])(?!^0+$)\d{1,3}(?:\.\d{1,2})?$/),Validators.maxLength(3)]),
      category: new FormControl('', [Validators.required])
    })
  
  }


  
  
  createEvent() {
    if (this.form.valid) {
      const name = this.form.value.eventname.toLowerCase();
      const date = this.form.value.date;
      const description = this.form.value.description;
      const numPlazas = this.form.value.plazas;
      const price = this.form.value.price;
      const category = this.form.value.category.toLowerCase();
      console.log(category);
      const location = this.autocomplete.input;
      const author = localStorage.getItem('userId');
      const image = this.image;
      const currentDate = new Date();
      const minimumDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      const maximumDate = new Date(currentDate.getTime() + 365 * 24 * 60 * 60 * 1000);
      const eventDate = new Date(date);
  
      if (eventDate < minimumDate) {
        // La fecha del evento es menor a la fecha mínima permitida
        this.presentAlert("Error al crear el evento", "La fecha debe ser al menos 24 horas a partir de la fecha actual");
        return;
      }
  
      if (eventDate > maximumDate) {
        // La fecha del evento es mayor a un año a partir de la fecha actual
        this.presentAlert("Error al crear el evento", "La fecha no puede ser mayor a un año a partir de la fecha actual");
        return;
      }

      if(image == '' || image == undefined || image == null){
        this.presentAlert("Error al crear el evento", "Debes subir una imagen");
        return;
      }
  
      this.eventService.createEvent(name, date, location, author, numPlazas, description, price, category)
        .subscribe({
          next: (data) => {
            console.log(data);
            console.log(data.event._id);
            this.presentAlert("Evento creado", "El evento se ha creado correctamente");
            this.uploadPicture(data.event._id);
            this.closeModal();
          },
          error: err => {
            if ((location == '' || location == undefined || location == null) &&
              (date == '' || date == undefined || date == null) &&
              (image == '' || image == undefined || image == null)) {
              this.presentAlert("Error al crear el evento", "Debes rellenar todos los campos");
              console.error(err);
            } else {
              this.presentAlert("Error al crear el evento", err.error.message);
              console.error(err);
            }
          }
        });
    } else {
      this.presentAlert("Error al crear el evento", "Debes rellenar todos los campos");
    }
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

  onImageChange(event) {
    const file = event.target.files[0];
    this.image = file;
    console.log(file);
  }

uploadPicture(eventId: string) {
  this.eventService.uploadEventPhoto(eventId, this.image).subscribe({
    next: (data) => {
      console.log(data);
    }
  });

}

}
