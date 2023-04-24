import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

import SwiperCore, { SwiperOptions, Pagination } from 'swiper';
// install Swiper modules
SwiperCore.use([Pagination]);


@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.page.html',
  styleUrls: ['./presentation.page.scss'],
})
export class PresentationPage implements OnInit {
  slides: any[] = [];
  content?: string;
  bannerConfig!: SwiperOptions;
  featureConfig!: SwiperOptions;
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
      { id: 1, img_no: '../../../../assets/events/event1.svg'},
      { id: 2, img_no: '../../../../assets/events/event1.svg'},
      { id: 3, img_no: '../../../../assets/events/event1.svg'}
    ];
    
   
  }

  ngAfterContentChecked() {
    this.bannerConfig = {
      slidesPerView: 1,
      pagination: { clickable: true }
    };
    this.featureConfig = {
      slidesPerView: 3.5,
    };
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
  }else{
    this.router.navigate(['/login'], { replaceUrl: true });
  }
  }
}

