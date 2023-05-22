import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AlertController, InfiniteScrollCustomEvent, NavController, PopoverController } from '@ionic/angular';
import { EventsInterface } from 'src/app/interfaces/event';
import { UsersInterface } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { FilterpipePipe } from 'src/app/pipes/filterpipe.pipe';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  
  

  constructor(private navCtrl: NavController,
    private eventService: EventService,
    private alertCtrl: AlertController,
    private auth: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private popoverController: PopoverController) { 

  
    }

  scrollEvents = 8;
  categories: any[] = [];
  myEvents: EventsInterface[] = [];
  userId = localStorage.getItem('userId');
  userAuthor: string;
  selectedCategory: any = null;
  filteredEvents: EventsInterface[];
  filteredCategory: string = null;
  allEvents: EventsInterface[];
  searchQuery: string = '';
  selectedOption: string;
  options: any[];


  ngOnInit() {
    this.categories = [
      { id:'645e653feb328b8b3c629b09', name: 'Cultura' , icon:'../../assets/categories/creative.png',checked: false},
      { id:'645e653feb328b8b3c629b0a', name: 'Deportes', icon:'../../assets/categories/physical.png',checked: false },
      { id: '645e653feb328b8b3c629b0b' , name: 'Gastronomía',icon:'../../assets/categories/rice-bowl.png',checked: false },
      { id: '645e653feb328b8b3c629b0d', name: 'Relax',icon:'../../assets/categories/facial-treatment.png',checked: false },
      { id: '645e653feb328b8b3c629b0c', name: 'Ocio', icon:'../../assets/categories/garlands.png',checked: false },
      { id: '645e653feb328b8b3c629b0e', name: 'Solidario',icon:'../../assets/categories/peace.png',checked: false }
    ];

    this.options = [
      {value: 'mayor-menor-precio', label: 'Precio + a -', checked: false}, 
      {value: 'menor-mayor-precio', label: 'Precio - a +', checked: false}, 
      {value: 'fecha-reciente', label: 'Más recientes', checked: false}, 
      {value: 'fecha-lejana', label: 'Más lejanas',checked: false},
      { value: 'numero-participantes', label: 'Núm. participantes',checked: false}
    ];
    
    console.log('ngOnInit');
    // this.ionViewWillEnter();
   
    
  }


  ionViewWillEnter() {

    this.getEvents();

  }

  //llama al servicio para obtener los eventos
  getEvents() {
    this.eventService.getEvents().subscribe({
      next: async (data) => {
        this.myEvents = await Object.values(data);
        this.allEvents = this.myEvents;
        console.log(this.myEvents);
  
        const currentDate = new Date();
        this.allEvents = this.myEvents.filter(event => new Date(event.date) > currentDate);
  
        this.myEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ordenar los eventos por fecha
      }
    });
    }


    filterByCategory(category: string) {
      // Comprueba si la categoría seleccionada es igual a la categoría actualmente filtrada
      if (this.filteredCategory === category) {
        // Si es igual, muestra todos los eventos nuevamente
        this.filteredCategory = null;
        this.myEvents = this.allEvents;
      } else {
        // Si es diferente, filtra los eventos por la categoría seleccionada
        this.filteredCategory = category;
        this.myEvents = this.allEvents.filter(event => event.category === category);
      }
    }

    filterByOption(option: string) {
      if(this.selectedOption === option){
        
      
        // this.myEvents = this.allEvents;
      }else{
        this.selectedOption = option;
      }
      
    }

  //Navega a la página de información del evento
  selectEvent(id: string) {
 
    this.navCtrl.navigateForward(`/event-info/${id}`);
    
  }

  // onIonInfinite(ev) {
  //   this.getEvents();
  //   setTimeout(() => {
  //     (ev as InfiniteScrollCustomEvent).target.complete();
  //   }, 500);
  // }

  



}
