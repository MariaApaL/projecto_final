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
    
    



  }


  ionViewWillEnter() {
  
      this.getEvent();
      this.getUserEvent(this.eventId);
      this.getUser();

  }
  //llama al servicio para obtener los eventos
  async getEvent() {
    this.eventService.getEvent(this.eventId).subscribe({
      next: async (data) => {
        this.event = await data;
        console.log("event", this.event);


        // this.getUserEvent(this.eventId);
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



        this.eventName = this.capitalizeWords(this.event.name);
        
        this.checkParticipants();

        return this.event;
      }
    });
  }

  getUserEvent(eventId: any) {
    this.auth.getUserByEventId(eventId).subscribe({
      next: async (data) => {
        this.userAuthor = await data.user;
        this.userAuthorId = data._id;
        this.checkIfmine();
        console.log("user", this.userAuthor);
        return this.userAuthor;
      }
    });
  }


  capitalizeWords(eventName: string) {
    return eventName.replace(/\b\w/g, l => l.toUpperCase());
  }


  navigateBack() {

    this.navCtrl.back();
  }

  addFavorite() {
    if (this.isFavorite) {
      this.deleteFavorite(this.eventId);

    } else {
      this.setFavoriteEvent(this.eventId);
    }
    this.isFavorite = !this.isFavorite;
    // localStorage.setItem(`favorite_${this.eventId}`, JSON.stringify(this.isFavorite));
  }


  //llama al servicio para añadir un evento a favoritos
  setFavoriteEvent(eventId: string) {
    this.auth.setFavorite(this.userId, eventId).subscribe({
      next: async (data: UsersInterface) => {
        console.log(data);

      },
      error: async (err) => {
        console.log(err);
      }
    });
  }

  //Llama al servicio para eleminar los favoritos
  deleteFavorite(eventId: string) {
    this.auth.deleteFavorite(this.userId, eventId).subscribe({
      next: (data: UsersInterface) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
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


  async joinOrLeaveEvent() {
    if (this.isJoined) {
      this.leaveEvent();
      console.log("leave:", this.participants);
    } else {
      this.joinEvent();
      console.log("join:", this.participants);
    }
    this.isJoined = !this.isJoined;

    // Si el número de participantes ha llegado al máximo y no se ha unido aún, desactiva el botón de unirse
    this.checkParticipants();
  }


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

      default:
        this.disabledButton = false;
        break;

    }
  }


  joinEvent() {
    this.eventService.addParticipant(this.eventId, this.userId).subscribe({
      next: async (data) => {
        const event: EventsInterface = await data.event;

        this.participants = event.plazas.length;

        this.checkParticipants();
        // Actualiza si el evento está lleno o no
        // }
      }
    });
  }

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
    console.log("user auhtor", this.userAuthorId);
    console.log("user", this.userId);
    if (this.userAuthorId == this.userId) {

      this.isMine = true;
      console.log("mine", this.isMine);

    } else {
      this.isMine = false;
      console.log("not mine", this.isMine);
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
    console.log("eventid", this.eventId);
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
        console.log(this.currentUser);
        const favorites = this.currentUser.favorites?.find((fav: any) => fav == this.eventId);
        console.log("fav", favorites);
        // Si el usuario está en la lista de participantes, cambia el estado del botón de unirse
        if (favorites) {
          this.isFavorite = true;
          console.log("user", this.isFavorite);
        } else {
          this.isFavorite = false;
          console.log("user", this.isFavorite);
        }
        this.changeDetectorRef.detectChanges();
      }
    });
  }

}