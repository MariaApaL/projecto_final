import { Injectable } from '@angular/core';
import { collection, Firestore, addDoc } from '@angular/fire/firestore';

//https://www.youtube.com/watch?v=t_YSrxj0wGY&list=LL&index=5&t=698s
@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private firestore: Firestore) { }

  addEvent(event: Event){
     const eventRef = collection(this.firestore, 'events');
    return addDoc(eventRef,event);
  }


}
