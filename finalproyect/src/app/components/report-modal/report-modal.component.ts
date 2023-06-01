import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController, NavParams } from '@ionic/angular';
import { EventsInterface } from 'src/app/interfaces/event';
import { UsersInterface } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.scss'],
})
export class ReportModalComponent implements OnInit {

//array para las opciones de reportes
  options = [
    { label: 'Es spam', report: 'spam' },
    { label: 'Lenguaje o símbolos que incitan al odio', report: 'odio' },
    { label: 'Violencia u organizaciones peligrosas', report: 'violencia' },
    { label: 'Desnudos o actividad sexual', report: 'sexual' },
    { label: 'Fraude', report: 'fraude' },
  ];

  //para guardar el id del usuario reportado
  userReportedId: string;
  //para guardar el id del evento
  eventId: string;
  //para guardar el usuario del localstorage
  currentUser = localStorage.getItem('userId');


  constructor(
    private alertCtrl: AlertController,
    private auth: AuthService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    navParams: NavParams,
    private reportService: ReportService
  ) {
    this.eventId = navParams.get('eventId')

  }


  ngOnInit() {
    this.getUserByEventId(this.eventId);
  }

//funcion para abrir un modal dependiendo de la opcion seleccionada
  chooseOptions(item: any) {
    this.reportService.addReport(this.userReportedId, item.report, this.eventId, this.currentUser).subscribe(
      res => {
        
        this.presentAlert('Reporte enviado');
        this.modalCtrl.dismiss();
      },
      error => {
        console.error(error);
        this.presentAlert(error.error.message || 'Error al enviar el reporte');
      }
    )
  }
  
    async presentAlert(message: string) {
      const alert = await this.alertCtrl.create({
        message: message,
        buttons: ['OK']
      });
  
      await alert.present();
    }
  
  

    //funcion para obtener el usuario por el id del evento
  getUserByEventId(id: string) {
    this.auth.getUserByEventId(id).subscribe(
      res => {
        this.userReportedId = res._id;
      }
    )

  }



















}