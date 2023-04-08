import { Component, OnInit } from '@angular/core';
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
 
  roles: string[] = [];

  constructor(
    private navCtrl: NavController,  
    private auth: AuthService) { 
     
    }
    
  
  ngOnInit() {

    //Si el usuario esta ya loggeado, se redirige a la pagina principal
    
    const usuario = localStorage.getItem('userId');
    
    if (usuario) {
      this.auth.getUser().subscribe({
        next: user => {
          this.roles = user.roles;
          if (this.roles.includes('ROLE_ADMIN')) {
            this.navCtrl.navigateForward(['/home-admin']);
          } else {
            this.navCtrl.navigateForward(['/home/main']);
          }
          console.log(this.roles);
        },
        error: err => {
          console.error(err);
        }
      });
    }
    

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
}