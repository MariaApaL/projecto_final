import { Component, NgZone, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';


declare let google: any;

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {


// Array de categorias
  categories =[
    { label: 'Cultura', value: 'cultura', checked: false },
    { label: 'Deportes', value: 'deportes', checked: false },
    { label: 'Gastronomía', value: 'gastronomia', checked: false },
    { label: 'Ocio', value: 'ocio', checked: false },
    { label: 'Solidario', value: 'solidario', checked: false },
    { label: 'Relax', value: 'relax', checked: false },

  ]

    //datos del evento
    name: string;
    description: string;
    date: Date;
    location: string;
    newLocation: string;
    price: number;
    numPlazas: number;
    category: string;
    image: any;
    form: FormGroup;
  
    //recoge valores iniciales del formulario
    formInitialValues: any;
    imagePreview: string; 
  
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
  eventDate: any;
  

  constructor( public zone: NgZone,
    private route: ActivatedRoute, 
    private eventService: EventService, 
    private navCtrl: NavController,
    private  formBuilder: FormBuilder,
    public alertController: AlertController
  ) {
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('id');
      //Ya tenemo el id de la URL guardado en una variable 
    });

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];

    // this.form = this.formBuilder.group({
    //   name: ['', [ Validators.pattern(/^(?=.*[a-zA-Z]).+$/), Validators.minLength(10), Validators.maxLength(40)]],
    //   description: ['', [ Validators.pattern(/^(?=.*[a-zA-Z]).+$/), Validators.maxLength(300)]],
    //   numPlazas: ['', [ Validators.pattern(/^(?!0$)[1-9][0-9]{0,2}$/), Validators.maxLength(3)]],
    //   price: ['', [Validators.pattern(/^(?!.*[.,]$)(?!^[-+])(?!^0[.,])(?!^0+$)\d{1,3}(?:\.\d{1,2})?$/), Validators.maxLength(3)]],
    //   category: [''],
    //   date: ['']
    // });

    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z]).+$/), Validators.minLength(10), Validators.maxLength(40)]),
      date: new FormControl(''),
      description: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z]).+$/), Validators.maxLength(300)]),
      numPlazas: new FormControl('', [Validators.required, Validators.pattern(/^(?!0$)[1-9][0-9]{0,2}$/),Validators.maxLength(3)]),
      price: new FormControl(0, 
      [Validators.required,
      Validators.pattern(/^\d{1,3}(\.\d{1,2})?$/),
      Validators.maxLength(3),
      Validators.min(0),]),
      category: new FormControl('')
    })
  }



  ngOnInit() {
    //Nos suscribimos a los cambios del formulario
    this.subscribeToFormChanges();
    this.formInitialValues = { ...this.form.value };

    //Obtenemos los datos del evento
   this.eventService.getEvent(this.eventId).subscribe({
      next: (data) => {
        this.eventData = data;
        this.eventDate = moment(this.eventData.date).format("YYYY-MM-DDTHH:mm");
        this.imagePreview = this.eventData.picture;
    
       // para mostrar los datos de la base de datos actualmente
        this.form.patchValue({
          name: this.eventData.name,
          description: this.eventData.description,
          numPlazas: this.eventData.numPlazas,
          price: this.eventData.price,
          category: this.eventData.category,
          date: this.eventDate
          
        });
   

      
      }

  });
  }

//Para saber si el formulario ha cambiado de valores en algun campo
  subscribeToFormChanges() {
    this.form.valueChanges.subscribe(() => {
      this.disableButton = false;
    });
  }

  get f() {
    return this.form.controls;
  }
  

  navigateback() {
    this.navCtrl.navigateBack('/home/user-page');
  }

//recoge el valor del campo "location"
  onLocationChange(event: any) {
    this.location = this.autocomplete.input;
    this.newLocation = this.location;
     this.newLocation = event.target.value;
  }

  isFormChanged() {
    const formValues = this.form.value;
    return JSON.stringify(formValues) !== JSON.stringify(this.formInitialValues);
  }

  //actualizar el evento
  saveChanges() {
  
      const formDate = this.form.value.date;
      const eventDate = this.eventDate;

      if (!this.isFormChanged()) {
        // No se realizaron cambios en el formulario, se puede salir de la función
        return;
      }

      if (this.form.invalid) {
        // Si el formulario es inválido, muestra una alerta o realiza alguna acción según tu requerimiento
        this.presentAlert("Error", "Por favor, completa todos los campos correctamente.");
        return;
      }

      if (formDate !== eventDate) {
        const currentDate = new Date();
        const minimumDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        const maximumDate = new Date(currentDate.getTime() + 365 * 24 * 60 * 60 * 1000);
      
        const selectedDate = new Date(formDate);
      
        if (selectedDate < minimumDate) {
          // La fecha del evento es menor a la fecha mínima permitida
          this.presentAlert("Error al actualizar", "La fecha debe ser al menos 24 horas a partir de la fecha actual");
          return;
        }
      
        if (selectedDate > maximumDate) {
          // La fecha del evento es mayor a un año a partir de la fecha actual
          this.presentAlert("Error al actualizar", "La fecha no puede ser mayor a un año a partir de la fecha actual");
          return;
        }
      }
    
        const updatedData = {
        name: this.form.value.name,
        description: this.form.value.description,
        date: formDate,
        location: this.newLocation,
        price: this.form.value.price,
        numPlazas: this.form.value.numPlazas,
        category: this.form.value.category
      };
      
      if (this.image != null) {
        this.uploadPicture(this.eventId);
      }
      
      this.eventService.updateEvent(this.eventId, updatedData).subscribe({
        next: (data) => {
          this.navCtrl.navigateBack('/home/user-page');
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


// google maps places autocomplete
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

  this.autocompleteItems = [];

}

// Para recoger la imagen seleccionada
onImageChange(event: any) {
  const file = event.target.files[0];
  this.image = file;

  // Código para generar una vista previa de la imagen seleccionada
  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result as string;
  };
  reader.readAsDataURL(file);
}

// Para abrir el explorador de archivos
openFileInput() {
  document.getElementById('fileInput').click();
}

// Para subir la imagen al servidor
uploadPicture(eventId: string) {
  this.eventService.uploadEventPhoto(eventId, this.image).subscribe();
}

}


