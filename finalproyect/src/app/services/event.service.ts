import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  totalEvents: any;

  constructor(private http: HttpClient) { }


  _refreshNeeded$ = new Subject<void>();

  private url = 'http://localhost:3300';
  // private url = 'https://finalproject-gout.herokuapp.com';

  headers = new HttpHeaders().set('Content-Type', 'application/json');


  //crea un evento
  createEvent(name: string, date: string, location: string,
    author: string, numPlazas: number, description: string, price: number, category: string): Observable<any> {

    const URL = `${this.url}/createEvent`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { name, date, location, author, numPlazas, description, price, category};

    return this.http.post(URL, body, { headers }).pipe(
      tap(() => {
       this._refreshNeeded$.next();
      }));;
  }

  uploadEventPhoto(eventId: string, picture:File): Observable<any> {
    const URL = `${this.url}/uploadEventPhoto/${eventId}`;
    const formData = new FormData();
    formData.append('picture', picture);
  
    return this.http.post(URL, formData).pipe(
      tap(() => {
       this._refreshNeeded$.next();
      }));;
  }  

  //devuelve todos los eventos
  // getEvents(): Observable<any> {
  //   const URL = `${this.url}/getEvents`;
  //   const headers = new HttpHeaders().set('Content-Type', 'application/json');
  //   return this.http.get(URL, { headers });
  // }

  getEvents(startFrom: number = 0): Observable<any> {
    const URL = `${this.url}/getEvents`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('startFrom', startFrom.toString());
  
    return this.http.get(URL, { headers, params }).pipe(
      tap((response) => {
        this.totalEvents = response.totalEvents; // Ajusta esto según la estructura de tu respuesta
      })
    );
  }
  
  //devuelve un evento por id
  getEvent(id: string): Observable<any> {
    const URL = `${this.url}/getEvent/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(URL, { headers });
  }

  //actualiza un evento
  updateEvent(id: string, dataToUpdate: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(`${this.url}/updateEvent/${id}`, dataToUpdate, { headers }).pipe(
      tap(() => {
       this._refreshNeeded$.next();
      }));;
  }

  //devuelve los eventos de un autor
  findEventsByAuthorId(authorId: string) {
    const URL = `${this.url}/findEventsByAuthorId/${authorId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(URL, { headers });
  }

  //elimina un evento por nombre y autor
  deleteEventByNameAndAuthor(name: string, author: string) {
    const body = { name, author };
    const URL = `${this.url}/deleteEventByNameAndAuthor`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers: headers, body: body };
    return this.http.delete(URL, options);
  }

  deleteByEventId(id: string) {
    const URL = `${this.url}/deleteByEventId/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(URL, { headers });
  }

  //elimina un evento por autor id
  deleteEventsByAuthor(id: string) {
    const URL = `${this.url}/deleteEventsByAuthor/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(URL, { headers });
  }

  //Añade un participante a un evento
  addParticipant(eventId: string, userId: string): Observable<any> {
    const url = `${this.url}/addParticipant/${eventId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { userId };
    return this.http.post(url, body, { headers: headers }).pipe(
      tap(() => {
       this._refreshNeeded$.next();
      }));;
  }

  //devuelve los participantes de un evento
  getParticipants(eventId: string): Observable<any> {
    const url = `${this.url}/getParticipants/${eventId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers: headers });
  }

  //elimina un participante de un evento
  deleteParticipant(eventId: string, userId: string): Observable<any> {
    const body = { userId };
    const url = `${this.url}/deleteParticipant/${eventId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers: headers, body: body };
    return this.http.delete(url, options);
  }

  //devuelve los eventos de un participante
  getEventsByParticipantId(userId: string): Observable<any> {
    const url = `${this.url}/getEventsByParticipantId/${userId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers: headers });
  }

  //elimina las plazas de un usaurio
  deleteUserPlazas(userId: string): Observable<any> {
    const url = `${this.url}/deleteUserPlazas/${userId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(url, { headers: headers });
  }

  //añadir valoraciones
  addValuation(eventId: string, userId: string, value: number, text:string): Observable<any> {
    const url = `${this.url}/addValuation/${eventId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { userId, value, text };
    return this.http.post(url, body, { headers: headers });
  }

  //devuelve las valoraciones de un evento
  getEventValuations(eventId: string): Observable<any> {
    const url = `${this.url}/getEventValuations/${eventId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers: headers });
  }
  //devuelve las valoraciones de un evento por autor
  getEventValuationsByAuthor(eventId: any, authorId: any): Observable<any> {
    const url = `${this.url}/getEventValuationsByAuthor/${authorId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    // const options = { body: body , headers: headers };
    return this.http.get(url, { headers: headers });
  }

 

  deleteUserValuations(userId: string): Observable<any> {
    const url = `${this.url}/deleteUserValuations/${userId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(url, { headers: headers });
  }
}
