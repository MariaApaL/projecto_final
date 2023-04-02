// import { AuthService } from './../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public form: FormGroup;

  login: boolean = true;

  errorLog: string;
  errorLogHidden: boolean = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];


  constructor(private router: Router,
    private auth: AuthService,
    private tokenStorage:TokenStorageService,
    private navCtrl: NavController,private alertController: AlertController) {

    this.form = new FormGroup({
      user: new FormControl('', [Validators.required, Validators.minLength(3),Validators.maxLength(10)]),
      usermail: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      // age: new FormControl('',[Validators.required, Validators.min(18), Validators.max(110)]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=(?:.*\d))(?=.*[A-Z])(?=.*[a-z])(?=.*[.,*!?¿¡/#$%&])\S{8,30}$/
      )]),
    })
  }

  

  passwordIcon = 'eye-off';
  passwordType = 'password';




  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }

    console.log(this.form.controls.email.touched);

  }



  // Método para el icono del ojo en la contraseña
  // passwordOn() {
  //   this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  //   this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  // }

  segmentChanged(event: any) {
    const chose = event.detail.value;

    this.login = chose === 'login';
  }

  checkPassword() {
    const password = this.form.controls.password.value;
    const confirmpassword = this.form.controls.rpassword.value;

    return password === confirmpassword ? true : false;
  }

  onLogin() {
    const usermail = this.form.controls.usermail.value.trim().toLowerCase();
    const password = this.form.controls.password.value.trim();

    
    this.auth.login(usermail, password).subscribe({
      next: res => {
        
        this.tokenStorage.saveUser(res);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        console.log(res);
        console.log(this.tokenStorage.saveToken(res.accessToken))
        this.roles = this.tokenStorage.getUser().roles;
        if(this.roles.includes("ROLE_ADMIN")){

        this.router.navigate(['/home-admin'], { replaceUrl: true });
        }else{
           //console.log(localStorage.setItem('token', res.accessToken)) //Guardamos el token el el LocalStorage
        this.router.navigate(['/home/main'], { replaceUrl: true }); //Replace url borra el historial para evitar errores de navegacion
        }  
       
      },
      error: err => {
        this.presentAlert("Error al iniciar sesión", err.error.message )
        console.error(err);
      }
    });
  }

  async presentAlert(header: string, message: string){
    const alert = await this.alertController.create({
      cssClass:"",
      header:header,
      message:message,
      buttons:["OK"]
    });
    await alert.present();
    const{ role }= await alert.onDidDismiss();
    console.log('onDismiss resolved with role', role);
  }
    
  loginDisabled() {
    if (this.form.controls.user.valid && this.form.controls.password.value != '') {
      return false
    }

    return true;
  }




}
