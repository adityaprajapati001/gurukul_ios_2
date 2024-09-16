import { Component, OnInit, ViewChild } from '@angular/core';
import { NetworkService } from './services/network-service/network.service';
import {  IonRouterOutlet, Platform, ToastController } from '@ionic/angular';

import { Router } from '@angular/router';
import { App } from '@capacitor/app';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;
  constructor(private networkService: NetworkService, private platform: Platform,private router: Router,private toastController:ToastController,
  
  ) {
    this.initializeApp()
    }

    initializeApp() {
      this.platform.ready().then(() => {
        this.backButtonEvent();
      });
    }
  
    backButtonEvent() {
      this.platform.backButton.subscribeWithPriority(10, async () => {
        if (this.routerOutlet && this.routerOutlet.canGoBack()) {
          this.routerOutlet.pop();
        } else if (this.router.url === '/home') {
          App.exitApp();
          // if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
          //   // Exit app
          //   App.exitApp();
          // } else {
          //   const toast = await this.toastController.create({
          //     message: 'Press back again to exit',
          //     duration: 2000
          //   });
          //   toast.present();
          //   this.lastTimeBackPress = new Date().getTime();
          // }
        } else {
          // Navigate to the previous page or home
          this.router.navigate(['/home']);
        }
      });
    }

  ngOnInit() {
    this.networkService.checkNetworkStatus();
    this.networkService.watchNetworkChanges();
  }


}
