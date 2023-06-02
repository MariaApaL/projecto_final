import { Component, OnInit } from '@angular/core';
import { user } from '@angular/fire/auth';
import { AlertController, ModalController, NavController, NavParams } from '@ionic/angular';
import { triggerAsyncId } from 'async_hooks';
import { EventsInterface } from 'src/app/interfaces/event';
import { UsersInterface } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-report-user-modal',
  templateUrl: './report-user-modal.component.html',
  styleUrls: ['./report-user-modal.component.scss'],
})
export class ReportUserModalComponent implements OnInit {


//para guardar los usuarios filtrados
  filteredUsers: UsersInterface[];
//para guardar el numero de reportes
   count:string;
//para guardar los eventos filtrados
   filteredEvents: string[];
//para guardar la informacion de los eventos
   eventInfo: EventsInterface[];
//para guardar los reportes filtrados
   filteredReports: string[];


  constructor(private modalCtrl:ModalController, 
    private eventService:EventService,
    navParams: NavParams, 
    private auth: AuthService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private reportService: ReportService) { 
      this.count = navParams.get('count')

   }
  
  

  ngOnInit() {
     
      this.getUserByReportCount();
  
  }

  ionViewWillEnter(){
    this.getUserByReportCount();
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }


//funcion para obtener los usuarios dependiendo del numero de reportes
  getUserByReportCount() {
    this.auth.getUsers().subscribe((res: UsersInterface[]) => {
      if (this.count == 'moreThan10') {
        // Filtra los usuarios que tengan mas de 10 reportes y menos de 30
        this.filteredUsers = res.filter(user => user.reports.length >= 10 && user.reports.length < 30 && !user.deleted);
      
        console.log(this.filteredUsers); 
        // Filtra el id del evento de cada reporte y quita duplicados 
        this.filteredEvents = this.filtrarEventos(res);
           // Filtra por el tipo de reporte y elimina duplicados
        this.filteredReports = this.filtrarReport(res);
        
        console.log(this.filteredReports);
     
       
      } else if (this.count == 'moreThan30') {
        this.filteredUsers = res.filter(user => user.reports.length >= 30 && user.reports.length < 50 && !user.deleted);
      
        this.filteredEvents = this.filtrarEventos(res);
        this.filteredReports = this.filtrarReport(res);
      } else {
        this.filteredUsers = res.filter(user => user.reports.length >= 50 && !user.deleted);
       
        this.filteredEvents = this.filtrarEventos(res);
        this.filteredReports = this.filtrarReport(res);
      }
    });
  }

//funcion para filtrar los eventos
filtrarEventos(user: any): any[] {
  if (user.reports && Array.isArray(user.reports)) {
    const eventosFiltrados: any[] = user.reports.map(report => report.eventId);
    return eventosFiltrados.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  } else {
    return [];
  }
}
  //funcion para filtrar los reportes
  filtrarReport(res: any[]): any[] {
    const reportsFiltrados: any[] = res.flatMap(user => user.reports.map(report => report.report));
    return reportsFiltrados.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }

  getReportType(reportId: string): string {
    let reportType = '';
    this.auth.getReportById(reportId).subscribe((report) => {
      reportType = report.type; // Suponiendo que el nombre del informe se encuentra en la propiedad 'name'
    });
    return reportType;
  }


  //funcion para ctualizar el array de los eventos
  updateFilteredEvents(deletedEventId: string) {
    this.filteredEvents = this.filteredEvents.filter(event => event !== deletedEventId);
  }

  //funcion para ir a la informacion del evento
  goEventInfo(event:string){
    this.navCtrl.navigateForward(`/event-info/${event}`);
    this.closeModal();

  }

  //funcion para ir a la informacion del usuario
  goUserInfo(user:string){
    this.navCtrl.navigateForward(`/otheruser-page/${user}`);
    this.closeModal();

  }

  //funcion para eliminar el evento y llamar a la funcion de actualizar
  deleteEvent(eventId:string){
    this.eventService.deleteByEventId(eventId).subscribe((res)=>{
     
      this.reportService.deleteReportsByEventId(eventId).subscribe(); 
      this.updateFilteredEvents(eventId);

    }
    );
}

 
//funcion para eliminar el usuario y todos sus eventos, comentarios y plazas
deleteUser(id:string){
  this.auth.updateUser(id, {deleted: true}).subscribe({
    next: user => { 
      this.deleteAllEvents(id);
      this.deleteAllComments(id);
      this.deleteAllPlazas(id);
      this.ionViewWillEnter();
      
   
    },error: (err) => {
     
    }
  }); 
}

//funcion para eliminar todos los eventos del usuario
deleteAllEvents(id:string){
  this.eventService.deleteEventsByAuthor(id).subscribe({
    next: events => {
    
    }
  });
}

//funcion para eliminar todos los comentarios del usuario
deleteAllComments(id:string){
 this.eventService.deleteUserValuations(id).subscribe({
    next: comments => { 
    }
  });
}

//funcion para eliminar todas las plazas del usuario
deleteAllPlazas(id:string){
  this.eventService.deleteUserPlazas(id).subscribe({
    next: plazas => { 
     
    }
  });
}


}
