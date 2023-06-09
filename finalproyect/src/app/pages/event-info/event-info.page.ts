import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { EventService } from 'src/app/services/event.service';


import { AuthService } from 'src/app/services/auth.service';
import { EventMapComponent } from 'src/app/components/event-map/event-map.component';
import { Observable } from 'rxjs';
import { ParticipantsListComponent } from 'src/app/components/participants-list/participants-list.component';
import { CommentsModalComponent } from 'src/app/components/comments-modal/comments-modal.component';
import { ReportModalComponent } from 'src/app/components/report-modal/report-modal.component';
import { EventsInterface } from 'src/app/interfaces/event';
import { UsersInterface } from 'src/app/interfaces/user';
declare let google: any;

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.page.html',
  styleUrls: ['./event-info.page.scss'],
})
export class EventInfoPage implements OnInit {

  //Guarda el id del evento
  eventId: string;
  //Guarda el evento
  event: EventsInterface;
  //para comprobar si el evento está en favoritos
  isFavorite: boolean;
  //Guarda el número de participantes
  participants: any;
  //para comprobar si el usuario está en la lista de participantes
  isJoined = false;
  //Guarda el nombre del evento
  eventName: string;
  //Guarda el autor del evento
  userAuthor: UsersInterface;
  //para desactivar el botón de unirse
  disabledButton: boolean;
  //guarda la fecha del evento
  eventDate: Date;
  //guarda el id del usuario
  userId = localStorage.getItem('userId');
  //guarda la localización del evento
  location: string;
  //guarda el número de favoritos
  numFavorites: number;
  //guarda el usuario
  currentUser: UsersInterface;
  //guarda los favoritos
  favorites: any[] = [];

  //guarda el id del autor del evento
  userAuthorId: string;
  //para mostrar el botón de reportes
  isMine: boolean = false;

  //para ver si es admin
  isAdmin: boolean = false;
  //array de categorias
  categories: { id: string; name: string; icon: string; checked: boolean; }[];
  //para recoger el id de la categoria
  category: string;


  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,

    private navCtrl: NavController,
    private auth: AuthService,
    private modalCtrl: ModalController,
    private changeDetectorRef: ChangeDetectorRef) {
   






  }




  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      this.eventId =  params.get('id');
      //Ya tenemo el id de la URL guardado en una variable 
    });
    
    this.categories = [
      { id:'645e653feb328b8b3c629b09', name: 'Cultura' , icon:'../../assets/categories/creative.png',checked: false},
      { id:'645e653feb328b8b3c629b0a', name: 'Deportes', icon:'../../assets/categories/physical.png',checked: false },
      { id: '645e653feb328b8b3c629b0b' , name: 'Gastronomía',icon:'../../assets/categories/rice-bowl.png',checked: false },
      { id: '645e653feb328b8b3c629b0d', name: 'Relax',icon:'../../assets/categories/facial-treatment.png',checked: false },
      { id: '645e653feb328b8b3c629b0c', name: 'Ocio', icon:'../../assets/categories/garlands.png',checked: false },
      { id: '645e653feb328b8b3c629b0e', name: 'Solidario',icon:'../../assets/categories/peace.png',checked: false }
    ];

    



  }


  ionViewWillEnter() {
  
      this.getEvent();
      this.getUserEvent(this.eventId);
      this.getUser();
      this.getRol();

  }

  //llama al servicio para obtener los eventos
  async getEvent() {
    this.eventService.getEvent(this.eventId).subscribe({
      next: async (data) => {
        this.event = await data;
 
        this.eventDate = this.event.date;

        // actualiza el número de participantes
        this.participants = this.event.plazas.length;

        const plazas = this.event.plazas?.find((plaza: any) => plaza == this.userId);
        // Si el usuario está en la lista de participantes, cambia el estado del botón de unirse
        if (plazas) {
          this.isJoined = true;
        } else {
          this.isJoined = false;
        }


        this.category= this.event.category;
        //para poner la letra mayuscula de cada palabra
        this.eventName = this.capitalizeWords(this.event.name);
        
        this.checkParticipants();

        return this.event;
      }
    });
  }

  //obtiene el usuario autor del evento
  getUserEvent(eventId: any) {
    this.auth.getUserByEventId(eventId).subscribe({
      next: async (data) => {
        this.userAuthor = await data.user;
        this.userAuthorId = data._id;
        this.checkIfmine();
      
        return this.userAuthor;
      }
    });
  }

//para mostrar el icono de cada categoria
  getCategoryIcon(categoryId: string): string {
    const category = this.categories.find(category => category.id === categoryId);
    return category ? category.icon : '';
  }

  //Muestra el nombre de cada palabra en mayuscula la primera letra
capitalizeWords(str: string):string {
return str.charAt(0).toUpperCase() + str.slice(1);
}


  navigateBack() {
    
    this.navCtrl.back();
  }

  //añade a favoritos o los elimina
  addFavorite() {
    if (this.isFavorite) {
      this.deleteFavorite(this.eventId);

    } else {
      this.setFavoriteEvent(this.eventId);
    }
    this.isFavorite = !this.isFavorite;
   
  }


  //llama al servicio para añadir un evento a favoritos
  setFavoriteEvent(eventId: string) {
    this.auth.setFavorite(this.userId, eventId).subscribe();
  }

  //Llama al servicio para eleminar los favoritos
  deleteFavorite(eventId: string) {
    this.auth.deleteFavorite(this.userId, eventId).subscribe();
  }


  //Abre el modal de participantes
  async openParticipants() {
    const modal = await this.modalCtrl.create({
      component: ParticipantsListComponent,
      componentProps: {
        eventId: this.eventId
      },
    });
    await modal.present();

  }


  //para añadir o eliminar participantes
  async joinOrLeaveEvent() {
    if (this.isJoined) {
      this.leaveEvent();

    } else {
      this.joinEvent();
  
    }
    this.isJoined = !this.isJoined;

    // Si el número de participantes ha llegado al máximo y no se ha unido aún, desactiva el botón de unirse
    this.checkParticipants();
  }

//Para controlar el boton de unirse
  checkParticipants() {
    this.eventDate = new Date(this.event.date);
    let now = new Date();
    switch (true) {
      case this.participants == this.event.numPlazas && !this.isJoined:
        this.disabledButton = true;
        break;

      case this.eventDate < now && !this.isJoined:
        this.disabledButton = true;
        break;

      case this.eventDate < now && this.isJoined:
        this.disabledButton = true;
        break;

      case this.eventDate > now && !this.isJoined:
        this.disabledButton = false;
        break;

      case this.eventDate > now && this.isJoined:
        this.disabledButton = false;
        break;

      case this.participants < this.event.numPlazas:
        this.disabledButton = false;
        break;

      case this.isAdmin:
        this.disabledButton = true;
        break;

        case this.isMine:
          this.disabledButton = true;
          break;


      default:
        this.disabledButton = false;
        break;

    }
  }


  //para unirse a un evento
  joinEvent() {
    this.eventService.addParticipant(this.eventId, this.userId).subscribe({
      next: async (data) => {
        const event: EventsInterface = await data.event;

        this.participants = event.plazas.length;

        this.checkParticipants();
      
      }
    });
  }

  //para cancelar plaza en un evento
  leaveEvent() {
    this.eventService.deleteParticipant(this.eventId, this.userId).subscribe({
      next: async (data) => {
        const event: EventsInterface = await data.event;

        this.participants = event.plazas.length;
        this.checkParticipants();

      }
    });
  }


  goToProfile() {
    if (this.userAuthorId == this.userId) {

      this.navCtrl.navigateForward(`/home/user-page`);
    } else {
      this.navCtrl.navigateForward(`/otheruser-page/${this.userAuthorId}`);
    }
  }


  //para mostrar el boton de reportes
  checkIfmine() {
 
    if (this.userAuthorId == this.userId) {

      this.isMine = true;
    

    } else {
      this.isMine = false;
      
    }
  }


  //Abre el modal de denuncias
  async openReportModal() {
    const modal = await this.modalCtrl.create({
      component: ReportModalComponent,
      componentProps: {
        eventId: this.eventId
      },

      breakpoints: [0, 0.5],
      initialBreakpoint: 0.5,
      handleBehavior: 'none'

    });
    await modal.present();
  }

  //Abre el modal del mapa
  async openLocation() {
    const modal = await this.modalCtrl.create({
      component: EventMapComponent,
      componentProps: {
        location: this.event.location
      },
    });
    await modal.present();

  }

  //Abre el modal de comentarios
  async openComments() {
  
    const modal = await this.modalCtrl.create({
      component: CommentsModalComponent,

      componentProps: {
        eventId: this.eventId,


      },
    });
    await modal.present();

  }

  //recoge el usuario
  getUser() {
    this.auth.getUser().subscribe({
      next: async (data) => {
        this.currentUser = await data;
      
        const favorites = this.currentUser.favorites?.find((fav: any) => fav == this.eventId);
        
        // Si el evento esta en favoritos, cambia el icono
        if (favorites) {
          this.isFavorite = true;
          
        } else {
          this.isFavorite = false;
         
        }
        this.changeDetectorRef.detectChanges();
      }
    });
  }


  getRol(){
    const rol = localStorage.getItem('userRole');
    if(rol == 'ROLE_ADMIN'){
      this.isAdmin = true;

  }else{
    this.isAdmin = false;
  }

}



}