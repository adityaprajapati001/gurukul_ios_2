import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/token/token.service';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.page.html',
  styleUrls: ['./grades.page.scss'],
})
export class GradesPage implements OnInit {
userId:any;
  constructor(private authService: AuthService,private tokenService: TokenService) { }

  ngOnInit() {
    this.getGrades();
  }

  getGrades(){
    this.userId = this.tokenService.getUser();
    this.authService.getGradesByUserId(this.userId[0].id).subscribe((res) => {
      console.log(res);
    })
  }

}
