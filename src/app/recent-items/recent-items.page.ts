import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/token/token.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-recent-items',
  templateUrl: './recent-items.page.html',
  styleUrls: ['./recent-items.page.scss'],
})
export class RecentItemsPage implements OnInit {
  recentData: any[] = [];
  userId: any;
  id: any;
  userData: any[] = [];
  constructor(private menuCtrl: MenuController,private authService: AuthService,
    private router: Router,private tokenService: TokenService) { }

  ngOnInit() {
    debugger
    this.getUser();
  }

  getUser() {
    this.userId = localStorage.getItem('username')
    this.authService.getUserInfo(this.userId).subscribe({
      next: (data) => {
        console.log(data);
        this.userData = data

        for (let i = 0; i < data.length; i++) {
          this.id = this.userData[i].id
          // this.userImg = this.userData[i].profileimageurlsmall
        }
        console.log(this.id);
        this.getRecentCourses();
        this.tokenService.saveUser(this.userData);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  getRecentCourses(){
    console.log(this.id);

    this.authService.getRecentCourses().subscribe({
      next: (data) => {
        console.log('recent Data',data);
        data.sort((a:any, b:any) => b.timeaccess - a.timeaccess);
        // Get the top 10 values using slice
        // this.recentData = data.slice(0, 10);
        const uniqueArray = data.filter((obj: any, index: number, self: any) =>
          index === self.findIndex((t: any) => (
            t.cmid === obj.cmid && t.name === obj.name
          ))
        );
        
        this.recentData = uniqueArray.slice(0, 10);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  onCardClick(value: any) {
    console.log(value);
    debugger
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(value),
      },
    };
    this.router.navigate(['cyber-security'], navigationExtras);
  }

  onArrow() {
    this.menuCtrl.open('menu');
  }
}
