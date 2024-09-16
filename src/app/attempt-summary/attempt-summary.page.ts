import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LoadingController, MenuController, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataService } from '../services/data-servicee/data-service.service';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-attempt-summary',
  templateUrl: './attempt-summary.page.html',
  styleUrls: ['./attempt-summary.page.scss'],
})
export class AttemptSummaryPage implements OnInit {
  attemptData: any;
  attemptId: any;
  finishAttempt: any;
  attempResult: any;

  homepage: HomePage;

  quizContent = [
    {
      id: 1,
      heading: 'Question 1',
      en: 'If you know the sender you, you can click the email link',
      hn: '( यदि आप ईमेल भेजने वाले को जानते है तो आप ईमेल भेजने वाले के लिंक पर क्लिक कर सकते है ? )',
      a: 'True',
      b: 'False',
      selecetdValue: null,
    },
    {
      id: 2,
      heading: 'Question 2',
      en: 'If you know the sender you, you can click the email link',
      hn: '( यदि आप ईमेल भेजने वाले को जानते है तो आप ईमेल भेजने वाले के लिंक पर क्लिक कर सकते है ? )',
      a: 'True',
      b: 'False',
      selecetdValue: null,
    },
  ];
  constructor(private menuCtrl: MenuController, private dataService:DataService, private router: Router, private route: ActivatedRoute,
    private http: HttpClient,private loadingController: LoadingController, public navCtrl: NavController) {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params);

      if (params && params.data) {
        this.attemptData = JSON.parse(params.data);
        this.attemptId = JSON.parse(params.id);
        console.log(this.attemptData);

      }
    });
  }

  ngOnInit() {
  }

  onBookmark() {
    this.menuCtrl.open('attemptMenu');
  }

  onClose() {
    this.menuCtrl.close('attemptMenu');
  }

  async onSubmit() {
    let k = 0;
    console.log(this.attemptData);
    const loading = await this.loadingController.create({
      message: 'Fetching Result, It will take some time...',
      duration: this.attemptData.length * 500
    });
    await loading.present();

    for (let j = this.attemptData.length - 1; j >= 0; j--) {
      if (Number(this.attemptData[j].answer) !== -1) {
        k = j;
        break;
      }
    }

    console.log(k);
    for (let i = 0; i < this.attemptData.length; i++) {
      console.log('attempt data----', this.attemptData[i].answer);

      if (Number(this.attemptData[i].answer) !== -1) {
        console.log('value of i------', i);
        console.log('check');

        setTimeout(() => {
          const token = localStorage.getItem('auth-token')
          this.http.get(`https://gurukul.skfin.in/webservice/rest/server.php?attemptid=${this.attemptId}&data[0][name]=slot&data[0][value]=${this.attemptData[i].slot}&data[1][name]=q${(this.attemptData[i].questionId.split("-"))[1]}:${this.attemptData[i].slot}_answer&data[1][value]=${this.attemptData[i].answer}&data[2][name]=q${(this.attemptData[i].questionId.split("-"))[1]}:${this.attemptData[i].slot}_:sequencecheck&data[2][value]=1&finishattempt=${i === k ? 1 : 0}&wsfunction=mod_quiz_process_attempt&wstoken=${token}`)
            .subscribe((res: any) => {
              console.log(res);
            }, (error) => {
              console.error('HTTP request failed:', error);
            });
        }, 500 * i);
      }
    }
    setTimeout(() => {
      const token = localStorage.getItem('auth-token')
      this.http.get(`https://gurukul.skfin.in/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_get_attempt_review&wstoken=${environment.adminToken}&attemptid=${this.attemptId}&page=1`).subscribe((res: any) => {
        this.attempResult = res;
        console.log(this.attempResult);

      })
    },this.attemptData.length * 500)

    setTimeout(async () => {
      await loading.dismiss();
      console.log(this.attempResult);
      this.dataService.setIndexActivityContent(this.attempResult)
      let navigationExtras: NavigationExtras = {
        queryParams: {
          quizResult: JSON.stringify(this.attempResult),
        },
      };
      this.router.navigate(['/home'],navigationExtras).then(() => {
        window.scrollTo(0, 0);
      });
    },this.attemptData.length * 600);
    // this.router.navigate(['/home']);
  }

  goToQues(item: any){
    console.log(item);
    // this.router.navigate(['quiz-content'])

    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(this.attemptId),
      },
    };
    this.router.navigate(['quiz-content-update'], navigationExtras);
  }
}
