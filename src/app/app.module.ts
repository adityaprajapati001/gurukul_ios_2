import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

// import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonRouterOutlet, IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { Utility } from './utility/utility';
import { DatePipe } from '@angular/common';
import { PinchZoomDirective } from './pinch-zoom.directive';
import { IndexActivitiesPipe } from './index-activities.pipe';

// Import AngularFire modules
import { AngularFireModule } from '@angular/fire/compat'; // Updated import for AngularFire v6+
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Example Firebase Auth module
import { environment } from '../environments/environment'; // Adjust path as needed

import {NgxIonicImageViewerModule} from '@herdwatch-apps/ngx-ionic-image-viewer';



@NgModule({
  declarations: [AppComponent, PinchZoomDirective, IndexActivitiesPipe],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    NgxIonicImageViewerModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), // Initialize Firebase here
    AngularFireAuthModule // Import other Firebase modules as needed
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },Utility,DatePipe ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
