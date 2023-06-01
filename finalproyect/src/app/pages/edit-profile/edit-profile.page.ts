import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { th } from 'date-fns/locale';
import { firstValueFrom } from 'rxjs';
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
  file: any;
  image:any;

//formulario
  form:FormBuilder
  //para mostrar los datos del usuario
  currentUser: any = {};

  //datos para hacer el update foto
  imagePreview: string;

  constructor(private modalCtrl: ModalController,
    private auth: AuthService,
    private navCrtl: NavController, private formBuilder: FormBuilder,

  ) { }

  ngOnInit() {

    this.auth.getUser().subscribe((data) => {
      this.currentUser = data;

      this.imagePreview = this.currentUser.picture;
      this.name = this.currentUser.name;
      this.bio = this.currentUser.bio;
    

    });

    

  }
  
//recoge el nombre
  onNameChange(event:any) {
    this.name = event.target.value;
    
  }
  
  //recoge la biografia
  onBioChange(event:any) {
    this.bio = event.target.value;
    

  }

//recoge la imagen que se ha seleccionado
onImageChange(event: any) {
  const file = event.target.files[0];
  this.image = file;

  // Código para generar una vista previa de la imagen seleccionada
  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result as string;
  };
  reader.readAsDataURL(file);
}

//abre el explorador de archivos
openFileInput() {
  document.getElementById('fileInput').click();
}

//sube la imagen al servidor
uploadPicture(userId: string) {
  this.auth.uploadUserPhoto(userId, this.image).subscribe();
}

  closeModal() {
    this.modalCtrl.dismiss();
  }

  
  //actualiza los datos del usuario
  saveChanges() {
    const userId = localStorage.getItem("userId");
    const updatedData = { name: this.name, bio: this.bio};

    if(this.image!=null) {
      this.uploadPicture(userId);
    }

    this.auth.updateUser(userId, updatedData).subscribe({
      next: user => { 
        
       
        this.navCrtl.navigateBack('/home/user-page');
      },error: (err) => {
        
      }
    }); 
    
    
  }

  navigateback() {
    this.navCrtl.navigateBack('/home/user-page');
  }
}


