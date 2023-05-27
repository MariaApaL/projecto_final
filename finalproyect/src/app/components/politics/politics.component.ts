import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-politics',
  templateUrl: './politics.component.html',
  styleUrls: ['./politics.component.scss'],
})
export class PoliticsComponent implements OnInit {

  constructor(public modal: ModalController) { }

  ngOnInit() {}

  closeModal(){
    this.modal.dismiss();
  }


}
