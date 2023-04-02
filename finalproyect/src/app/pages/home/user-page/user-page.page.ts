import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BottomSheetModalComponent } from 'src/app/components/bottom-sheet-modal/bottom-sheet-modal.component';
import { TokenStorageService } from 'src/app/services/token-storage.service';


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.page.html',
  styleUrls: ['./user-page.page.scss'],
})
export class UserPagePage implements OnInit {

  currentUser: any;

  constructor(private modalCtrl: ModalController,private token: TokenStorageService) {}
  ngOnInit() {
    this.currentUser = this.token.getUser();
    
  }
  

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: BottomSheetModalComponent,
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.5
    });
    await modal.present();
  }




}

