import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BottomSheetModalComponent } from 'src/app/components/bottom-sheet-modal/bottom-sheet-modal.component';


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.page.html',
  styleUrls: ['./user-page.page.scss'],
})
export class UserPagePage implements OnInit {

  slideOpts = {};
  stories: any[] = [];
  buttonValue = 'grid';
  buttonItems: any[] = [];
  posts: any[] = [];

  constructor(private modalCtrl: ModalController) {}
  ngOnInit() {
    
  
    this.buttonItems = [
      {value: 'grid', icon: 'grid'},
      {value: 'reels', icon: 'film'},
      {value: 'photos', icon: 'images'},
    ];
    
  }
  

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: BottomSheetModalComponent,
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.5
    });
    await modal.present();
  }



  buttonsChanged(event) {
    console.log(event.detail.value);
    this.buttonValue = event.detail.value;
  }

}

