import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { error } from 'console';
import { is } from 'date-fns/locale';

import { EventsInterface } from 'src/app/interfaces/event';
import { UsersInterface } from 'src/app/interfaces/user';
import { ValuationsInterface } from 'src/app/interfaces/valuation';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-comments-modal',
  templateUrl: './comments-modal.component.html',
  styleUrls: ['./comments-modal.component.scss'],
})
export class CommentsModalComponent implements OnInit {


  constructor(private modalCtrl: ModalController,
    private eventService: EventService,
    navParams: NavParams,
    private auth: AuthService,
    private alertCtrl: AlertController) {
    this.eventId = navParams.get('eventId')

  }

  selection = [
    { value: 1, checked: false },
    { value: 2, checked: false },
    { value: 3, checked: false },
    { value: 4, checked: false },
    { value: 5, checked: false }


  ]

  eventId: string;
  userId = localStorage.getItem('userId');
  comment: string;
  disabledButton = true;
  selectedValue: number;
  stars: number[];

  valuations: ValuationsInterface[] = [];
  //  commentAuthor: string;
  participants: any[] = [];
  isParticipant: boolean = false;

  commentAuthors: any = {};
  eventDate: Date;
  isValued: boolean;
 
  value:number;
  resultStars:number[];


  async ngOnInit() {

    
    this.getParticipants();
    this.getEvent();
    this.getEventValuationsByAuthor(this.eventId, this.userId);
    this.getValuations();
    if(this.selectedValue==0 || this.selectedValue==null){
      this.disabledButton=true;
    }

  }


  ionViewDidEnter() {
    this.getValuations();
    this.getEventValuationsByAuthor(this.eventId, this.userId);
  }



  dismiss() {
    this.modalCtrl.dismiss();
  }

  //obtenemos id de los creadores de los comentarios del evento
  getValuations() {
    this.eventService.getEventValuations(this.eventId).subscribe(
      res => {

        this.valuations = res.valuations;
      


          });
        }
    
  



  getParticipants() {
    this.eventService.getParticipants(this.eventId).subscribe(
      res => {
        this.participants = Object.values(res);


        // Busca si el userId está en la lista de participantes
        const foundParticipant = this.participants.find(participant => participant._id === this.userId);
        if (foundParticipant) {

          this.isParticipant = true;
        } else {

          this.isParticipant = false;
        }
      }
    );
  }

  //añade comentarios
  addValuation() {
    const finalValue = this.selectedValue;


    this.eventService.addValuation(this.eventId, this.userId,finalValue, this.comment).subscribe(
      res => {
        this.ionViewDidEnter();
        this.comment = '';
        this.stars = [];
      },
      error => {
        console.error(error);
        this.presentAlert("Error", error.error.message || 'Error al enviar el comentario');
      }
    )

  }


  //obtenemos la fecha del evento
  getEvent() {
    this.eventService.getEvent(this.eventId).subscribe({
      next: (res: EventsInterface) => {

        this.eventDate = res.date;

      }
    });
  }


  onCommentChange(event: any) {
    event.target.disabled = true;

    this.comment = event.target.value;

    const eventDate = new Date(this.eventDate);
    const currentDate = new Date();

    switch (true) {
      case !this.isParticipant:

        this.disabledButton = true;
        event.target.disabled = true;
        this.presentAlert('No puedes comentar', 'Debes estar apuntado al evento para poder comentar');
        break;
      case this.comment === '' && this.isParticipant:

        this.disabledButton = true;
        event.target.disabled = false;

        break;
      case this.comment === '' && this.isParticipant && eventDate < currentDate:

        this.disabledButton = true;
        event.target.disabled = false;
        break;
      case this.isParticipant && eventDate > currentDate:

        this.disabledButton = true;
        event.target.disabled = true;
        this.presentAlert('No puedes comentar', 'El evento aún no se ha realizado');
        break;
      
        case this.isParticipant && eventDate < currentDate && this.isValued:
          this.disabledButton = true;
          event.target.disabled = true;
          break;

      default:

        this.disabledButton = false;

        event.target.disabled = false;
        break;
    }
  }


  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      cssClass: "",
      header: header,
      message: message,
      buttons: ["OK"]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
  }


  addStars() {
    this.stars = Array(this.selectedValue).fill(0);
  }

  //obtener las estrellas de las valoraciones de un evento
  generateStars(value: number): any[] {
    return Array(value).fill(0);
  }

  getEventValuationsByAuthor(eventId: string, authorId: string) {
    this.eventService.getEventValuationsByAuthor(eventId, authorId).subscribe(
      res => {
        if (res.valuations.length > 0) {
          // Si valoraciones tiene al menos una valoración, el usuario ha valorado el evento
          this.isValued = true;  
      
        } else {
          // Si valoraciones está vacío, el usuario no ha valorado el evento
          this.isValued = false;
        }
      }
    );
  }

  delete(userId:string, valuationId:string){
    this.eventService.deleteUserValuation(userId, valuationId).subscribe({
      next: (res: any) => {
        this.ionViewDidEnter();
      }
    });
    }
  }
