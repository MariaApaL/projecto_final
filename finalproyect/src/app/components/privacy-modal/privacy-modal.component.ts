import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-privacy-modal',
  templateUrl: './privacy-modal.component.html',
  styleUrls: ['./privacy-modal.component.scss'],
})
export class PrivacyModalComponent implements OnInit {

  //recogemos el item que nos mandan desde el bottom-sheet-modal
  @Input() item: any;
  
  constructor(
    private modalCtrl: ModalController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private navCtrl:NavController,) { }

  ngOnInit() {}

  options = [
    { icon: "lock-open-outline", label: 'Cambiar Contraseña', redirectTo: '' },
    { icon: "mail-outline", label: 'Cambiar Email', redirectTo: '' },
    { icon: "mail-outline", label: 'Cambiar Usuario', redirectTo: '' },
  ];
  
  closeModal() {
    this.modalCtrl.dismiss();
  }

   //Función para mostrar una alerta solo cuando el usuario quiere borrar la cuenta
   delete(){
    this.presentAlert();
  }

   //Función para mostrar la alerta
   async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Borrar Cuenta',
      message: '¿Estás seguro de que quieres borrar tu cuenta?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sí',
          handler: () => {
           const id =  localStorage.getItem("userId");
            this.auth.updateUser(id, {deleted: true}).subscribe({
              next: user => { 
                this.auth.logOut();
                this.modalCtrl.dismiss();
                this.navCtrl.navigateBack('/login');
                console.log(user);
              },error: (err) => {
                console.log(err);
              }
            }); 
          }
        }
      ]
    });

    await alert.present();
  }

 
}
