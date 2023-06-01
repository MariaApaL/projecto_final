import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { EventsInterface } from 'src/app/interfaces/event';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  

  //Para almacenar la fecha actual
  currentDate = new Date();
  //Para almacenar el mes actual
  currentMonth: any;
  //Para almacenar el año actual
  currentYear = new Date().getFullYear();


  //Para almacenar los dias del mes 
  days: number[];
  //Para almacenar los dias de la semana
  weekDays:number[];
  //user id
  userId: string = localStorage.getItem('userId');
  //Para almacenar los eventos
  events: EventsInterface[];
  //Para almacenar los eventos filtrados
  filteredEvents: EventsInterface[];
  //Para almacenar el dia actual
   currentDay: number; 
   //Para almacenar el dia seleccionado
  selectedDay: number; 



  constructor(private eventService: EventService, private navCtrl: NavController) { }

  ngOnInit() {
   
    
  }

  ionViewWillEnter() {
    this.currentMonth = this.capitalizeFirstLetter(
      this.currentDate.toLocaleString('es-ES', { month: 'long' })
    );
    this.days = this.getDays(this.currentDate);
    
    this.getEvents();
    this.currentDay = this.currentDate.getDate();
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  getDays(date: Date): number[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const currentDay = date.getDate();
    const numDays = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: numDays }, (_, i) => i + 1);
  
    if (date.getMonth() === this.currentDate.getMonth()) {
      return daysArray.filter((day) => day >= currentDay);
    } else {
      return daysArray;
    }
  }

  getWeekDayName(day: number): string {
    const weekDays = [  'Dom','Lun', 'Mar', 'Miér', 'Juev', 'Vie', 'Sáb'];
    const date = new Date(this.currentYear, this.currentDate.getMonth(), day);
    const weekDayNumber = date.getDay();
    return weekDays[weekDayNumber];
  }

 
  getEvents() {
    this.eventService.getEventsByParticipantId(this.userId).subscribe((res: EventsInterface[]) => {
      if (res) {
        this.events = res;
        const currentDate = new Date(); // Obtener la fecha actual
        this.filteredEvents = res.filter((event: EventsInterface) => {
          const eventDate = new Date(event.date);
          return (
            eventDate >= currentDate && // Mostrar eventos a partir de la fecha actual
            eventDate.getMonth() === currentDate.getMonth() &&
            eventDate.getFullYear() === currentDate.getFullYear()
          );
        });
      } else {
        this.events = [];
        this.filteredEvents = [];
      }
  
      console.log('events', this.events);
    });
  }

  deselectDate() {
    this.selectedDay = null; // Establecer el valor de selectedDay como null para deseleccionar el día
    this.showAllEvents(); // Mostrar todos los eventos mayores o iguales a la fecha de hoy
  }
  
  showAllEvents() {
    // const today = new Date(); // Obtener la fecha de hoy
    // today.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00
  
    // this.filteredEvents = this.events.filter((event: EventsInterface) => {
    //   const eventDate = new Date(event.date);
    //   eventDate.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00 del evento
  
    //   return eventDate >= today; // Mostrar solo los eventos que son iguales o mayores a la fecha de hoy
    // });
    const today = new Date(); // Obtener la fecha de hoy
    today.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00
  
    this.filteredEvents = this.events.filter((event: EventsInterface) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00 del evento
  
      const currentMonth = this.currentDate.getMonth();
      const eventMonth = eventDate.getMonth();
  
      return (
        eventDate >= today && // Mostrar solo los eventos que son iguales o mayores a la fecha de hoy
        eventMonth === currentMonth // Mostrar solo los eventos del mes actual
      );
    });
  }


selectDate(selectedDate: number) {
  this.selectedDay = selectedDate;
  const selectedDateObj = new Date(this.currentYear, this.currentDate.getMonth(), selectedDate);
  selectedDateObj.setHours(0, 0, 0, 0);
  this.filteredEvents = this.events.filter((event: EventsInterface) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === selectedDateObj.getTime();
  });

  // Asignar los eventos filtrados a this.filteredEvents
  this.filteredEvents = this.filteredEvents;
}
  

goToInfo(id: string) {
  this.navCtrl.navigateForward(`/event-info/${id}`);
}


}

