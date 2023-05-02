import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImgServiceService {

  constructor(private http: HttpClient, private auth:AuthService) { }

  private url = 'http://localhost:3300';
  // private url = 'https://finalproject-gout.herokuapp.com';
  
  headers = new HttpHeaders().set('Content-Type', 'application/json');


  uploadUserImg(id: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    
    formData.append('picture', file, file.name);
    const url = `${this.url}/uploadUserImg/${id}`;
    return this.http.put(url, formData);
  }

//  async uploadUserImg(image:File) {
//   try {

//     console.log(image);

//     //Comprueba si la foto pesa más de 1MB
//     if (image.size > 1000000) throw new Error('Image too heavy');

//     //Comprueba si la foto es de tipo imagen
//     if (!image.type.includes('image')) throw new Error('Image must be an image');

//     //Comprueba si la foto es de tipo png, jpg o jpeg
//     if (!['image/png', 'image/jpg', 'image/jpeg'].includes(image.type)) throw new Error('Photo must be a png, jpg or jpeg');

//     const id = this.auth.getId();

//     //Si no hay usuario, no hace nada
//     if (!id) return;

//     //Creamos un formdata para enviar la foto al servidor
//     const formData = new FormData();
//     formData.append('file', image);


//     console.log(formData);

//     //Actualiza la foto de perfil del usuario en la base de datos del servidor. Pasamos el id del usuario, y los datos a actualizar por parámetro
//     const res: any = await firstValueFrom(this.http.put(`${this.url}/uploadEventImg/${id}`, formData))

//     //Obtiene la Data de la respuesta y almacenamos la url de la imagen
//     const urlImage = res.data.picture;
//   } catch (error: any) {
//     console.error(`Error updating user photo: ${error}`);
//     //Lanzamos el error mediante al front
//     throw error;
//   }

// }

  uploadEventImg(formData: FormData, eventId: string) {
    return this.http.post(`${this.url}/uploadEventImg/${eventId}`, formData);
  }

}
