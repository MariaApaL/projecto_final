import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import * as e from 'express';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.page.html',
  styleUrls: ['./forgot-pass.page.scss'],
})
export class ForgotPassPage implements OnInit {

  form:FormGroup
  constructor(private auth:AuthService,
    private navCtl:NavController, private formBuilder: FormBuilder, private alertCtrl:AlertController ) { 
      this.form = this.formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.email])],
        
      });
    }

  ngOnInit() {

  }
//Para resetear la contraseña
  resertPassword(){
    const email = this.form.value.email.toLowerCase();
    this.auth.forgotPassword(email).subscribe({
        next: (data) => {
      
          this.navCtl.navigateBack('/login');

        },
        error: (err) => {
        
          this.presentAlert("Error", "No se ha podido enviar el email de recuperación de contraseña");
        }
      });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      cssClass: "",
      header: header,
      message: message,
      buttons: ["OK"]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
  }
  

}
