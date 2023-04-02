import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth:AuthService, private router:Router){
    
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{

  //     const url:string = route.routeConfig.path;

      
  //   if(url === 'login'){
  //     if(this.auth.login){
  //       this.router.navigate(['/home/main'])
  //       return false;
  //     }

  //     return true
  //   }

  //   if(this.auth.login){
  //     return true;
  //   }
    
  //   this.router.navigate(['/login']);
  //   return false;
  // }
    return true;
  }
}

