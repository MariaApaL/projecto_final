import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';


// import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public form: FormGroup;

 //Para el icono del ojo en la contraseña
  hide = false;

  
  
  constructor(private router: Router,
    private auth:AuthService,
    private navCtrl: NavController,
    private alertController: AlertController) { 

    this.form = new FormGroup({
      user: new FormControl('',[Validators.required, Validators.maxLength(20)]),
      name: new FormControl('',[Validators.required, Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      // age: new FormControl('',[Validators.required, Validators.min(18), Validators.max(110)]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=(?:.*\d))(?=.*[A-Z])(?=.*[a-z])(?=.*[.,*!?¿¡/#$%&])\S{8,30}$/
      )]),
      rpassword: new FormControl('', [Validators.required])
    })
  }

  email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  
  passwordIcon = 'eye-off';
  passwordType = 'password';




  ngOnInit() {
    
    console.log(this.form.controls.email.touched);
     
  }

 

  // Método para el icono del ojo en la contraseña
  passwordOn() {
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }


  checkPassword(){
    const password = this.form.controls.password.value;
    const confirmpassword = this.form.controls.rpassword.value;

    return password === confirmpassword ? true : false;
  }
 
  onRegister(){

    if(this.form.valid){
    const user = this.form.controls.user.value.trim().toLowerCase();
    const password = this.form.controls.password.value.trim();
    const rpassword = this.form.controls.rpassword.value.trim();
    const name = this.form.controls.name.value.trim();
    const email = this.form.controls.email.value.trim().toLowerCase();
    this.auth.register(user, name, password, email).subscribe({
      next: res => {
        console.log(res); 
        this.auth.logOut();
        this.loginUser(name, password);
        this.router.navigate(['/home/main'], {replaceUrl:true});
      },
      error: err => {
        this.presentAlert("Error al registrarse", err.error.message )
        console.error(err);}
    })

  
  }else{
    alert('Debe registrar todos los valores.');
  }
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
   
  }

  loginUser(user:string,password:string){
    
        this.auth.login(user, password).subscribe({
          next: res => {

         // Guardamos el token en el localStorage
         localStorage.setItem('token', res.accessToken);
         // Guardamos el rol del usuario en el localStorage
          localStorage.setItem('userRole', res.role);
        
         // Guardamos el id del usuario en el localStorage
         localStorage.setItem('userId', res.id);
         console.log("Login correcto");
          },
          error: err => {
              
            console.error(err);
          }
        })
  }

  loginDisabled(){
    if(this.form.controls.user.valid && this.form.controls.password.value != ''){
      return false
    }

    return true;
  }

  


}
