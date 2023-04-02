import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  private url = 'http://localhost:3300';



  login(user: string, password: string): Observable<any> {

    console.log('user:', user, ' password:', password);

    const url = `${this.url}/login`;

    let data = {};

    // Si el valor proporcionado es un correo electrónico
    if (user.includes('@')) {
      data = { email: user, password: password };
    } else {
      // Si el valor proporcionado es un nombre de usuario
      data = { user: user, password: password };
    }

    return this.http.post(url, data)
    
}

register(user: string, name: string, password: string, email: string): Observable < any > {

  console.log('user:', user, ' password:', password);

  const url = `${this.url}/register`;

  return this.http.post(url, {
    user: user,
    name: name,
    password: password,
    email: email,

  })

}  

logout(): void {
  localStorage.removeItem('token');
}

getToken(){ //Devuelve el token

  return localStorage.getItem('token');
}

}
