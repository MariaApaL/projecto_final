import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.scss'],
})
export class ReportModalComponent implements OnInit {


  options = [
    {  label: 'Es spam', redirectTo: '' },
    {  label: 'Lenguaje o símbolos que incitan al odio'},
    {  label: 'Violencia u organizaciones peligrosas'},
    {  label: 'Desnudos o actividad sexual'},
    {  label: 'Fraude'}
  ];
  constructor(
    private alertCtrl: AlertController, 
    private auth: AuthService, 
    private navCtrl:NavController,
    private modalCtrl: ModalController
    ) { }

  ngOnInit() {}

}
