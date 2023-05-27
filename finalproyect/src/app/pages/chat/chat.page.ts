import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { UsersInterface } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  receiverId: string; 
  receiver:UsersInterface;
  transmitter:UsersInterface;
  transmitterId:string = localStorage.getItem('userId');
  text:string;

  constructor(private route:ActivatedRoute, private auth:AuthService, private chat:ChatService) { }




  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.receiverId =  params.get('id');
      //Ya tenemo el id de la URL guardado en una variable 
    });

    this.getReceiverId();
  }



  getReceiverId(){
    this.auth.getUserById(this.receiverId).subscribe({
      next: (data) => {
        console.log(data);
        this.receiver=data;
      }
      });
  }


  sendMessage(){
    this.chat.send(this.transmitterId, this.receiverId, this.text).subscribe({
      next: (data) => {
        console.log(data);
        this.text = '';
      }
      });

  }

  onCommentChange(event: any) {


    this.text = event.target.value;

  }
}
