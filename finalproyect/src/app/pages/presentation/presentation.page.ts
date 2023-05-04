import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.page.html',
  styleUrls: ['./presentation.page.scss'],
})
export class PresentationPage implements OnInit {
  slides: any[] = [];
  content?: string;

  rol = localStorage.getItem('userRole');
 


  constructor(
    private router: Router,
    private navCtrl: NavController,  
    private auth: AuthService) { 
      //Si el usuario esta ya loggeado, se redirige a la pagina principal
    
      this.checkRole(this.rol);
  
    } 
    
     
    
  
  ngOnInit() {
    
    
    

    this.slides= [
      { id: 1, img_no: '../../../../assets/events/bbq.svg', title:"Descubre  eventos"},
      { id: 2, img_no: '../../../../assets/events/woman.svg', title:"Crea tus propios eventos"},
      { id: 3, img_no: '../../../../assets/events/friends.svg', title:"Prueba nuevas experiencias"},
    ];
    
   
  }

 

  goToLogin(){
    this.navCtrl.navigateForward("/login");
  }


  checkRole(rol: string) {
   

    if(rol != null){
     
    if (rol.includes("ROLE_ADMIN")) {

      this.router.navigate(['/home-admin'], { replaceUrl: true });
    } else {

      this.router.navigate(['/home/main'], { replaceUrl: true }); //Replace url borra el historial para evitar errores de navegacion
    }
  }
  }
}

