import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/token/token.service';
import { MenuController, ToastController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  userId: any;
  userImg: any;
  notifications:any = [];
  isNotificationAlertOpen:boolean = false;
  singleNotificationData:any = '';
  alertButtons = ['Ok'];
  userData: any[] = [];

  constructor(private authService: AuthService,private tokenService: TokenService,
    private menuCtrl: MenuController,
    private router: Router, 
    private toastCtrl: ToastController,
  ) { }

  ionViewDidEnter() {
    this.userImg = this.tokenService.getUser()[0].profileimageurl;
    this.getNotifications();
  }
  async ngOnInit() {
    this.userId = localStorage.getItem('username')
    this.authService.getUserInfo(this.userId).subscribe({
      next: (data) => {
        console.log(data);
        this.userData = data

        for (let i = 0; i < data.length; i++) {
          this.userImg = this.userData[i].profileimageurl
        }
        // this.tokenService.saveUser(this.userData);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  getNotifications(){
    this.userId = this.tokenService.getUser();
   
    console.log(this.userId[0].username);
    
    this.authService.getNotificationByUserId(this.userId[0].id).subscribe((res) => {
      console.log(res);
      this.notifications = res.notifications
    })
  }

  toggleNotificationDetailAlert(singleNotificationData:any) {
    this.isNotificationAlertOpen = !this.isNotificationAlertOpen
    this.singleNotificationData = singleNotificationData
  }

  onProfile() {
    this.menuCtrl.open('menuProfil');
  }

  async onLogout() {
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

  onGrades() {
    this.router.navigate(['grades']);
  }
  onBadges() {
    this.router.navigate(['badges']);
  }
  async openCapacitorSite() {
    await Browser.open({ url: 'https://gurukul.skfin.in' });
  }
  onClose() {
    this.menuCtrl.close('menuProfil');
  }
}
