import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/token/token.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  userId: any = null;
  userData: any = null;
  id: any = null;
  userImg: any = null;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,) {}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userId = JSON.parse(localStorage.getItem('username') as string);
    this.authService.getUserInfo(this.userId).subscribe({
      next: (data) => {
        console.log('profile',data);
        this.userData = data
        for (let i = 0; i < data.length; i++) {
          this.id = this.userData[i].id
          this.userImg = this.userData[i].profileimageurl
        }
        
        this.tokenService.saveUser(this.userData);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }
}
