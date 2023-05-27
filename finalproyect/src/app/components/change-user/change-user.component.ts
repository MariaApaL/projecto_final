import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { UsersInterface } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-user',
  templateUrl: './change-user.component.html',
  styleUrls: ['./change-user.component.scss'],
})
export class ChangeUserComponent implements OnInit {

  form:FormGroup;
  userId = localStorage.getItem('userId');
  user:UsersInterface;

  constructor(private modal:ModalController,
    private auth:AuthService,
    private  formBuilder: FormBuilder, private alert:AlertController) { 
      this.form = this.formBuilder.group({
      user: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern(/^(?=.*[a-zA-Z]).+$/)]),
       
      });
    }


  ngOnInit() {
    this.getUser();
  }


  closeModal(){
    this.modal.dismiss();
  }


  update() {
    const user = this.form.value.user.trim().toLowerCase();
    const updatedData = { user: user};
    if (this.form.valid && user != this.user) {
      this.auth.updateUser(this.userId, updatedData).subscribe({
        next: data => {
        
          this.modal.dismiss();
          console.log(data);
        },
        error: error => {
          this.presentAlert("Error", error.error.message);
        }
      });
    } else {
      this.presentAlert("Error", "El usuario es el mismo que el actual");
    }
  }

  getUser(){
    this.auth.getUserById(this.userId).subscribe((data)=>{
      console.log(data);
      this.user=data.user;
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
