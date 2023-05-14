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
     private url = 'http://localhost:3300';
  // private url = 'https://finalproject-gout.herokuapp.com';
  headers = new HttpHeaders().set('Content-Type', 'application/json');





    //reporta user
    addReport(userId:string, reportType:string, eventId:string): Observable<any> {
      const body = { reportType, eventId };
      const url = `${this.url}/addReport/${userId}`;
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

    //limita reportes
    // checkReportLimit(userId:any, eventId:any): Observable<any> {
    //   const body = { eventId };
    //   const url = `${this.url}/checkReportLimit/${userId}`;
    //   const headers = new HttpHeaders().set('Content-Type', 'application/json');
    //   const options = { headers: headers, body: body };
    //   return this.http.get(url, options);
    // }










//   app.post("/addReport/:id", controller.addReport);

//   //obtener reportes por tipo
//   app.get("getReportsByType/:id", controller.getReportsByType);
 
//  //limita reportes 
//    app.post("/checkReportLimit/:id", controller.checkReportLimit);
}
