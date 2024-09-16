import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { ToastController } from '@ionic/angular';
import { TokenService } from '../services/token/token.service';
import { DataService } from '../services/data-servicee/data-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-index-quiz',
  templateUrl: './index-quiz.page.html',
  styleUrls: ['./index-quiz.page.scss'],
})
export class IndexQuizPage implements OnInit {
  @ViewChild('popover') popover: any;
  isOpen = false;
  data: any;
  attemptId: any;
  quizData: any;
  errorMsg: any;
  warningMsg: any;
  courseId: any 
  quizId: any 
  quizResult: any;
  quizGrade: any;
  quizName: any;
  showGrade: boolean = false;
  quizAttamptData: any;
  maxQuizAttamptData: any;
  showButton: boolean = true;
  subscription:Subscription;
  quizFinishTime: any;
  timefinish: any;
  constructor(private router: Router, private route: ActivatedRoute,private dataService:DataService,
    private authService: AuthService, private toastCtrl: ToastController, private tokenService: TokenService) {
      this.quizName = localStorage.getItem('quizName')
    this.route.queryParams.subscribe((params: any) => {
    
      // new / inprogress test flow
      if (params && params.data) {
        console.log("beforee submit :",params);
        this.attemptId = ''
        this.data = JSON.parse(params.data);
        this.courseId = params.courseId;
        this.quizId = parseInt(params.data);
        console.log("beforee submit 1:",this.tokenService.getUser()[0].id, this.data,this.courseId);
        this.authService.isAttemptFinish(this.tokenService.getUser()[0].id, this.data).subscribe({
          next: (data) => {
            console.log(data);
            
            if (data[0].state === '') {
              console.log('empty');

              this.authService.startQuizById(this.data).subscribe({
                next: (data) => {
                  console.log(data);
                  this.data = data;
                  if (data.attempt) {
                    this.attemptId = data.attempt.id

                    this.linkUserAttempt();
                    if (data.warnings.length > 0 && data.warnings[0].message) {
                      this.warningMsg = this.data.warnings[0].message;
                      this.showButton = false;
                      console.log(this.data.warnings[0].message);
                      this.presentToast(this.warningMsg, 'danger');
                    }
                    // this.getAttemptSummary();
                    console.log(this.attemptId);
                  } else {
                    this.errorMsg = this.data.message


                  }
                },
                error: (error) => {
                  console.error('Login failed:', error);
                },
              });
            }else
            if (data[0].state === "finished") {
              console.log('finished');

              this.authService.startQuizById(this.data).subscribe({
                next: (data) => {
                  console.log(data);
                  this.data = data;
                  if (data.attempt) {
                    this.attemptId = data.attempt.id
                    this.linkUserAttempt();
                    if (data.warnings.length > 0 && data.warnings[0].message) {
                      this.warningMsg = this.data.warnings[0].message;
                      this.showButton = false;
                      console.log(this.data.warnings[0].message);
                      this.presentToast(this.warningMsg, 'danger');
                    }
                    // this.getAttemptSummary();
                    console.log(this.attemptId);
                  } else {
                    this.errorMsg = this.data.message
                    console.log(this.errorMsg);

                  }
                },
                error: (error) => {
                  console.error('Login failed:', error);
                },
              });
            }else
            if (data[0].state === "inprogress") {
              console.log('inprogress');

              this.attemptId = data[0].id
              this.linkUserAttempt();
            }
          },
          error: (error) => {
            console.error(error);
          },
        });

      }
      
      // after submit test 
      if (params.quizResult) {


        this.subscription = this.dataService.indexQuizContent.subscribe(data =>{
          // this.data = data
        this.quizResult = data;
        this.showGrade = true;
        this.quizGrade = data.grade
        this.quizFinishTime=data.attempt.timefinish

      

        this.authService.startQuizById(this.quizResult.attempt.quiz).subscribe({
          next: (data) => {
           
            this.data = data;
            console.log('data', data);
            if (data?.attempt) {
              this.attemptId = data.attempt.id;
              if (data.warnings.length > 0 && data.warnings[0].message) {
                this.warningMsg = this.data.warnings[0].message;
                this.showButton = false;
            
                this.presentToast(this.warningMsg, 'danger');
              }
              this.linkUserAttempt();
              // this.getAttemptSummary();
              console.log(this.attemptId);
            } else {
              this.errorMsg = this.data.message
              console.log(this.errorMsg);

            }
          },
          error: (error) => {
            console.error('Login failed:', error);
          },
        });
        })

       
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getMaxAttemptData();
    this.getData();
  }

  convertTimestamp(timestamp: number) {
    const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
    return date.toLocaleString(); // Convert to a readable format
  }

  async getData() {
    return this.authService.getQuizData(this.data, this.courseId).then(
      async (res: any) => {
        this.quizAttamptData = await res['0'];
        console.log(this.quizAttamptData,"this.quizAttamptData");
        if (this.quizAttamptData) {
          const gradepass = await Number(this.quizAttamptData.gradepass);
          const grademax = await Number(this.quizAttamptData.grademax);
          this.quizAttamptData.gradepass = await gradepass.toFixed(2);
          this.quizAttamptData.grademax = await grademax.toFixed(2);
        }
         console.log(this.quizAttamptData,"this.quizAttamptData");
      },
      (error) => {
        console.error('Login failed:', error);
      },
    )
  }

  getMaxAttemptData() {
    this.authService.getMaxAttemptData(this.quizId, this.tokenService.getUser()[0].id).subscribe(
      (res: any) => {
        console.log('res', res);
        this.timefinish =  res.attempts[0].timefinish;
        console.log('timefinish', this.timefinish);
        this.maxQuizAttamptData = res.attempts;
        console.log("this.quizResult -- ", this.quizResult);
        console.log("this.data *--* ", this.data);
        if (this.maxQuizAttamptData.length == 0 && this.data && this.quizResult != undefined) {
          if (typeof this.data === 'object') {
            this.maxQuizAttamptData.push(this.data.attempt);
          } else {
            this.maxQuizAttamptData = this.data.attempt;
          }
        }
        if (this.maxQuizAttamptData) {
          this.maxQuizAttamptData.forEach((obj: any) => {
            obj.gradesOfAttempt = (Number(obj.sumgrades == null ? 0 : obj.sumgrades)/(Number(this.quizAttamptData?.totalmarks?.split('.')[0])/Number(this.quizAttamptData?.grademax.split('.')[0])));
            if (Number.isNaN(obj.gradesOfAttempt)) {
              obj.gradesOfAttempt = 0;
            }
          });
        }
        console.log("this.maxQuizAttamptData", this.maxQuizAttamptData)
      },
      (error) => {
        console.error('Login failed:', error);
      },
    )
  }

  linkUserAttempt() {
    // console.log(this.data);

    // this.authService.linkUserByItsAttempt(this.tokenService.getUser()[0].id, this.data,this.attemptId).subscribe({
    //   next: (data) => {
    //     console.log(data);
    //   },
    //   error: (error) => {
    //     console.error('Login failed:', error);
    //   },
    // });
  }

  checkAttempt() {
    console.log(this.tokenService.getUser()[0].id);

    // this.userId = this.tokenService.getUser()[0].
    this.authService.isAttemptFinish(this.tokenService.getUser()[0].id, this.data).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  getAttemptSummary() {
    this.authService.getAttemptSummary(this.attemptId).subscribe({
      next: (res) => {
        this.quizData = res
        console.log(res);

      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }
  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  onStart() {
    if (this.errorMsg) {
      this.presentToast(this.errorMsg, 'danger');
    }
    if (this.warningMsg) {
      this.presentToast(this.warningMsg, 'danger');
    }
    if (this.attemptId !== '' && this.attemptId !== undefined) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(this.attemptId),
        },
      };
      this.router.navigate(['start-quiz'], navigationExtras);
    }
    
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
