import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {


  constructor(private auth:AuthService, private router:Router) { }
  canActivate(

    state: RouterStateSnapshot): boolean {

      if(this.auth.loggedIn()){
        
        if(state.url==='/presentation'){
          this.router.navigate(['/home/main']);
          return false;

        }

        if(state.url==='/login' || state.url==='/signup'){
          this.router.navigate(['/home/main']);
          return false;

        }


      }

      if(this.auth.isAdmin()){
        if(state.url==='/presentation'){
          this.router.navigate(['/home-admin']);
          return false;
        }
        if(state.url==='/login' || state.url==='/signup'){
          this.router.navigate(['/home-admin']);
          return false;
        }
      }

      return true;

  }

}
