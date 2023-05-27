import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  _refreshNeeded$ = new Subject<void>();

  // Se define la URL base para las solicitudes HTTP y
  //  se establece un encabezado para el tipo de contenido de "application/json".
     private url = 'http://localhost:3300';
  // private url = 'https://finalproject-gout.herokuapp.com';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  // inicio de sesión con los datos de usuario proporcionados en el cuerpo de la solicitud.
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

  //  registro con los datos de usuario proporcionados en el cuerpo de la solicitud.
  register(user: string, name: string, password: string, email: string, picture:string): Observable<any> {

    console.log('user:', user, ' password:', password);

    const url = `${this.url}/register`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { user, name, password, email , picture};
    return this.http.post(url, body, { headers: headers });
  }

  // toma el ID de usuario y un objeto de datos de usuario para actualizar y devuelve un objeto Observable que envía una solicitud HTTP PUT a la URL de actualización de usuario con los datos de usuario proporcionados en el cuerpo de la solicitud.
  updateUser(id: any, dataToUpdate: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(`${this.url}/updateUser/${id}`, dataToUpdate, { headers }).pipe(
      tap(() => {
       this._refreshNeeded$.next();
      }));
  }

  // devuelve un valor booleano que indica si el usuario ha iniciado sesión o no.
  loggedIn(): boolean {
    // Devuelve true si el usuario está logueado
    return !!localStorage.getItem('token');

  }

  // elimina el token del usuario del localStorage para cerrar la sesión del usuario.
  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole')
  }

  //  devuelve el token del usuario almacenado en el localStorage.
  getToken() {
    return localStorage.getItem('token');
  }

  // devuelve el ID del usuario almacenado en el localStorage.
  getId(){
    return localStorage.getItem('userId');
  }

  // busca un usuario por id
  getUserById(id: any): Observable<any> {
    const url = `${this.url}/getUserById/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers: headers });

  }
  
  // Obtener el usuario mediante el token 
  getUser(): Observable<any> {
    const url = `${this.url}/getUser`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('x-access-token', token);
    return this.http.get(url, { headers: headers });
  }

  // guarda en favoritos
  setFavorite(userId: any, eventId: any): Observable<any> {
    const url = `${this.url}/setFavorite/${userId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { eventId};
    return this.http.post(url, body, { headers: headers });
  }

  // obtiene los favoritos
  getFavorites(userId: any): Observable<any> {
    const url = `${this.url}/getFavorites/${userId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers: headers });
  }

  // elimina de favoritos
  deleteFavorite(userId: any, eventId: any): Observable<any> {
    const body = { eventId };
    const url = `${ this.url }/deleteFavorite/${ userId }`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers: headers, body: body };
    return this.http.delete(url, options);
  }


  //obtiene todos los usuarios
  getUsers(): Observable<any> {
    const url = `${this.url}/getAll`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers: headers });
  }

  //se obtiene usuario por id de evento
  getUserByEventId(eventId:string): Observable<any> {
    const url = `${this.url}/getUserByEventId/${eventId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers: headers });
  }

  uploadUserPhoto(eventId: string, picture:File): Observable<any> {
    const URL = `${this.url}/uploadUserPhoto/${eventId}`;
    const formData = new FormData();
    formData.append('picture', picture);
    return this.http.post(URL, formData).pipe(
      tap(() => {
       this._refreshNeeded$.next();
      }));
  }  



   //devuelve las valoraciones de un usuario
   getValuationsByAuthor(userId: string): Observable<any> {
    const url = `${this.url}/getValuationsByAuthor/${userId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers: headers });
  }

  //resetar contraseña
  forgotPassword(email: string): Observable<any> {
    const url = `${this.url}/forgotPassword`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { email };
    return this.http.post(url, body, { headers: headers });
  }


}
