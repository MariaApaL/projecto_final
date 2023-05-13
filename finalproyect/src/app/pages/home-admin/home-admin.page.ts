import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { PrivacyModalComponent } from 'src/app/components/privacy-modal/privacy-modal.component';

import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit {
  content?: string;

  constructor(private auth:AuthService, 
    private navCtrl:NavController,
    private modalCtrl:ModalController) { }

  options = [
    { label: 'Panel de Admin', redirectTo: '' },
    { label: "Estadísticas"},
    { label: "Usuarios"},
    { label: "Privacidad"},
  ];

  date:Date;

  ngOnInit(): void {
   
  }


  logOut(){
    this.auth.logOut();
    this.navCtrl.navigateBack('/login');
}

chooseOptions(item: any) {
  switch (item.label) {
    case 'Panel de Admin':
      this.navCtrl.navigateRoot('/home-admin');
      break;
    case 'Privacidad':
      this.openPrivateModal(item);
      break;
    case 'Estadísticas':
      this.navCtrl.navigateRoot('/home-admin/statistics');
      break;
   
    default:'Usuarios'
      this.openUsersModal(item);
      break;
      
  }
}
  openUsersModal(item: any) {
    throw new Error('Method not implemented.');
  }



async openPrivateModal(item) {
  this.modalCtrl.dismiss();
  const modal = await this.modalCtrl.create({
    component: PrivacyModalComponent,
    componentProps: {
      item: item,
      cssClass: 'modal-privacy'
    }
  });
  return await modal.present();
}


}
