import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
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
  bannerConfig!: SwiperOptions;
  featureConfig!: SwiperOptions;
 
  constructor(private navCtrl: NavController) { }

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
}