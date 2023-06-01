import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { PrivacyModalComponent } from '../privacy-modal/privacy-modal.component';



@Component({
  selector: 'app-bottom-sheet-modal',
  templateUrl: './bottom-sheet-modal.component.html',
  styleUrls: ['./bottom-sheet-modal.component.scss'],
})
export class BottomSheetModalComponent implements OnInit {

  //Array del contenido del modal 
  options = [
    { icon: "pencil-outline", label: 'Editar Perfil', redirectTo: '' },
    { icon: "lock-closed-outline", label: 'Privacidad'},
    { icon: "log-out-outline", label: 'Cerrar Sesión'},
  ];


  constructor(
    private alertCtrl: AlertController, 
    private auth: AuthService, 
    private navCtrl:NavController,
    private modalCtrl: ModalController
    ) { }

  ngOnInit() { }

  //Función para mostrar una alerta solo cuando el usuario quiere cerrar sesión
  //y pulse el botón de cerrar sesión
  chooseOptions(item:any) {
    if (item.label === 'Cerrar Sesión') {
      this.logOut(item);
    }else if(item.label === 'Privacidad'){
      this.modalCtrl.dismiss();
      this.openPrivateModal(item)
    }else{
      this.modalCtrl.dismiss();
      this.navCtrl.navigateRoot('/edit-profile');
      // this.openEditModal(item)
     
    }
  }


  //Función para mostrar la alerta
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.modalCtrl.dismiss();
            
          }
        }, {
          text: 'Sí',
          handler: () => {
            this.auth.logOut();
            this.modalCtrl.dismiss();
            this.navCtrl.navigateBack('/login');
            
          }
        }
      ]
    });

    await alert.present();
  }

  //Función para mostrar una alerta solo cuando el usuario quiere cerrar sesión
  //y pulse el botón de cerrar sesión
  logOut(item:any){
      this.presentAlert();
  }

  //Funcion para abrir el modal de privacidad
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