import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { th } from 'date-fns/locale';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ImgServiceService } from 'src/app/services/img.service.service';

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
  file: any;


  //para mostrar los datos del usuario
  currentUser: any = {};

  //datos para hacer el update

  constructor(private modalCtrl: ModalController,
    private auth: AuthService,
    private navCrtl: NavController,
    private imgService: ImgServiceService
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
  onUploadImage(event: Event) {
   
      const file = (event.target as HTMLInputElement).files![0];
      const formData = new FormData();
      formData.append('file', file);
      const userId = this.auth.getId();
  
      // Aquí se debe llamar al método del servicio para subir la imagen
      this.imgService.uploadUserImg(userId,file).subscribe({
        next: user => { 
  
         console.log(user)
        },error: (err) => {
          console.log(err);
        }
      }); 
      
    }
  

  //  onUploadImage(event: Event) {
   
  //   const userId = this.auth.getId();
  //   const file = (event.target as HTMLInputElement).files![0];
  //   this.imgService.uploadUserImg(userId,file);
   //Se sube la imagen
    // await this.auth.updateUserPhoto(file)
    //   .then(async () => {
    //     console.log('Imagen subida');

    //     //Actualizamos el timeStamp para que se actualice la imagen
    //     this.timeStamp = new Date().getTime();

    //     console.log(this.imageProfile + '?v=' + this.timeStamp);
        
    //     await firstValueFrom(this.auth.getUserProfile().pipe(take(1))).then(user => {
    //       this.imageProfile = user.image;
    //     });

    //     //Limpia la seleccion del input file
    //     const inputFile = document.getElementById('image') as HTMLInputElement;
    //     inputFile.value = '';
    //   })
    //   .catch(error => {
    //     console.log(`Error al subir la imagen: ${error}`);
    //   });
  // }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  
  saveChanges() {
    const userId = localStorage.getItem("userId");
    const updatedData = { name: this.name, bio: this.bio};
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


