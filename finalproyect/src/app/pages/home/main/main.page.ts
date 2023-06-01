import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AlertController, InfiniteScrollCustomEvent, NavController, PopoverController } from '@ionic/angular';
import { EventsInterface } from 'src/app/interfaces/event';
import { UsersInterface } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { FilterpipePipe } from 'src/app/pipes/filterpipe.pipe';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  hasMoreEvents: boolean;
  
  

  constructor(private navCtrl: NavController,
    private eventService: EventService,
    private alertCtrl: AlertController,
    private auth: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private popoverController: PopoverController) { 

  
    }
 // Para el infinite scroll
displayedEvents: any[] = []; // Eventos que se muestran actualmente en la página
loadMoreEventsThreshold: number; // Umbral de carga para el infinite scroll

// Para el filtro de categorias
  categories: any[] = [];
  // Para recoger los eventos
  myEvents: EventsInterface[] = [];
  // Para recoger el id del usuario
  userId = localStorage.getItem('userId');
  // Para recoger el id del autor del evento
  userAuthor: string;
  // Para recoger la categoria seleccionada
  selectedCategory: string = null;
  // Para filtrar eventos
  filteredEvents: EventsInterface[];
  // Para filtrar categorias
  filteredCategory: string = null;
  // Para recoger los eventos
  allEvents: EventsInterface[];
  // Para la searchbar
  searchQuery: string = '';
  // Para el filtrado
  selectedOption: string;
  // Para el filtrado
  options: any[];
  // Para el infinity scrroll
  loadingMoreEvents = false;
  // Para actualizar
  suscription: Subscription;
 

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
      { value: 'numero-participantes', label: 'Núm. participantes',checked: false},
    
    ];
    
  
   
    
  }


  ionViewWillEnter() {

    

    this.getEvents();
    this.suscription= this.eventService._refreshNeeded$.subscribe(() => {
      this.getEvents();

    });

  }

  //llama al servicio para obtener los eventos
  getEvents() {
    this.eventService.getEvents().subscribe({
      next: async (data) => {
        this.myEvents = await Object.values(data);
        const currentDate = new Date();
        this.allEvents = this.myEvents.filter(event => new Date(event.date) > currentDate);
        this.allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        this.displayedEvents = this.allEvents.slice(0, 5);
       // Capitalizar la primera letra de event.name
       this.displayedEvents.forEach((event: EventsInterface) => {
        event.name = this.capitalizeWords(event.name);
        console.log(event.name);
      }
     );
    
      }
    });
  }

  capitalizeWords(str: string):string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  
  loadMoreEvents(event: any) {
    // Simula una carga asincrónica con un retraso de 1 segundo
    setTimeout(() => {
      const startIndex = this.displayedEvents.length;
      const endIndex = startIndex + 5;
      const moreEvents = this.allEvents.slice(startIndex, endIndex);
      this.displayedEvents = this.displayedEvents.concat(moreEvents);
      event.target.complete();
  
      
      
    }, 1000);
  }
    
    getCategoryIcon(categoryId: string): string {
      const category = this.categories.find(category => category.id === categoryId);
      return category ? category.icon : '';
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

  


  //Navega a la página de información del evento
  selectEvent(id: string) {
    localStorage.removeItem('previousUrl');
    this.navCtrl.navigateForward(`/event-info/${id}`);
    localStorage.setItem('previousUrl', location.href);
  }
  handleRefresh(event) {
    setTimeout(() => {
      this.getEvents();
      event.target.complete();
    }, 2000);
  }

}
