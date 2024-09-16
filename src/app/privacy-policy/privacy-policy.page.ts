import { Component, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { MenuController, ToastController } from '@ionic/angular';
import { TokenService } from '../services/token/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {

  userImg: any;
  userId: any;
  userData: any[] = [];
  id: any;

  constructor(
    private menuCtrl: MenuController,
    private tokenService: TokenService,
    private router: Router, 
    private toastCtrl: ToastController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('username')
    this.authService.getUserInfo(this.userId).subscribe({
      next: (data) => {
        console.log(data);
        this.userData = data

        for (let i = 0; i < data.length; i++) {
          this.id = this.userData[i].id
          this.userImg = this.userData[i].profileimageurl
        }
        console.log(this.id);
        
        // this.tokenService.saveUser(this.userData);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  async openCapacitorSite() {
    await Browser.open({ url: 'https://gurukul.skfin.in' });
  }

  onClose() {
    this.menuCtrl.close('privacy');
  }

  onLogout() {
    this.tokenService.logOut();
    this.presentToast('Logged Out successfully', 'success');
    this.router.navigate(['login']).then(() => {
      setTimeout(() => {
        location.reload();
      }, 1000);
    });
  }

  async presentToast(message: any, color: any) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: color,
    });

    toast.present();
  }

  onProfile() {
    this.menuCtrl.open('privacy');
  }

}
