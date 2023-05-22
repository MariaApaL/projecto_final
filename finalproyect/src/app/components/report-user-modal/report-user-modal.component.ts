import { Component, OnInit } from '@angular/core';
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

  constructor(private modalCtrl:ModalController, 
    private eventService:EventService,
    navParams: NavParams, 
    private auth: AuthService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private reportService: ReportService) { 
      this.count = navParams.get('count')

   }
   filteredUsers: UsersInterface[];
   count:string;
   filteredEvents: string[];
   eventInfo: EventsInterface[];
   filteredReports: string[];
  

  ngOnInit() {
     
      this.getUserByReportCount();
  
  }

  ionViewDidEnter(){
    this.getUserByReportCount();
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }



  getUserByReportCount() {
    this.auth.getUsers().subscribe((res: UsersInterface[]) => {
      if (this.count == 'moreThan10') {
        this.filteredUsers = res.filter(user => user.reports.length >= 6 && user.reports.length < 30 && !user.deleted);
        console.log(this.filteredUsers);
  
        // Filtra el id del evento de cada reporte y quita duplicados 
        this.filteredEvents = this.filtrarEventos(res);
  
        this.filteredReports = this.filtrarReport(res);
        // Filtra por el tipo de reporte y elimina duplicados
        console.log(this.filteredReports);
      } else if (this.count == 'moreThan30') {
        this.filteredUsers = res.filter(user => user.reports.length >= 30 && user.reports.length < 50 && !user.deleted);
        console.log(this.filteredUsers);
        this.filteredEvents = this.filtrarEventos(res);
        this.filteredReports = this.filtrarReport(res);
      } else {
        this.filteredUsers = res.filter(user => user.reports.length >= 50 && !user.deleted);
        console.log(this.filteredUsers);
        this.filteredEvents = this.filtrarEventos(res);
        this.filteredReports = this.filtrarReport(res);
      }
    });
  }


  filtrarEventos(res: any[]): any[] {
    const eventosFiltrados: any[] = res.flatMap(user => user.reports.map(report => report.eventId));
    return eventosFiltrados.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }

  filtrarReport(res: any[]): any[] {
    const reportsFiltrados: any[] = res.flatMap(user => user.reports.map(report => report.report));
    return reportsFiltrados.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }

  updateFilteredEvents(deletedEventId: string) {
    this.filteredEvents = this.filteredEvents.filter(event => event !== deletedEventId);
  }

  goEventInfo(event:string){
    this.navCtrl.navigateForward(`/event-info/${event}`);
    this.closeModal();

  }

  goUserInfo(user:string){
    this.navCtrl.navigateForward(`/otheruser-page/${user}`);
    this.closeModal();

  }

  deleteEvent(eventId:string){
    this.eventService.deleteByEventId(eventId).subscribe((res)=>{
      console.log(res);
      this.reportService.deleteReportsByEventId(eventId).subscribe(); 
      this.updateFilteredEvents(eventId);

    }
    );
}

 

deleteUser(id:string){
  this.auth.updateUser(id, {deleted: true}).subscribe({
    next: user => { 
      this.deleteAllEvents(id);
      this.deleteAllComments(id);
      this.deleteAllPlazas(id);
      this.ionViewDidEnter();
      
      console.log(user);
    },error: (err) => {
      console.log(err);
    }
  }); 
}

deleteAllEvents(id:string){
  this.eventService.deleteEventsByAuthor(id).subscribe({
    next: events => {
      console.log("eventos eliminados");
    }
  });
}

deleteAllComments(id:string){
 this.eventService.deleteUserValuations(id).subscribe({
    next: comments => { 
      console.log("comentarios eliminados");
    }
  });
}

deleteAllPlazas(id:string){
  this.eventService.deleteUserPlazas(id).subscribe({
    next: plazas => { 
      console.log("plazas eliminadas");
    }
  });
}

}
