// import { AuthService } from './../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //Nuestro Formulario
  public form: FormGroup;

// Para obtener el rol del usuario
  roles: string[] = [];

  toggleValue: boolean = false;

  constructor(private router: Router,
    private auth: AuthService,
    private alertController: AlertController) {

    this.form = new FormGroup({
      user: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      usermail: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=(?:.*\d))(?=.*[A-Z])(?=.*[a-z])(?=.*[.,*!?¿¡/#$%&])\S{8,30}$/
      )]),
    })
  }



  passwordIcon = 'eye-off';
  passwordType = 'password';




  ngOnInit() {

  }

//comprueba que las contraseñas sean iguales
  checkPassword() {
    const password = this.form.controls.password.value;
    const confirmpassword = this.form.controls.rpassword.value;

    return password === confirmpassword ? true : false;
  }

  //para el login
  onLogin() {
    const usermail = this.form.controls.usermail.value.trim().toLowerCase();
    const password = this.form.controls.password.value.trim();


    this.auth.login(usermail, password).subscribe({
      next: res => {

        
        // Guardamos el token en el localStorage
        localStorage.setItem('token', res.accessToken);
        
        // Guardamos el id del usuario en el localStorage
        localStorage.setItem('userId', res.id);
        
        //Guardamos el rol del usuario en el localStorage
       localStorage.setItem('userRole', res.roles);

       const rol = localStorage.getItem('userRole');
     
        if (rol.includes("ROLE_ADMIN")) {

          this.router.navigate(['/home-admin'], { replaceUrl: true });
        } else {

          this.router.navigate(['/home/main'], { replaceUrl: true }); //Replace url borra el historial para evitar errores de navegacion
        }

      },
      error: err => {
        this.presentAlert("Error al iniciar sesión", err.error.message)
        console.error(err);
      }
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      cssClass: "",
      header: header,
      message: message,
      buttons: ["OK"]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    
  }






}
