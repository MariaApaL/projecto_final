import { Component } from '@angular/core';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { NavigationEnd, Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
 
  constructor(private gtmService:GoogleTagManagerService,
    private router : Router) {

      gtmService.addGtmToDom();
     }

  ngOnInit(){
  this.router.events.forEach(item=>{
    if(item instanceof NavigationEnd){
      const gtmTag = {
        'event':'page',
        'pageName':item.url
      };
      this.gtmService.pushTag(gtmTag)
    }
  });
    
  }
}