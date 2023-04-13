import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }



  private url = 'http://localhost:3300';
  headers = new HttpHeaders().set('Content-Type', 'application/json');


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
    // Añadir el encabezado de tipo de contenido
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // Realizar la solicitud HTTP con el encabezado de tipo de contenido
    return this.http.post(url, data, { headers: headers });
  }

  register(user: string, name: string, password: string, email: string): Observable<any> {

    console.log('user:', user, ' password:', password);

    const url = `${this.url}/register`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(url, {
      user: user,
      name: name,
      password: password,
      email: email,
    }, { headers: headers });

  }

  updateUser(id:any, dataToUpdate: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(`${this.url}/updateUser/${id}`, dataToUpdate, { headers });
  }

  loggedIn(): boolean {
    //Devuelve true si el usuario está logueado
    return !!localStorage.getItem('token');

  }

  logOut(): void {
    //Elimina el token del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  getToken() {
    //Devuelve el token
    return localStorage.getItem('token');
  }

  getUser(): Observable<any> {
    const url = `${this.url}/getUser`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.http.get(url, { headers: headers });
  }

}
