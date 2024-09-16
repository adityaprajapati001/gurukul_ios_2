import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/token/token.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {
  @Input() profileImg: any;
  userId: any;
  userImg: any;
  userData: any[] = [];
  id: any;
  userDataProfile:any;

  constructor(private authService: AuthService, private tokenService: TokenService,private menuCtrl: MenuController,
    private router: Router, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.getUserProfile();
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

  async loadUserData() {
    try {
      this.userData = await this.tokenService.getUser();
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  onProfile() {
    this.menuCtrl.open('moreProfile');
  }

  onGrades() {
    this.router.navigate(['grades']);
  }
  onBadges() {
    this.router.navigate(['badges']);
  }
  onPreferences() {
    this.router.navigate(['preferences']);
  }

  async openCapacitorSite() {
    await Browser.open({ url: 'https://gurukul.skfin.in' });
  }

  onClose() {
    this.menuCtrl.close('moreProfile');
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
  
  getUserProfile() {
    this.userId = JSON.parse(localStorage.getItem('username') as string);
    this.authService.getUserInfo(this.userId).subscribe({
      next: (data) => {
        console.log(data,"userDataProfile");
        this.userDataProfile = data

        for (let i = 0; i < data.length; i++) {
          this.id = this.userDataProfile[i].id
          this.userImg = this.userDataProfile[i].profileimageurl
        }
        

        this.tokenService.saveUser(this.userDataProfile);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
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

}
