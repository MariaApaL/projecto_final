import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { PrivacyModalComponent } from 'src/app/components/privacy-modal/privacy-modal.component';
import { ReportUserModalComponent } from 'src/app/components/report-user-modal/report-user-modal.component';
import { UsersInterface } from 'src/app/interfaces/user';

import { AuthService } from 'src/app/services/auth.service';
import { ReportService } from 'src/app/services/report.service';


@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit {


  editEvent() {
    throw new Error('Method not implemented.');
  }


  constructor(private auth: AuthService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private reportService: ReportService) { }

  options = [
    { label: "Estadísticas" },
    { label: "Privacidad" },
  ];

  date: Date;
  filteredUsersMorenThan50: UsersInterface[] = [];
  filteredUsersMorenThan10: UsersInterface[] = [];
  filteredUsersMorenThan30: UsersInterface[] = [];

  ngOnInit(): void {

    this.getUserByReportMoreThan10();
    this.getUserByReportMoreThan30();
    this.getUserByReportMoreThan50();
  }


  logOut() {
    this.auth.logOut();
    this.navCtrl.navigateBack('/login');
  }

  chooseOptions(item: any) {
    switch (item.label) {
      case 'Privacidad':
        this.openPrivateModal(item);
        break;
      default: 'Estadísticas'
        this.navCtrl.navigateRoot('/home-admin/statistics');
        break;

    }
  }

  async openPrivateModal(item) {
    this.modalCtrl.dismiss();
    const modal = await this.modalCtrl.create({
      component: PrivacyModalComponent,
      componentProps: {
        item: item,
        cssClass: 'modal-privacy'
      }
    });
    return await modal.present();
  }


//muestra los usuarios con mas de 10 reportes
  getUserByReportMoreThan10() {
    this.auth.getUsers().subscribe((res: UsersInterface[]) => {
      this.filteredUsersMorenThan10= res.filter(user => 
        user.reports.length >= 10 && user.reports.length < 30 && 
        (user.deleted === false && user.blocked === false));
    
    });
  }

  //muestra los usuarios con mas de 30 reportes
  getUserByReportMoreThan30() {
    this.auth.getUsers().subscribe((res: UsersInterface[]) => {
      this.filteredUsersMorenThan30 = res.filter(user => user.reports.length >= 30 && 
        user.reports.length < 50&& user.deleted === false);

    });
  }

  //muestra los usuarios con mas de 50 reportes
  getUserByReportMoreThan50() {
    this.auth.getUsers().subscribe((res: UsersInterface[]) => {
      this.filteredUsersMorenThan50 = res.filter(user => 
        user.reports.length >= 50  && user.deleted === false );
   
    });
  }


  async openReports(count: string) {
    switch (count) {
      case 'moreThan10':
        const modal1 = await this.modalCtrl.create({
          component: ReportUserModalComponent,
          componentProps: {
            count: 'moreThan10',
            cssClass: 'modal-privacy'
          }
        });
        return await modal1.present();
      case 'moreThan30':
        const modal2 = await this.modalCtrl.create({
          component: ReportUserModalComponent,
          componentProps: {
            count: 'moreThan30',
            cssClass: 'modal-privacy'
          }
        });
        return await modal2.present();
      default:
        const modal3 = await this.modalCtrl.create({
          component: ReportUserModalComponent,
          componentProps: {
            count: 'moreThan50',
            cssClass: 'modal-privacy'
          }
        });
        return await modal3.present();
    }
  }
}

