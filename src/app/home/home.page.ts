import { Component, Input, OnDestroy, Optional } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Network } from '@capacitor/network';
import {
  AlertController,
  IonRouterOutlet,
  MenuController,
  ModalController,
  Platform,
  ToastController,
  LoadingController
} from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/token/token.service';
import { PushNotifications } from '@capacitor/push-notifications';
import { Utility } from '../utility/utility';
import { App } from '@capacitor/app';
import { ZipService } from '../services/zip-service/zip.service';
import { DataService } from '../services/data-servicee/data-service.service';
import { PdfViewerModalPage } from '../modal-controller/pdf-viewer-modal/pdf-viewer-modal.page';
import { FcmService } from '../services/fcm/fcm.service';
import { Subscription } from 'rxjs';
import { AppVersionService } from '../services/app-version/app-version.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy{
  private subscriptions: Subscription = new Subscription();
  
  showAlert: boolean = false;
  showFirst: boolean = true;
  showSecond: boolean = false;
  showThird: boolean = false;
  showFourth: boolean = false;
  selectedDate!: string;
  status: any;
  courseData: any[] = [];
  userId: any;
  id: any;
  pdfUrl:string = '';
  userData: any[] = [];
  userImg: any;
  recentData: any[] = [];
  ticketCounterData: any[] = [];
  counterData: any = null;

  counterdataNew: any[]=[];

  interval: any = null;
  userDataProfile: any = null;
  triggerAnimation: boolean = false;

  isPasswordIncorrect: any;

  // myCourses = [
  //   {
  //     id: 1,
  //     name: 'Cyber Security Awareness',
  //     type: 'Self Learning',
  //     src: 'assets/img/cyber.png',
  //     value: 0.5,
  //   },
  //   {
  //     id: 2,
  //     name: 'New Hire Training',
  //     type: 'Self Learning',
  //     src: 'assets/img/hire.png',
  //     value: 0.0,

  //   },
  //   {
  //     id: 3,
  //     name: 'Compliance Training',
  //     type: 'Self Learning',
  //     src: 'assets/img/compliance.png',
  //     value: 0.11,

  //   },
  // ];
  recCourses = [
    {
      id: 1,
      name: 'New Hire Training Collection',
      type: 'Self Learning',
      src: 'assets/img/newHire.png',
      value: 0,
    },
    {
      id: 2,
      name: '2W & SME',
      type: '2W & SME',
      src: 'assets/img/2w.png',
      value: 0,
    },
  ];
  scormData: any;
  token: any;
  instanceId: any;
  courseId: any;
  loading: any;

  fcmToken:any;

  version: string;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private menuCtrl: MenuController,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private tokenService: TokenService,
    public utility: Utility,
    private route: ActivatedRoute,
    private zipService: ZipService,
    private platform: Platform,
    @Optional() private routerOutlet: IonRouterOutlet,
    private modalController: ModalController,
    private dataService:DataService,
    private loadingController: LoadingController,
    public fcmService: FcmService,
    private appVersionService: AppVersionService
  ) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });
    this.initializeNetworkListener();
    
    // this.route.queryParams.subscribe((params: any) => {
    //   console.log(params);

    //   if (params && params.data) {
    //     this.userId = JSON.parse(params.data);
    //     console.log(this.userId);

    //   }
    // });
  }

  ionViewDidEnter() {
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed', status);
    });
    this.getUser();
    this.getTickerContent();
    this.getUserProfile()
  }

  async ngOnInit() {
   
    // this.initPushNotifications();
    const subscription =  this.getCourses(this.id);
    this.subscriptions.add(await subscription);


    this.appVersionService.getAppVersion().subscribe(
      (data) => {
        console.log('data', data)
        this.version = data.version;
        console.log(this.version);
      },
      (error) => {
        console.error('Error fetching version info', error);
      }
    );

  }

  getUser() {
    this.userId = localStorage.getItem('username')
    this.authService.getUserInfo(this.userId).subscribe({
      next: (data) => {
        console.log('home page profile', data);
        this.userData = data

        for (let i = 0; i < data.length; i++) {
          this.id = this.userData[i].id
          this.userImg = this.userData[i].profileimageurl
        }
        console.log("profile id", this.id);
        console.log("userImage", this.userImg)

        this.tokenService.saveUser(this.userData);
        // this.getUserToken(this.id)
        this.getCourses(this.id);
        this.getRecentCourses(this.id);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  
  getTickerContent() {
    this.authService.getTickerContent().subscribe(
      (data: any) => {
        console.log('Received data:', data);

        if (data.result === 'success' && data['0'] && Object.keys(data['0']).length > 0) {
          const sortedData = Object.values(data['0']).sort((a: any, b: any) => {
            const aValue = a.name.split('tickertext')[1];
            const bValue = b.name.split('tickertext')[1];
            return (parseInt(aValue) || 0) - (parseInt(bValue) || 0);
          });

          sortedData.forEach((item: any) => {
            item['value'] = this.removeTags(item['value']);
          });

          this.ticketCounterData = sortedData;
          this.counterData = sortedData[0];

          console.log('counterData', this.counterData);

          if (this.interval) {
            clearInterval(this.interval);
          }
          this.interval = setInterval(() => {
            this.triggerAnimation = false;
            this.onClickTicCounter();
          }, 10000);
        } else {
          console.error('Unexpected data structure:', data);
        }
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );
  }

 
  // getTickerContent() {
  //   this.authService.getTickerContent().subscribe(
  //     (data: any) => {
  //       console.log('data', data);
  //       this.counterdataNew = data[0][0].value;
  //       console.log('counterdataNew', this.counterdataNew);
  //       if (data.result === "success" && data['0'].length > 0) {
  //         this.ticketCounterData = data['0'].sort((a: any,b: any) => a.name.toString().split('tickertext')[1] - b.name.toString().split('tickertext')[1]);
  //         this.ticketCounterData[0]['value'] = this.removeTags(this.ticketCounterData[0]['value'])
  //         this.counterData = this.ticketCounterData[0];
  //       }
  //       console.log('counterData', this.counterData);

  //       this.ticketCounterData.forEach((item: any) => {
  //           item['value'] = this.removeTags(item['value']);
  //       });

  //       this.interval = setInterval(() => {
  //         this.triggerAnimation = false;
  //         this.onClickTicCounter();
  //       }, 10000)
  //     },
  //     (error) => {
  //       console.error('Error occurred:', error);
  //     } 
  //   );
  // }


  onClickTicCounter() {
    const index: number = this.ticketCounterData.findIndex((o) => o.name === this.counterData.name);
    if (index != -1 && (index + 1) != this.ticketCounterData.length) {
      this.ticketCounterData[index + 1]['value'] = this.removeTags(this.ticketCounterData[index + 1]['value'])
      this.counterData = this.ticketCounterData[index + 1];
    } else {
      this.ticketCounterData[0]['value'] = this.removeTags(this.ticketCounterData[0]['value'])
      this.counterData = this.ticketCounterData[0];
    }
    this.triggerAnimation = true;
  }
  removeTags(htmlString: string): string {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlString;
    return tempElement.textContent || tempElement.innerText || '';
  }

  // getUserToken(id: any) {
  //   console.log(id);

  //   this.authService.getUserToken(id).subscribe({
  //     next: (data) => {
  //       console.log(data[0].token);
  //       // this.tokenService.saveToken(data[0].token)
  //      this.tokenService.saveToken(data[0].token)
  //       const isFirstTimeRefresh = localStorage.getItem('first_time_refresh');

  //       if (!isFirstTimeRefresh) {
  //         localStorage.setItem('first_time_refresh', 'true');
  //         window.location.reload();
  //       }

  //     },
  //     error: (error) => {
  //       console.error(error);
  //     },
  //   });
  // }

  async getCourses(id: any) {
    console.log(id);
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 1000
    });
    this.authService.token = this.tokenService.getToken()
    this.authService.getCourses(id).subscribe({
      next: async (data) => {
        await loading.present();
        console.log('data', data);
        this.courseData = data;
        await loading.dismiss();
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }






  onClickUser() {
    this.router.navigate(['user-profile']);
  }

  getRecentCourses(id: any) {
    console.log(id);

    this.authService.getRecentCourses().subscribe({
      next: (data) => {

        // const uniqueCombinations:any = {};
        // const uniqueArray:any = [];
        console.log('recent Data',data);
        this.isPasswordIncorrect = data.errorcode;
        if(this.isPasswordIncorrect ==='forcepasswordchangenotice') {
          this.router.navigate(['/forgot-pwd']);
        }
        console.log('recent Data',data.errorcode);
        data.sort((a:any, b:any) => b.timeaccess - a.timeaccess);
        // Get the top 10 values using slice
        this.recentData = data.slice(0, 10);

        // data.forEach((item:any) => {
        //     const key = `${item.courseid}-${item.modname}`;
        //     if (!uniqueCombinations[key]) {
        //         uniqueCombinations[key] = true;
        //         uniqueArray.push(item);
        //     }
        // });

        // console.log(uniqueArray);
        // this.recentData = uniqueArray;
        
        console.log('recentData',this.recentData);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }
  removeDuplicates(array: any[]): any[] {
    const uniqueMap: { [key: string]: any } = {};
    array.forEach(obj => {
      const key = obj.courseid.toString() + obj.modname; // Concatenating id and name to create a unique key
      uniqueMap[key] = obj;
    });
    return Object.values(uniqueMap);
  }

  async initializeNetworkListener() {
    // Add a listener for network status changes
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed', status);
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      message:
        'You are not currently connected to WI-FI. It was not Possible to calculate the size of the download. Are you sure you want to continue',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'btn_cancel',
          handler: () => {
            console.log('Cancelled');
          },
        },
        {
          text: 'Ok',
          cssClass: 'btn_ok',
          handler: () => {
            this.router.navigate(['course-downloads']);
            console.log('Ok');
          },
        },
      ],
    });

    await alert.present();
  }

  onArrow() {
    this.getRecentCourses(this.id);
    this.menuCtrl.open('menu');
  }

  async onDownload(event: Event) {
    event.stopPropagation();
    this.status = await Network.getStatus();
    console.log('Network status:', this.status);
    if (this.status.connectionType !== 'wifi') {
      this.presentAlert();
    }
    if (this.status.connectionType === 'wifi') {
      this.router.navigate(['course-downloads']);
    }
  }

  onCancel() {
    this.showAlert = false;
  }

  onOk() {
    this.showAlert = false;
  }

  onCardClick(value: any) {
    this.dataService.setData(value)
    // let navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     data: JSON.stringify(value),
    //   },
    // };
    this.router.navigate(['cyber-security']);
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
      location.reload();
    }, 2000);
  }

  onRecentCardClick(value: any) {
   console.log("value",value)
   this.courseId=value.courseid
    this.authService.getRecentCoursesByID(value.cmid).subscribe({
      next: (data) => {
        this.instanceId = data[0].instance;
        this.handleNavigation(value);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
    this.authService.getCourseContent(value.courseid).subscribe({
      next: (data) => {
        console.log(data);
        data.forEach((item: any) => {
          if (item.modules && item.modules.length > 0) {
            item.modules.forEach((module: any) => {

              if (module.modname === 'page' && value.modname === 'page') {
                if (module.id === value.cmid) {
                  this.handleNavigation(module);
                }
                console.log(module);
              }
              if (module.modname === 'resource' && value.modname === 'resource') {
                if (module.id === value.cmid) {
                  this.handleNavigation(module);
                }
                console.log(module);
              }
              if (module.modname === 'feedback' && value.modname === 'feedback') {
                if (module.id === value.cmid) {
                  this.handleNavigation(module);
                }
                console.log(module);
              }
              if (module.modname === 'scorm' && value.modname === 'scorm') {
           

                if (module.id === value.cmid) {
                  console.log(value);

                  this.authService.getScormsByCourseId(value.courseid).subscribe({
                    next: (data) => {
                      this.scormData = data.scorms;
                      if (this.scormData !== undefined) {
                        this.handleNavigation(module);
                      }
                    },
                    error: (error) => {
                      console.error('Login failed:', error);
                    },
                  });
                }
              }
            });
          }
        });
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  async handleNavigation(value: any) {
    console.log("valuessssss",value)
    if (this.instanceId) {
      if (value.modname === 'quiz') {
        localStorage.setItem('quizName', value.name);
        let navigationExtras: NavigationExtras = {
          queryParams: {
            data: this.instanceId,
            courseId:this.courseId
          },
        };
        await this.router.navigate(['index-quiz'], navigationExtras);
      }
      if (value.modname === 'page') {
        console.log(value);

        let navigationExtras: NavigationExtras = {
          queryParams: {
            data: JSON.stringify(value),
          },
        };
        await this.router.navigate(['index-activity'], navigationExtras);
      }
      if (value.modname === 'scorm') {
        if (this.scormData !== undefined) {
        

          this.scormData.forEach(async (scorm: any) => {

            if ((parseInt(this.instanceId) === parseInt(scorm.id)) === true) {
              console.log(scorm.packageurl);
              this.token = this.tokenService.getToken()
              const url = value.url
              console.log("url",url)
              // Browser.open({ url });
              // console.log(scorm.packageurl + `?token=${this.token}`);
              await this.zipService.downloadAndUnzip(scorm.packageurl + `?token=${this.token}`);
              //Browser.open({ url: `https://gurukul.skfin.in/mod/scorm/player.php?a=${value.instance}&currentorg=Phishing_ORG&scoid=${scorm.launch}&sesskey=o8KLPxGq2C&display=popup&mode=browse` });
            }
          });
        }
      }
      if (value.modname === 'resource') {
        for (let index = 0; index < value.contents.length; index++) {
          const content = value.contents[index];
          if(content.mimetype.includes('mp4')) {
            // const url = this.extractFileUrl(content.fileurl) + `?token=${this.token}`
            // console.log('url',url)
            // this.downloadFile(url, content.filename);
  
            let navigationExtras: NavigationExtras = {
              queryParams: {
                data: JSON.stringify(value),
              },
            };
            this.router.navigate(['index-activity'], navigationExtras)
          }
          if(content.filename.includes('.pdf')) {
            const url = this.extractFileUrl(content.fileurl) 
            console.log('pdf url',url)
            this.pdfUrl = url+"?token="+localStorage.getItem("auth-token")
            this.openPdfViewerModal()
          }
        }
      }
      if (value.modname === 'feedback') {
        console.log('feedback',value)
        try {
          const res = await this.authService.checkFeedbackFormStatus(value.instance).toPromise()
          console.log('res',res)
          if(res.result.msg === "Proceed") {
            this.router.navigateByUrl(`/feedback/${this.courseId}/${this.instanceId}`)
          }
          if(res.result == 'error') {
            this.presentToast(res[0]['msg'],'danger')
          }
        } catch(err) { 
          console.log(err)
        }
        // this.router.navigateByUrl(`/feedback/${this.data.id}/${value.instance}`)
        // this.getFeedbackItems(this.data.id,value.instance)
      }
    }
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

  // initPushNotifications() {
  //   this.fcmService.getNewUserInfo().subscribe(token => {
  //     this.fcmToken = token;
  //     console.log("02222222222222222222222222222222222222222222222222220222222@@@@@@@@@@",this.fcmToken);
  //   })
  // }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.subscriptions.unsubscribe();
  }
  
  onProfile() {
    this.menuCtrl.open('menuProfilee');
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
    this.menuCtrl.close('menuProfilee');
  }

  extractFileUrl(url: string): string {
    const queryIndex = url.indexOf('?');
    if (queryIndex !== -1) {
      // Remove the query parameters
      return url.substring(0, queryIndex);
    }
    return url; 
  }

  async openPdfViewerModal() {
    const modal = await this.modalController.create({
      component: PdfViewerModalPage,
      componentProps: {
        pdfUrl: this.pdfUrl,
      }
    });
    return await modal.present();
  }

}
