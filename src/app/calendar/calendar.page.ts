import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController, ModalController, ToastController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/token/token.service';
import { NavigationExtras, Router } from '@angular/router';
import { ZipService } from '../services/zip-service/zip.service';
import { DatePipe } from '@angular/common';
import { Browser } from '@capacitor/browser';
import { PdfViewerModalPage } from '../modal-controller/pdf-viewer-modal/pdf-viewer-modal.page';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  selectedDate: string = DateTime.now().toFormat('yyyy-MM-dd');
  cardDate: string = DateTime.now().toFormat('dd-MMM-yyyy');
  @ViewChild('popover') popover: any;
  isOpen: boolean = false;
  calendarData: any[] = [];
  month: any;
  year: any;
  dayOfMonth: any;
  data: any;
  userImg!: string;
  recentData: any[] = [];
  userId!: string;
  id!: string;
  userData: any[] = [];
  courseData: any[] = [];
  scormData: any;
  token: any;
  instanceId: any;
  eventDays: any[] = [];
  highlightedDates: any[] = [];
  isDataLoaded:boolean = false;
  courseId: any;
  pdfUrl: string;

  constructor(private menuCtrl: MenuController, private authService: AuthService,
    private tokenService: TokenService, private router: Router, private zipService: ZipService, private modalController: ModalController,
    private datePipe: DatePipe, private toastCtrl: ToastController) { }

  ngOnInit() {}

  ionViewDidEnter() {
    this.selectedDate = DateTime.now().toFormat('yyyy-MM-dd');
    this.cardDate = DateTime.now().toFormat('dd-MMM-yyyy');

    this.userImg = this.tokenService.getUser()[0]?.profileimageurl; // Safe navigation operator
    console.log(this.selectedDate);

    const parts = this.selectedDate.split('-');
    this.month = parseInt(parts[1][1]);
    this.year = parseInt(parts[0]);
    this.dayOfMonth = parseInt(parts[2]);

    this.getUser();
    this.fetchData();

    this.initializeCalendarArrowEvents()
    
  }

  onArrow() {
    this.menuCtrl.open('menu-calendar');
    this.getRecentCourses();
  }

  onChange(event: CustomEvent) {
    this.selectedDate = event.detail.value || this.selectedDate;
    console.log('selectedDate',this.selectedDate)
    const luxonDate = DateTime.fromISO(this.selectedDate);
    console.log('luxonDate',luxonDate)
    this.dayOfMonth = luxonDate.day;
    console.log('dayOfMonth',this.dayOfMonth)
    this.month = luxonDate.month;
    console.log('month',this.month)
    this.year = luxonDate.year;
    console.log('year',this.year)
    this.selectedDate = luxonDate.toFormat('dd-MMM-yyyy');
    console.log('selectedDate',this.selectedDate)
    this.cardDate = luxonDate.toFormat('dd-MMM-yyyy');
    console.log('cardDate',this.cardDate)
    this.fetchData();
  }

  initializeCalendarArrowEvents() {
    setTimeout(() => {
      const buttonsContainer:any = document.querySelector('ion-datetime')?.shadowRoot?.querySelector('.calendar-header')?.querySelector('ion-buttons')
    const buttons = buttonsContainer.querySelectorAll('ion-button');
    const previousButton = buttons[0];
    let vm = this

    previousButton.addEventListener('click', function() {
      console.log('previous button clicked')
      setTimeout(() => {
        const monthText = document.querySelector('ion-datetime')?.shadowRoot?.querySelector('.calendar-header')?.querySelector('ion-label');
        console.log('monthText',monthText)
        let monthString:any = monthText?.textContent
        console.log('monthText?.textContent;',monthString)
        let parts = monthString.split(" ")
        console.log('parts',parts)
        vm.month = vm.getMonthNumber(parts[0])
        vm.fetchData()
      }, 1000);
    });

    const nextButton = buttons[1];
    nextButton.addEventListener('click', function() {
      console.log('next button clicked')
      setTimeout(() => {
        const monthText = document.querySelector('ion-datetime')?.shadowRoot?.querySelector('.calendar-header')?.querySelector('ion-label');
        console.log('monthText',monthText)
        let monthString:any = monthText?.textContent
        console.log('monthText?.textContent;',monthString)
        let parts = monthString.split(" ")
        console.log('parts',parts)
        vm.month = vm.getMonthNumber(parts[0])
        vm.fetchData()
        }, 1000);
    });
    }, 1000);
  }

  getMonthNumber(monthName:string) {
    // Convert the month name to lowercase for case-insensitive matching
    const normalizedMonthName = monthName.toLowerCase();
    
    // Create an array with month names
    const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];
    
    // Find the index of the month name in the array
    const monthIndex = months.indexOf(normalizedMonthName);
    
    // If the month name is found, return its corresponding number (index + 1)
    if (monthIndex !== -1) {
        return monthIndex + 1; // Adding 1 to match JavaScript's Date.getMonth() method
    } else {
        // If the month name is not found, return null or any other indication as needed
        return null;
    }
}

  convertDateFormat(originalDateString: string): string | null {
    // Convert originalDateString to a Date object
    const originalDate = new Date(originalDateString);

    // Use DatePipe to format the date
    const convertedDate = this.datePipe.transform(originalDate, 'yyyy-MM-dd');

    return convertedDate;
  }

  fetchData() {
    this.calendarData = [];
    console.log(this.year,this.month)
    // this.highlightedDates = []
    this.authService.getCalendarEvent(this.year, this.month).subscribe({
      next: (res) => {
        if(res?.errorcode) {
          return
        }
        this.data = res;
        console.log(res);
        console.log('dayOfMonth',this.dayOfMonth)
        this.highlightedDates = []
        for (const week of this.data.weeks) {
          console.log(week);
          this.eventDays = week.days.filter((day: any) => {
            day.hasevents && day.mday === this.dayOfMonth
            if (day.hasevents) {
              console.log(day.timestamp);
              const date = new Date(day.neweventtimestamp * 1000);

              const formattedDate = date.toISOString().slice(0, 10);
              this.highlightedDates.push({
                date: formattedDate,
                textColor: 'rgb(68, 10, 184)',
                backgroundColor: 'rgb(211, 200, 229)',
              })
              console.log('highlightedDates push',this.highlightedDates)
              // this.highlightedDates(day);
              return day
            }
          });
          console.log('eventDays',this.eventDays)
          const filteredDays = week.days.filter((day: any) => day.hasevents && day.mday === this.dayOfMonth);
          if (filteredDays.length > 0) {
            this.calendarData.push(filteredDays);
          }
          this.isDataLoaded = true
        }
      },
      error: (error) => {
        console.error('Error fetching calendar data:', error);
      },
    });
  }

  getUser() {
    this.userId = localStorage.getItem('username') || '';
    this.authService.getUserInfo(this.userId).subscribe({
      next: (data) => {
        this.userData = data;
        for (const userInfo of this.userData) {
          this.id = userInfo.id;
        }
        this.getRecentCourses();
        this.tokenService.saveUser(this.userData);
      },
      error: (error) => {
        console.error('Error fetching user info:', error);
      },
    });
  }

  getRecentCourses() {
    if (!this.id) {
      console.error('User ID not found.');
      return;
    }

    this.authService.getRecentCourses().subscribe({
      next: (data) => {
        console.log('recent Data',data);
        data.sort((a:any, b:any) => b.timeaccess - a.timeaccess);
        // Get the top 10 values using slice
        this.recentData = data.slice(0, 10);
      },
      error: (error) => {
        console.error('Error fetching recent courses:', error);
      },
    });
  }

  onCardClick(value: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(value),
      },
    };
    this.router.navigate(['cyber-security'], navigationExtras);
  }

  onLink(value: any) {
    const parts = value.split('=');
    const id = parts[parts.length - 1];

    this.authService.getCoursesById(id).subscribe((res: any) => {
      this.courseData = res.courses[0]; // Assuming only one course is returned

      const navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(this.courseData),
        },
      };

      this.router.navigate(['cyber-security'], navigationExtras);
    }, (error) => {
      console.error('Error fetching course by ID:', error);
    });
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
           console.log(this.scormData);
 
           this.scormData.forEach(async (scorm: any) => {
 
             if ((parseInt(this.instanceId) === parseInt(scorm.id)) === true) {
               console.log(scorm.packageurl);
               this.token = this.tokenService.getToken()
               const url = value.url
               Browser.open({ url });
               // console.log(scorm.packageurl + `?token=${this.token}`);
               // await this.zipService.downloadAndUnzip(scorm.packageurl + `?token=${this.token}`);
               // Browser.open({ url: `https://gurukul.skfin.in/mod/scorm/player.php?a=${value.instance}&currentorg=Phishing_ORG&scoid=${scorm.launch}&sesskey=o8KLPxGq2C&display=popup&mode=browse` });
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
             console.log('pdf url',localStorage.getItem("auth-token"))
             this.pdfUrl = url+ "?token="+localStorage.getItem("auth-token")
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

  onCourseClick(course:any) {
    console.log(course)
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(course),
      },
    };
    this.router.navigate(['cyber-security'], navigationExtras);
  }

  onActionClick(action:any) {
    console.log(action)
    const url = action.url;
    const regex = /id=(\d+)/;
    const match = url.match(regex);
    if (match) {
        const id = match[1]; // Extract the first captured group
        console.log(id); // Output: 375
        this.authService.getRecentCoursesByID(id).subscribe(res=>{
          console.log(res)
          localStorage.setItem('quizName', action.name)
          let navigationExtras: NavigationExtras = {
            queryParams: {
              // name: JSON.stringify(value.name),
              data: JSON.stringify(res['0']['instance']),
            },
          };
          this.router.navigate(['index-quiz'], navigationExtras)
        },err=>{
          console.log(err)
        })
    } else {
        console.log("ID not found in URL.");
    }
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
