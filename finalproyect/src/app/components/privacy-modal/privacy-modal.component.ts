import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ChangeUserComponent } from '../change-user/change-user.component';
import { ChangeEmailComponent } from '../change-email/change-email.component';
import { PoliticsComponent } from '../politics/politics.component';

@Component({
  selector: 'app-privacy-modal',
  templateUrl: './privacy-modal.component.html',
  styleUrls: ['./privacy-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrivacyModalComponent implements OnInit {

  //recogemos el item que nos mandan desde el bottom-sheet-modal
  @Input() item: any;
  
  //variable para guardar el rol del usuario
  admin = localStorage.getItem("userRole");
  //variable para saber si el usuario es admin o no
  isAdmin= false;
  constructor(
    private modalCtrl: ModalController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private navCtrl:NavController,
    private eventService:EventService) { }

  ngOnInit() {
    if(this.admin === "ROLE_ADMIN"){
      this.isAdmin = true;
    }
  }

  //array de opciones para el bottom-sheet
  options = [
    { icon: "lock-open-outline", label: 'Cambiar Contraseña', redirectTo: '' },
    { icon: "mail-outline", label: 'Cambiar Email', redirectTo: '' },
    { icon: "person-outline", label: 'Cambiar Usuario', redirectTo: '' },
    {icon: "document-text-outline", label: 'Términos y Condiciones', redirectTo: ''}
  ];
  

  //Función para mostrar un model dependiendo de la opción que elija el usuario
  chooseOptions(item:any) {
    if (item.label === 'Cambiar Contraseña') {
      this.openChangePasswordModal(item);
    }else if(item.label === 'Cambiar Email'){
      
      this.openChangeEmailModal(item);
    }else if(item.label === 'Cambiar Usuario'){
      this.openChangeUserModal(item);
     
    }else{
      this.openTermsModal(item);
    }
  }

  //Función para cerrar el modal
  closeModal() {
    this.modalCtrl.dismiss();
  }

  //Función para abrir modal de cambiar contraseña
  openChangePasswordModal(item:any){  
    this.modalCtrl.create({
      component: ChangePasswordComponent,
      componentProps: {
        item: item
      }
    }).then(modal => modal.present());
  }
  
  //Función para abrir modal de cambiar usuario
  openChangeUserModal(item:any){
    this.modalCtrl.create({
      component: ChangeUserComponent,
      componentProps: {
        item: item
      }
    }).then(modal => modal.present());
  }
   
  //Función para abrir modal de cambiar email
  openChangeEmailModal(item:any){
    this.modalCtrl.create({
      component: ChangeEmailComponent,
      componentProps: {
        item: item
      }
    }).then(modal => modal.present());
  }
  

  //Función para abrir modal de términos y condiciones
  openTermsModal(item:any){
    this.modalCtrl.create({
      component: PoliticsComponent,
    }).then(modal => modal.present());
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

  //Función para borrar el usuario y todos sus eventos, comentarios y plazas
  deleteUser(id:string){
    this.auth.updateUser(id, {deleted: true}).subscribe({
      next: user => { 
        this.deleteAllEvents(id);
        this.deleteAllComments(id);
        this.deleteAllPlazas(id);
        this.auth.logOut();
        this.modalCtrl.dismiss();
        this.navCtrl.navigateBack('/login');
        
      },error: (err) => {
        
      }
    }); 
  }

  //Función para borrar todos los eventos del usuario
  deleteAllEvents(id:string){
    this.eventService.deleteEventsByAuthor(id).subscribe();
  }
 //Función para borrar todos los comentarios del usuario
  deleteAllComments(id:string){
   this.eventService.deleteUserValuations(id).subscribe();
  }

  //Función para borrar todas las plazas del usuario
  deleteAllPlazas(id:string){
    this.eventService.deleteUserPlazas(id).subscribe();
  }


}
