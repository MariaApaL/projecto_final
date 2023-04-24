import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {


  //recogemos el item que nos mandan desde el bottom-sheet-modal
  @Input() item: any;

  //Para recoger el nombre y la biografia del usuario
  name: string;
  bio: string;

  //para mostrar los datos del usuario
  currentUser: any = {};

  //datos para hacer el update

  constructor(private modalCtrl: ModalController,
    private auth: AuthService,
    private navCrtl: NavController
  ) { }

  ngOnInit() {

    this.auth.getUser().subscribe((data) => {
      this.currentUser = data;

      this.name = this.currentUser.name;
      this.bio = this.currentUser.bio;

    });

  }
  

  onNameChange(event:any) {
    this.name = event.target.value;
    
  }
  
  onBioChange(event:any) {
    this.bio = event.target.value;
    

  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  
  saveChanges() {
    const userId = localStorage.getItem("userId");
    const updatedData = { name: this.name, bio: this.bio };
    this.auth.updateUser(userId, updatedData).subscribe({
      next: user => { 
        this.navCrtl.navigateBack('/home/user-page');
      },error: (err) => {
        console.log(err);
      }
    }); 
    
  }

  navigateback() {
    this.navCrtl.navigateBack('/home/user-page');
  }
}


