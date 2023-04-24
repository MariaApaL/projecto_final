import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {

  constructor() { }

  name:string;
  description:string;
  date:Date;
  location:string;
  price:number;
  numPlazas:number;
  category:string;
  

  ngOnInit() {
  }

}
