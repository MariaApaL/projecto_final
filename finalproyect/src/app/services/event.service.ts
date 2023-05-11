import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }



  // private url = 'http://localhost:3300';
  private url = 'https://finalproject-gout.herokuapp.com';
  
  headers = new HttpHeaders().set('Content-Type', 'application/json');


  createEvent(name: string, date: string, location: string, 
    author: string, numPlazas: number, description: string, price: number, categories:string[]): Observable<any> {
   
      const URL = `${ this.url }/createEvent`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { name, date, location, author, numPlazas, description, price , categories};
    return this.http.post(URL, body, { headers });
  }

  

  getEvents(): Observable<any> {
    const URL = `${ this.url }/getEvents`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(URL, { headers });
  }

  getEvent(id: string): Observable<any> {
    const URL = `${ this.url }/getEvent/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(URL, { headers });
  }

  updateEvent(id: string, dataToUpdate: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(`${this.url}/updateEvent/${id}`, dataToUpdate, { headers });
  }

  findEventsByAuthorId(authorId:string){
    const URL = `${ this.url }/findEventsByAuthorId/${authorId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(URL, { headers });
  }

  deleteEventByNameAndAuthor(name: string, author: string) {
    const body = { name, author };
    const URL = `${ this.url }/deleteEventByNameAndAuthor`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers: headers, body: body };
    return this.http.delete(URL, options);
  }


  addParticipant(eventId: string, userId: string): Observable<any> {
    const url = `${this.url}/addParticipant/${eventId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { userId};
    return this.http.post(url, body, { headers: headers });
  }

  getParticipants(eventId: string): Observable<any> {
    const url = `${this.url}/getParticipants/${eventId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers: headers });
  }

  deleteParticipant(eventId: string, userId: string): Observable<any> {
    const body = { userId };
    const url = `${ this.url }/deleteParticipant/${ eventId }`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers: headers, body: body };
    return this.http.delete(url, options);
  }

  getEventsByParticipantId(userId: string): Observable<any> {
    const url = `${this.url}/getEventsByParticipantId/${userId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers: headers });
  }

  addComments(eventId: string, authorId: string, text: string): Observable<any> {
    const url = `${this.url}/addComments`;
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { eventId, authorId, text };
    return this.http.post(url, body, { headers: headers });
  }

  deleteComment(eventId: string, commentId: string, authorId:string): Observable<any> {
    const body = {  commentId, authorId };
    const url = `${ this.url }/deleteComment/${ eventId }`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers: headers, body: body };
    return this.http.delete(url, options);
  }

  getComments(eventId: any): Observable<any> {
    const url = `${this.url}/getComments/${eventId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers: headers });
  }






}