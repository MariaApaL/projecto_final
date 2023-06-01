import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import Swiper from 'swiper';
import { EventsInterface } from 'src/app/interfaces/event';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  

  @ViewChild(IonSlides, { static: false }) swiper: IonSlides;
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

  currentDayIndex: number;
 



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
    this.currentDayIndex = this.days.indexOf(this.currentDay);

    const swiper = new Swiper('#mySwiper', {
      slidesPerView: 4,
      centeredSlides: true,
      initialSlide: this.currentDayIndex,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
   
 

  }


// Para poner la primera letra del mes en mayuscula  
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  //obtiene los dias del mes actual

  getDays(date: Date): number[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const currentDay = date.getDate();
    const numDays = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: numDays }, (_, i) => i + 1);
  
    return daysArray;

  }

// obtiene los nombrs de los dias de la semana
  getWeekDayName(day: number): string {
    const weekDays = [  'Dom','Lun', 'Mar', 'Miér', 'Juev', 'Vie', 'Sáb'];
    const date = new Date(this.currentYear, this.currentDate.getMonth(), day);
    const weekDayNumber = date.getDay();
    return weekDays[weekDayNumber];
  }

 // obtiene los eventos donde el usuario participa y los filtra para solo mostrar
 // los eventos que sean posterior a la fecha actual
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
  
   
    });
  }
// para que cmabie el color del día cuando se seleccione y que muestre los eventos de ese día
  selectDate(selectedDate: number) {
    if (this.selectedDay === selectedDate && selectedDate !== this.currentDay) {
      this.selectedDay = null;
    } else if (this.selectedDay === selectedDate && selectedDate === this.currentDay) {
      this.selectedDay = this.currentDay;
    } else {
      this.selectedDay = selectedDate;
    }
    this.filterEventsBySelectedDay();
  }

  // para deseleccionar el día y mostrar todos los eventos

  deselectDate() {
    this.selectedDay = null; 
    this.showAllEvents(); 
  }
  

  // para filtrar los eventos por el día seleccionado
  filterEventsBySelectedDay() {
    if (this.selectedDay === null) {
      this.showAllEvents();
    } else {
      const selectedDateObj = new Date(this.currentYear, this.currentDate.getMonth(), this.selectedDay);
      selectedDateObj.setHours(0, 0, 0, 0);
      this.filteredEvents = this.events.filter((event: EventsInterface) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        this.filteredEvents.forEach((event: EventsInterface) => {
          event.name = this.capitalizeWords(event.name);
          console.log(event.name);
        }
       );
      
        return eventDate.getTime() === selectedDateObj.getTime() && eventDate >= currentDate;
      });
    }
  }


// para que el día actual se muestre de color diferente
  isCurrentDay(day: number): boolean {
    const currentDate = new Date();
    return (
      day === currentDate.getDate() &&
      currentDate.getMonth() === this.currentDate.getMonth() &&
      currentDate.getFullYear() === this.currentDate.getFullYear()
    );
  }
  
  //Para mostrar todos los eventos
  showAllEvents() {

    const today = new Date(); // Obtener la fecha de hoy
    today.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00
  
    this.filteredEvents = this.events.filter((event: EventsInterface) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00 del evento
  
      const currentMonth = this.currentDate.getMonth();
      const eventMonth = eventDate.getMonth();
      this.filteredEvents.forEach((event: EventsInterface) => {
        event.name = this.capitalizeWords(event.name);
        console.log(event.name);
      }
     );
    
      return (
        eventDate >= today && // Mostrar solo los eventos que son iguales o mayores a la fecha de hoy
        eventMonth === currentMonth // Mostrar solo los eventos del mes actual
      );
    });
  }

  capitalizeWords(str: string):string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


goToInfo(id: string) {
  this.navCtrl.navigateForward(`/event-info/${id}`);
}


}

