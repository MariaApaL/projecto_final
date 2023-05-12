import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
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

  constructor(private modalCtrl:ModalController, 
    private eventService:EventService,
    navParams: NavParams, private auth: AuthService) { 
      this.eventId = navParams.get('eventId')

   }


   eventId: string;
   userId = localStorage.getItem('userId');
   comment: string;
   isDisabled = true;
   comments: CommentsInterface[] = [];
  //  commentAuthor: string;
   participants: any[] = [];
   isParticipant: boolean = false;
   commentAuthors: any ={};
    eventDate: Date; 
   
   
  ngOnInit() {

    this.getComments();
    this.getParticipants();
    this.getEvent();
    
  }
  
  
  ionViewDidEnter(){
    this.getComments();
  }



  dismiss(){
    this.modalCtrl.dismiss();
  }

  //obtenemos id de los creadores de los comentarios del evento
  getComments(){
    this.eventService.getComments(this.eventId).subscribe(
      res => {
        console.log(res);
        this.comments = Object.values(res);
        console.log('comment',this.comments);
     //recorremos el array de comentarios y obtenemos el id del autor de cada comentario
        const authorIds = this.comments.map(comment => comment.author);
        //recorremos el array de ids de autores y obtenemos el nombre de cada autor
        for (const authorId of authorIds) {
          console.log("userId",authorId);
          //obtenemos el nombre del autor del comentario
          this.auth.getUserById(authorId).subscribe({
            next: async (res:UsersInterface) => {
              this.commentAuthors[authorId] = res.name; // Almacenamos el nombre del autor en el objeto commentAuthors
              console.log(this.commentAuthors);
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
        console.log("participants",res);
  
        // Busca si el userId está en la lista de participantes
        const foundParticipant = this.participants.find(participant => participant._id === this.userId);
        if (foundParticipant) {
          console.log("El usuario está apuntado al evento");
          this.isParticipant = true;
        } else {
          console.log("El usuario no está apuntado al evento");
          this.isParticipant = false;
        }
      }
    );
  }

  //añade comentarios
  addComments(){ 

    
    this.eventService.addComments(this.eventId,this.userId,this.comment).subscribe(
      res => {
        this.ionViewDidEnter();
      }
    )
    
  }

  //obtenemos la fecha del evento
  getEvent(){
    this.eventService.getEvent(this.eventId).subscribe({
      next: (res:EventsInterface) => {
       
        this.eventDate = res.date;
        console.log('fecha',this.eventDate);
    }
    });
  }


  // onCommentChange(event: any) {
  //   this.comment = event.target.value;
  //  if ( this.comment.trim().length === 0 && !this.isParticipant && this.eventDate > new Date()) {
  //   this.isDisabled = true;
  //   }else if(this.comment.trim().length === 0 && this.isParticipant && this.eventDate < new Date()){
  //     this.isDisabled = true;

  //   }else{
  //     this.isDisabled = false;
  //   }
  // }
  onCommentChange(event: any) {
    event.target.disabled = true;
    this.comment = event.target.value;
    const eventDate = new Date(this.eventDate);
    const currentDate = new Date();
    console.log('currentDate',currentDate); 
    switch (true) {
      case !this.isParticipant:
        console.log('entra en 1');
        this.isDisabled = true;
        event.target.disabled = true;
        break;
      case this.comment === '' && this.isParticipant:
        console.log('entra en 2');
        this.isDisabled = true;
        event.target.disabled = false;
        break;
      case this.comment === '' && this.isParticipant && eventDate < currentDate:
        console.log('entra en 3');
        this.isDisabled = true;
        event.target.disabled = false;
        break;
      case this.comment === '' && this.isParticipant && eventDate > currentDate:
        console.log('entra en 4');
        this.isDisabled = true;
        event.target.disabled = true;
        break;
        case this.isParticipant && eventDate > currentDate:
        console.log('entra en 5');
        this.isDisabled = true;
        event.target.disabled = true;
        break;
      default:
        console.log('entra en 6');
        this.isDisabled = false;
        event.target.disabled = false;
        break;
    }
  }

}