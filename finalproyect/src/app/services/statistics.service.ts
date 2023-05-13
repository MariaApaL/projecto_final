import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsersInterface } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient) { }

  // Se define la URL base para las solicitudes HTTP y
  //  se establece un encabezado para el tipo de contenido de "application/json".
  private url = 'http://localhost:3300';
  // private url = 'https://finalproject-gout.herokuapp.com';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  //el promedio de eventos por usuario
  getUsersAvgEventCount() {
    const URL = `${this.url}/getUsersAvgEventCount`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(URL, { headers });
  }
  // obtener el numero de usuarios reportados
  getBlockedUsers() {
    const URL = `${this.url}/getBlockedUsers`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<UsersInterface[]>(URL, { headers });
  }

  //obtener el promedio de reportes por usuario
  getAverageReportsPerUser() {
    const URL = `${this.url}/getAverageReportsPerUser`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(URL, { headers });
  }

  //obtener el promedio de participantes por evento
  getAvgParticipants() {
    const URL = `${this.url}/getAvgParticipants`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(URL, { headers });
  }


}
