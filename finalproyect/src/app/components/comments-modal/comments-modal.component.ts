import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { is } from 'date-fns/locale';
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
   isEmpty = false;
   comments: any[] = [];
   commentAuthor: string;
   participants: any[] = [];
   isParticipant: any;
   
   onCommentChange(event: any) {
    this.comment = event.target.value;
    this.isEmpty = false;
  }
  ngOnInit() {

    this.getComments();
    this.getCommentAuthor(this.commentAuthor);
  }
  
  
  ionViewDidEnter(){
    this.getComments();
  }



  dismiss(){
    this.modalCtrl.dismiss();
  }

  getComments(){
    this.eventService.getComments(this.eventId).subscribe(
      res => {
        console.log(res);
        this.comments = Object.values(res);
        const authorIds = this.comments.map(comment => comment.author);
        for (const authorId of authorIds) {
          this.getCommentAuthor(authorId);
          }
          
      }
    )

  }

  // getParticipants(){
  //   this.eventService.getParticipants(this.eventId).subscribe(
  //     res => {
  //       this.participants = Object.values(res);
  //       console.log("participants",res);

  //       // Comprueba si el userId está en la lista de participantes
  //       if (this.participants.includes(this.userId)) {
  //         console.log("El usuario está apuntado al evento");
  //         this.isParticipant = true;
  //       } else {
  //         console.log("El usuario no está apuntado al evento");
  //         this.isParticipant = false;
  //       }
  //     }
  //   )

  // }
  addComments(){ 

    
    this.eventService.addComments(this.eventId,this.userId,this.comment).subscribe(
      res => {
        this.ionViewDidEnter();
      }
    )
    
  }


  
  getCommentAuthor(authorId: any){
   
    this.auth.getUserById(authorId).subscribe(
      res => {
        this.commentAuthor = res.name;
        console.log(this.commentAuthor)
      }
    );

}

}