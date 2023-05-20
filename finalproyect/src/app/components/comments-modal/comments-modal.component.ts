import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { error } from 'console';
import { is } from 'date-fns/locale';
import { CommentsInterface } from 'src/app/interfaces/comments';
import { EventsInterface } from 'src/app/interfaces/event';
import { UsersInterface } from 'src/app/interfaces/user';
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

  comments: CommentsInterface[] = [];
  //  commentAuthor: string;
  participants: any[] = [];
  isParticipant: boolean = false;
  commentAuthors: any = {};
  eventDate: Date;
  isValued: boolean;
  commentUser: UsersInterface;
  value:number;
  resultStars:number[];


  async ngOnInit() {

    this.getComments();
    this.getParticipants();
    this.getEvent();
    this.getEventValuationsByAuthor(this.eventId, this.userId);

  }


  ionViewDidEnter() {
    this.getComments();
    this.getEventValuationsByAuthor(this.eventId, this.userId);
  }



  dismiss() {
    this.modalCtrl.dismiss();
  }

  //obtenemos id de los creadores de los comentarios del evento
  getComments() {
    this.eventService.getComments(this.eventId).subscribe(
      res => {

        this.comments = Object.values(res);
        console.log('comments', this.comments)

        //recorremos el array de comentarios y obtenemos el id del autor de cada comentario
        const authorIds = this.comments.map(comment => comment.author);
        //recorremos el array de ids de autores y obtenemos el nombre de cada autor
        for (const authorId of authorIds) {

          //obtenemos el nombre del autor del comentario
          this.auth.getUserById(authorId).subscribe({
            next: (res: UsersInterface) => {

              this.commentUser = res;
              // this.commentAuthors[authorId] = res.user; 

            }
          });
        }
      }
    );
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
  addComments() {


    this.eventService.addComments(this.eventId, this.userId, this.comment).subscribe(
      res => {

        this.addValorations(this.eventId, this.userId);
        this.ionViewDidEnter();
        this.comment = '';
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

  addValorations(eventId: string, userId: string) {
    const finalValue = this.selectedValue;
    this.eventService.addValuation(eventId, userId, finalValue).subscribe(
      res => {
        this.ionViewDidEnter();
      }
    )
  }

  getRange(value:number) {
    this.resultStars = Array(value).fill(0);
  }
  getEventValuationsByAuthor(eventId: string, authorId: string) {
    this.eventService.getEventValuationsByAuthor(eventId, authorId).subscribe(
      res => {
        if (res.valuations.length > 0) {
          // Si valoraciones tiene al menos una valoración, el usuario ha valorado el evento
          this.isValued = true;
          const firstValuation = res.valuations[0];
          this.value = firstValuation.value;
          console.log('value', this.value);
  
          this.getRange(this.value); // Llamar a getRange() cuando se obtenga el valor
        } else {
          // Si valoraciones está vacío, el usuario no ha valorado el evento
          this.isValued = false;
        }
      }
    );
  }
}