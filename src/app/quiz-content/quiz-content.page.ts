import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { IonContent, IonInput, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Subscription, interval } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TokenService } from '../services/token/token.service';

@Component({
  selector: 'app-quiz-content',
  templateUrl: './quiz-content.page.html',
  styleUrls: ['./quiz-content.page.scss'],
})
export class QuizContentPage implements OnInit {
  @ViewChild('contentContainer') contentContainer: any = ElementRef ;  
  @ViewChild(IonContent, { static: true }) content!: IonContent;
  @ViewChild('myInput', { static: true }) myInput: any = IonInput;

  @Input() durationInSeconds: number = 600;
  timer: number = this.durationInSeconds;
  timerSubscription!: Subscription;
  selectedValues: any = {};
  showNext: boolean = false;
  attemptId: any;
  quizData: any;
  extractedValues: any[] = [];
  nextDisabled: boolean = false;
  timerStarted: boolean = false;
  className: any = '';
  quizContent = [
    {
      id: 1,
      heading: 'Question 1',
      en: 'If you know the sender you, you can click the email link',
      hn: '( यदि आप ईमेल भेजने वाले को जानते है तो आप ईमेल भेजने वाले के लिंक पर क्लिक कर सकते है ? )',
      a: 'True',
      b: 'False',
      selectedValue: null,
    },
    {
      id: 2,
      heading: 'Question 2',
      en: 'If you know the sender you, you can click the email link',
      hn: '( यदि आप ईमेल भेजने वाले को जानते है तो आप ईमेल भेजने वाले के लिंक पर क्लिक कर सकते है ? )',
      a: 'True',
      b: 'False',
      selectedValue: null,
    },
  ];
  quizName: any;

  quizAttamptData: any;
  data: any;
  courseId: any 
  quizId: any;
  lastactiontime: any;

  sanitizedHtml: SafeHtml;

  datanew: any;

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    public sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private toastCtrl: ToastController,
    private tokenService: TokenService,
    private loadingController: LoadingController,
  ) {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params);
      this.quizName = localStorage.getItem('quizName');
      console.log('attemptId',this.attemptId)
      if (params && params.data) {
        if(!this.attemptId) {
          this.attemptId = Number(JSON.parse(params.data));
          this.getAttemptSummary();
        } else {
          if(this.attemptId !== JSON.parse(params.data)) {
            this.attemptId = Number(JSON.parse(params.data));
            this.getAttemptSummary();
            // Select the div element with the specified class
          }
        }
        
      }
    });
  }

  ngOnInit() {
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(this.quizData);
    // this.startTimer();
    this.getData();
    this.getMaxAttemptData();
    this.triggerTimer();
  }

  scrollToBottom(): void {
    const container = this.contentContainer.nativeElement;
    this.renderer.setProperty(container, 'scrollTop', 0);
  }
  ionViewWillEnter() {
    // Scroll to the top when returning from the second component
    // this.content.scrollToTop();
    // window.scroll(0,0)
    // const contentElement = this.contentContainer.nativeElement.querySelector('ion-content');
    // contentElement.scrollToTop(1300); 
      this.myInput.nativeElement.style.display = '';
      this.myInput.nativeElement.scrollIntoView();
      this.myInput.nativeElement.style.display = 'none';
    // this.scrollToTop();
    // this.content.scrollToPoint(0, 0, /* Duration in milliseconds */);
  }

  scrollToTop() {
    if (this.content) { // Check if content reference is valid
      this.content.scrollToTop().then(() => {
        console.log("Scrolled to top successfully");
      }).catch((error) => {
        console.error("Error scrolling to top:", error);
      });
    } else {
      console.error("Content reference not found");
    }
  }

  
  async getData() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 5000
    });
    return this.authService.getQuizData(this.data, this.courseId).then(
      async (res: any) => {

        await loading.present();
        console.log('get data', this.data, this.courseId);
        this.quizAttamptData = await res['0'];
        console.log(this.quizAttamptData,"this.quizAttamptData");
        if (this.quizAttamptData) {
          const gradepass = await Number(this.quizAttamptData.gradepass);
          const grademax = await Number(this.quizAttamptData.grademax);
          this.quizAttamptData.gradepass = await gradepass.toFixed(2);
          this.quizAttamptData.grademax = await grademax.toFixed(2);
        }
         console.log(this.quizAttamptData,"this.quizAttamptData");
         await loading.dismiss();
      },
      (error) => {
        console.error('Login failed:', error);
      },
    )
  }


  async getMaxAttemptData() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 5000
    });
    this.authService.getMaxAttemptData(this.quizId, this.tokenService.getUser()[0].id).subscribe(
      async (res: any) => {
        await loading.present();
        console.log('res', res);
      });
      await loading.dismiss();
  }


  // async getAttemptSummary() {
  //   const loading = await this.loadingController.create({
  //     message: 'Loading...',
  //     duration: 1000
  //   });
  //   this.authService.getAttemptSummary(this.attemptId).subscribe({
  //     next: async (data) => {
  //       await loading.present();
  //       this.lastactiontime = data.questions[0].lastactiontime;
  //       console.log('getAttemptSummary', data);

  //       this.quizData = data.questions.map((question: any, i: any) => ({
  //         ...question,
  //         sanitizedHtml: this.sanitizer.bypassSecurityTrustHtml(
  //           question.html.replace(
  //             /href=\"#\"/g,
  //             'style="color: #212529;text-decoration: none"'
  //           )
  //         ),
  //       }));

  //       console.log("this.quizData - ", this.quizData);
  //       this.executeScripts();
  //       await loading.present();
  //     },
  //     error: (error) => {
  //       console.error('Login failed:', error);
  //     },
  //   });
  // }


  async getAttemptSummary() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 1000
    });
  
    try {
      await loading.present(); // Show the loading spinner before starting the HTTP request
  
      this.authService.getAttemptSummary(this.attemptId).subscribe({
        next: (data) => {
          this.lastactiontime = data.questions[0].lastactiontime;
          console.log('getAttemptSummary', data);

          this.datanew = data.questions[3].html;
          console.log("datanew",this.datanew);
  
          this.quizData = data.questions.map((question: any) => ({
            ...question,
            sanitizedHtml: this.sanitizer.bypassSecurityTrustHtml(
              question.html.replace(
                /href=\"#\"/g,
                'style="color: #212529;text-decoration: none"'
              )
            ),
          }));
  
          console.log("this.quizData - ", this.quizData);
          this.executeScripts();
        },
        error: (error) => {
          console.error('Error fetching attempt summary:', error);
        },
        complete: () => {
          loading.dismiss(); // Ensure the spinner is dismissed after the request completes
        }
      });
    } catch (err) {
      console.error('Error showing loading spinner:', err);
      await loading.dismiss(); // Ensure the spinner is dismissed if an error occurs
    }
  }


  executeScripts() {
    this.quizData.forEach((question: any) => {
      const script = this.renderer.createElement('script');
      this.renderer.appendChild(document.body, script);
    });
  }

  extractValues() {
    const questions = document.querySelectorAll<HTMLDivElement>('.que');
    console.log(questions);

    questions.forEach((question, index) => {
      console.log(question);
      console.log(index);

      const questionNumber = index + 1;
      const selectedRadio = question.querySelector<HTMLInputElement>(
        'input[type="radio"]:checked'
      );
      const selectedCheckbox = question.querySelector<HTMLInputElement>(
        'input[type="checkbox"]:checked'
      );

      const questionValues: { [key: string]: string } = {
        slot: questionNumber.toString(),
        questionId: question.id,
        answer: selectedRadio ? selectedRadio.value : 'Not answered',
        flag: selectedCheckbox ? selectedCheckbox.value : 'Not answered',
      };
      this.extractedValues.push(questionValues);
    });
    console.log(this.extractedValues);
  }

  async startTimer() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 1000
    });
    const timer$ = interval(1000);
    this.timerSubscription = timer$.subscribe(async () => {
      await loading.present();
      // console.log('time', this.timerSubscription);
      if (this.timer > 0) {
        this.timer--;
      }
      if (this.timer <= 0 && !this.timerStarted) {
        this.timerStarted = true;
        this.nextDisabled = true;
        this.presentToast('Time Limit exceeded, Please try again', 'danger');
      }
      await loading.dismiss();
    });
  }
  
  triggerTimer() {
    this.startTimer();
  }


  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
  }

  pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  handleChange(event: any, item: any) {
    console.log('Current value:', event.target.value, item);
    this.selectedValues[item.heading] = event.target.value;
    console.log(this.selectedValues);
  }

  clearSelection(item: any) {
    item.selectedValue = null;
    delete this.selectedValues[item.heading];
    console.log(this.selectedValues);
  }

  onBookmark() {
    this.menuCtrl.open('quizMenu');
  }

  onNext() {
    this.extractedValues = [];
    this.extractValues();
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: this.attemptId,
        data: JSON.stringify(this.extractedValues),
      },
    };
    localStorage.setItem("className", JSON.stringify(this.className))
    this.router.navigate(['attempt-summary'], navigationExtras);
  }
  
  onClose() {
    this.menuCtrl.close('quizMenu');
  }

  onSubmit() {
    this.router.navigate(['index-quiz']);
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
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
