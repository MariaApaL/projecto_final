import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-privacy-modal',
  templateUrl: './privacy-modal.component.html',
  styleUrls: ['./privacy-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrivacyModalComponent implements OnInit {

  //recogemos el item que nos mandan desde el bottom-sheet-modal
  @Input() item: any;
  
  constructor(
    private modalCtrl: ModalController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private navCtrl:NavController,
    private eventService:EventService) { }

  ngOnInit() {}

  options = [
    { icon: "lock-open-outline", label: 'Cambiar Contraseña', redirectTo: '' },
    { icon: "mail-outline", label: 'Cambiar Email', redirectTo: '' },
    { icon: "person-outline", label: 'Cambiar Usuario', redirectTo: '' },
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
           this.deleteUser(id); 
          }
        }
      ]
    });

    await alert.present();
  }

  deleteUser(id:string){
    this.auth.updateUser(id, {deleted: true}).subscribe({
      next: user => { 
        this.deleteAllEvents(id);
        this.deleteAllComments(id);
        this.deleteAllPlazas(id);
        this.auth.logOut();
        this.modalCtrl.dismiss();
        this.navCtrl.navigateBack('/login');
        console.log(user);
      },error: (err) => {
        console.log(err);
      }
    }); 
  }

  deleteAllEvents(id:string){
    this.eventService.deleteEventsByAuthor(id).subscribe({
      next: events => {
        console.log("eventos eliminados");
      }
    });
  }

  deleteAllComments(id:string){
   this.eventService.deleteUserValuations(id).subscribe({
      next: comments => { 
        console.log("comentarios eliminados");
      }
    });
  }

  deleteAllPlazas(id:string){
    this.eventService.deleteUserPlazas(id).subscribe({
      next: plazas => { 
        console.log("plazas eliminadas");
      }
    });
  }


}
