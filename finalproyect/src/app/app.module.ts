import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

// import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';



@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
    FormsModule,
     HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule, 
    CommonModule, 
    provideFirebaseApp(() => initializeApp(environment.firebase)), 
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()), 
  
    GoogleTagManagerModule.forRoot({ id: 'GTM-TNPDZ77' })],
    
  providers: [DatePipe, Geolocation, NativeGeocoder, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
