import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { error } from 'console';
import * as e from 'express';
import { UsersInterface } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss'],
})
export class ChangeEmailComponent implements OnInit {

// formulario
  form:FormGroup;
  // id del usuario
  userId = localStorage.getItem('userId');
  // email del usuario
  userEmail:UsersInterface;

  constructor(private modal:ModalController,
    private auth:AuthService,
    private  formBuilder: FormBuilder, private alert:AlertController) { 
      this.form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
      
      });
    }


  ngOnInit() {
    this.getUser();
  }


  closeModal(){
    this.modal.dismiss();
  }

// funcion para actualizar el email
  update() {
    
    const email = this.form.value.email.trim().toLowerCase();
    const updatedData = { email: email };
    if (this.form.valid && email != this.userEmail) {
      this.auth.updateUser(this.userId, updatedData).subscribe({
        next: data => {
        
          this.modal.dismiss();
       
        },
        error: error => {
          this.presentAlert("Error", error.error.message);
        }
      });
    } else {
      this.presentAlert("Error", "El email es el mismo que el actual");
    }
  }

  // funcion para obtener el email del usuario
  getUser(){
    this.auth.getUserById(this.userId).subscribe((data)=>{
     
      this.userEmail=data.email;
    }
    )
  }
  

  async presentAlert(header: string, message: string) {
    const alert = await this.alert.create({
      cssClass: "",
      header: header,
      message: message,
      buttons: ["OK"]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
  }

}
