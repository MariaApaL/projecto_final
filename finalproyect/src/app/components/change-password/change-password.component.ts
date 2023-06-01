import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { UsersInterface } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  // formulario
  form:FormGroup;
  // id del usuario
  userId = localStorage.getItem('userId');
  // icono del password
  passwordIcon = 'eye-off';
  
  passwordType = 'password';


  constructor(private modal:ModalController,
    private auth:AuthService,
    private  formBuilder: FormBuilder, private alert:AlertController) { 
      this.form = this.formBuilder.group({
        password: new FormControl('', [Validators.required, Validators.pattern(/^(?=(?:.*\d))(?=.*[A-Z])(?=.*[a-z])(?=.*[.,*!?¿¡/#$%&])\S{8,30}$/
        )]),
        rpassword: new FormControl('', [Validators.required])
      });
    }


  ngOnInit() {
   
  }


  closeModal(){
    this.modal.dismiss();
  }


  // funcion para actualizar la contraseña
  update() {
    const password = this.form.value.password;
    const updatedData = { password: password};
    if (this.form.valid && password === this.form.value.rpassword) {
      this.auth.updateUser(this.userId, updatedData).subscribe({
        next: data => {
        
          this.modal.dismiss();
        
        },
        error: error => {
          this.presentAlert("Error", error.error.message);
        }
      });
    } else {
      this.presentAlert("Error", "El usuario es el mismo que el actual");
    }
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


  passwordOn() {
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }








}
