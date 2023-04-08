import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import SwiperCore, { SwiperOptions, Pagination } from 'swiper';
// install Swiper modules
SwiperCore.use([Pagination]);

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor(private navCtrl: NavController) { }
  config: SwiperOptions;
  config1: SwiperOptions;
  categories: any[] = [];
  trips: any[] = [];


  ngOnInit() {
    this.categories = [      
      { id: 1, name: 'Camp' },
      { id: 2, name: 'Mountains' },
      { id: 3, name: 'Treking' },
      { id: 4, name: 'Lake' },
    ];
  }

  searchAll(){
    this.navCtrl.navigateForward("/home/search");
  }

  ngAfterContentChecked() {
    this.config = {
      slidesPerView: 2.1
    };
    this.config1 = {
      slidesPerView: 2
    };
  }

}
