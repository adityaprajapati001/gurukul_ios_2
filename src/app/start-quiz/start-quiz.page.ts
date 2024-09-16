import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-start-quiz',
  templateUrl: './start-quiz.page.html',
  styleUrls: ['./start-quiz.page.scss'],
})
export class StartQuizPage implements OnInit {
  attemptId: any;
  
  constructor(private router: Router,private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params: any) => {
      console.log("params", params);

      if (params && params.data) {
        console.log("params.data", params.data);
        console.log("JSON.parse(params.data)", JSON.parse(params.data));
        this.attemptId = JSON.parse(params.data);
        console.log("this.attemptId", this.attemptId);
      }
    });
   }

  ngOnInit() {
  }

  onStart(){
    console.log("this.attemptId", this.attemptId);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(this.attemptId),
      },
    };
    console.log("navigationExtras", );
    this.router.navigate(['quiz-content-update'], navigationExtras);
  }
  onClose(){
    this.router.navigate(['index-quiz'])
  }
}
