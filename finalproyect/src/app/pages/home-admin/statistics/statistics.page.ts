import { Component, OnInit } from '@angular/core';
import { EventsInterface } from 'src/app/interfaces/event';
import { UsersInterface } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {


  //recoge total de usuarios
  totalUsers: number = 0;
  //recoge total de eventos
  totalEvents: number = 0;
  //recoge promedio de eventos por usuario
  avgEvents: any;
  //recoge promedio de reportes por usuario
  avgReports: any;
  //recoge promedio de participantes por evento
  avgParticipants: any;
  //recoge usuarios reportados
  blockedUsers: any;
  //recoge usuarios activos
  totalActive: any;
  //fecha de hoy
  today = new Date();
  totalUsersLastWeek: UsersInterface[] = [];
  totalUsersLastMonth: UsersInterface[] = [];
  totalEventLastWeek: EventsInterface[] = [];
  totalEventsLastMonth: EventsInterface[ ] = [];

  constructor(private auth: AuthService,
    private eventService: EventService,
    private statisticsService: StatisticsService
  ) { }







  ngOnInit() {
    this.getTotalUsers();
    this.getTotalEvents();
    this.getAvgEventsPerUser();
    this.getAvgParticipants();
    this.getBlockedUsers();
    this.getAverageReportsPerUser();
    this.getActiveUsers();
    this.getUsersLastWeek();
    this.getUsersLastMonth();
    this.getTotalEventsLastWeek();
    this.getEventsLastMonth();

  }
  // recoge el total de usuarios
  getTotalUsers() {
    this.auth.getUsers().subscribe(
      res => {

        this.totalUsers = res.length;
      }
    )
  }

  // recoge el total de eventos
  getTotalEvents() {
    this.eventService.getEvents().subscribe(
      res => {

        this.totalEvents = res.length;
      }
    )
  }

  //recoge el promedio de eventos por usuario
  getAvgEventsPerUser() {
    this.statisticsService.getUsersAvgEventCount().subscribe((res: { avgEventCount: number }) => {

      this.avgEvents = res.avgEventCount.toFixed(2);
    });
  }

  //recoge el promedio de reportes por usuario
  getAverageReportsPerUser() {
    this.statisticsService.getAverageReportsPerUser().subscribe((res: { averageReports: number }) => {

      this.avgReports = res.averageReports.toFixed(2);
    });
  }

  //recoge el promedio de participantes por evento
  getAvgParticipants() {
    this.statisticsService.getAvgParticipants().subscribe((res: { avgParticipants: number }) => {

      this.avgParticipants = res.avgParticipants.toFixed(2);
    });
  }

  //recoge usuarios reportados
  getBlockedUsers() {
    this.statisticsService.getBlockedUsers().subscribe((res) => {

      this.blockedUsers = res.length;
    });

  }

  //recoge los usuarios activos 
  getActiveUsers() {
    this.auth.getUsers().subscribe(
      res => {

        const activeUsers = res.filter(user => user.deleted === false);

        this.totalActive = activeUsers.length;
      }
    );
  }

  //recoge los usuarios registrados en la ultima semana
  getUsersLastWeek(){
    
      this.auth.getUsers().subscribe(
        res => {
         
          const users = res; 
          const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // fecha hace una semana
          const recentUsers = users.filter(user => new Date(user.createdAt) > oneWeekAgo); // filtrar por fecha
          this.totalUsersLastWeek = recentUsers.length; 
        }
      );
    }
  
    //recoge los eventos registrados en el utlimo mes
    getUsersLastMonth(){
      this.auth.getUsers().subscribe(
        res => {
          const users = res; 
          const today = new Date();
          const firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1); // primer día de este mes
          const firstDayOfLastMonth = new Date(firstDayOfThisMonth.getFullYear(), firstDayOfThisMonth.getMonth() - 1, 1); // primer día del mes pasado
          const recentUsers = users.filter(user => new Date(user.createdAt) >= firstDayOfLastMonth && new Date(user.createdAt) < firstDayOfThisMonth); // filtrar por fecha
          this.totalUsersLastMonth = recentUsers.length; 
        }
      );
    }
 //recoge los eventos registrados en la ultima semana
    getTotalEventsLastWeek() {
      this.eventService.getEvents().subscribe(
      res => {
         
          const events = res; 
          const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // fecha hace una semana
          const recentEvents = events.filter(event => new Date(event.createdAt) > oneWeekAgo); // filtrar por fecha
          this.totalEventLastWeek = recentEvents.length; 
        }
      );
      
    }

    //recoge los eventos registrados en el utlimo mes
    getEventsLastMonth(){
      this.eventService.getEvents().subscribe(
        res => {
          const events = res; 
          const today = new Date();
          const firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1); // primer día de este mes
          const firstDayOfLastMonth = new Date(firstDayOfThisMonth.getFullYear(), firstDayOfThisMonth.getMonth() - 1, 1); // primer día del mes pasado
          const recentEvents= events.filter(event => new Date(event.createdAt) >= firstDayOfLastMonth && new Date(event.createdAt) < firstDayOfThisMonth); // filtrar por fecha
          this.totalEventsLastMonth = recentEvents.length; 
        }
      );
    }














































}