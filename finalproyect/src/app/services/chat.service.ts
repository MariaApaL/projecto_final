import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  _refreshNeeded$ = new Subject<void>();

     private url = 'http://localhost:3300';
  // private url = 'https://finalproject-gout.herokuapp.com';

  headers = new HttpHeaders().set('Content-Type', 'application/json');


  getAllMessage(transmitterId: string, receiverId: string) {
    const url = `${this.url}/getAllMessage/${transmitterId}/${receiverId}`;
    return this.http.get(url, { headers: this.headers });
  }

  send(transmitter: any, receiver: any, text: string) {
    const url = `${this.url}/send`;
    const body = { transmitter, receiver, text };
    return this.http.post(url, body, { headers: this.headers }).pipe(
      tap(() => {
       this._refreshNeeded$.next();
      }));;
  }

  deleteAllMessager(transmitterId: string, receiverId: string) {
    const url = `${this.url}/deleteAllMessages/${transmitterId}/${receiverId}`;
    return this.http.delete(url, { headers: this.headers });
  }

  getMessageByTransmitter(transmitterId: string) {
    const url = `${this.url}/getMessageByTransmitter/${transmitterId}`;
    return this.http.get(url, { headers: this.headers });
  }
}
