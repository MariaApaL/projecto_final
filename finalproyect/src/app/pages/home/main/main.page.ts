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
      { id: 1, name: 'Cultura' },
      { id: 2, name: 'Deportes' },
      { id: 3, name: 'Gastronomía' },
      { id: 4, name: 'Animales' },
      { id: 4, name: 'Solidario' }
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
