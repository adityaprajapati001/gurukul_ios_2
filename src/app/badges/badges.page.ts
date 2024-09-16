import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/token/token.service';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.page.html',
  styleUrls: ['./badges.page.scss'],
})
export class BadgesPage implements OnInit {
  userId: any;
  constructor(private authService: AuthService,private tokenService: TokenService) { }

  ngOnInit() {
    this.getBadges();
  }

  getBadges(){
    this.userId = this.tokenService.getUser();
    
    this.authService.getBadgesByUserId(this.userId[0].id).subscribe((res) => {
      console.log(res);
    })
  }

}
