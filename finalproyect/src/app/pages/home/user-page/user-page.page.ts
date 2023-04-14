import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BottomSheetModalComponent } from 'src/app/components/bottom-sheet-modal/bottom-sheet-modal.component';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.page.html',
  styleUrls: ['./user-page.page.scss'],
})
export class UserPagePage implements OnInit {

  currentUser: any = {};
  event:boolean = false;

  constructor(private modalCtrl: ModalController,private auth: AuthService) {}
  ngOnInit() {
    //Para poder recoger los datos del usuario y mostrarlos en la página
    this.auth.getUser().subscribe({
      next: (data) => {
        this.currentUser = data;
        console.log(this.currentUser);
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  
    
  }

  ionViewDidEnter() {
    this.auth.getUser().subscribe({
      next: (data) => {
        this.currentUser = data;
        console.log(this.currentUser);
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: BottomSheetModalComponent,
    
      breakpoints: [0, 0.3],
      initialBreakpoint: 0.3,
      handleBehavior: 'none'
      
    });
    await modal.present();
  }

  //Cambia entre favoritos y mis eventos
  segmentChanged(event:any){
    const chose = event.detail.value;

    this.event = chose === 'my-favs';
  }




}

