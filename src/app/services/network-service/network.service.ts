import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(private alertController: AlertController) {}

  async checkNetworkStatus() {
    const status = await Network.getStatus();
    
    if (!status.connected) {
      await this.presentAlert();
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'No Internet Connection',
      message: 'Please check your internet connection and try again.',
      buttons: ['OK']
    });

    await alert.present();
  }

  watchNetworkChanges() {
    Network.addListener('networkStatusChange', async (status) => {
      if (!status.connected) {
        await this.presentAlert();
      }
    });
  }
}
