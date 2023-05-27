import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  // Se define la URL base para las solicitudes HTTP y
  //  se establece un encabezado para el tipo de contenido de "application/json".
    //  private url = 'http://localhost:3300';
  private url = 'https://finalproject-gout.herokuapp.com';
  headers = new HttpHeaders().set('Content-Type', 'application/json');





    //reporta user
    addReport(reportedId:string, reportType:string, eventId:string,userId ): Observable<any> {
      const body = { reportType, eventId, userId };
      const url = `${this.url}/addReport/${reportedId}`;
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.post(url, body, { headers: headers });
  }
  
    //obtiene reportes por tipo 
    getReportsByType(userId:any,reportType:any): Observable<any> {
      const body = { reportType };
      const url = `${this.url}/getReportsByType/${userId}`;
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      const options = { headers: headers, body: body };
      return this.http.get(url, options);
    }

    //usuarios por num reportes
    getUsersByReportCount(reportCount:number): Observable<any> {  
      const url = `${this.url}/getUsersByReportCount/${reportCount}`;
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.get<number>(url, { headers: headers });
    }

    deleteReportsByEventId(eventId:string): Observable<any> {
      const url = `${this.url}/deleteReportsByEventId/${eventId}`;
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.delete(url, { headers: headers });
    }


}
