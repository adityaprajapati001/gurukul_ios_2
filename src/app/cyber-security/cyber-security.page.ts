import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Utility } from '../utility/utility';
import { TokenService } from '../services/token/token.service';
import { Browser } from '@capacitor/browser';
import * as JSZip from 'jszip';
import { ModalController, ToastController } from '@ionic/angular';
import { IframeModalPage } from '../modal-controller/iframe-modal/iframe-modal.page';
import { PdfViewerModalPage } from '../modal-controller/pdf-viewer-modal/pdf-viewer-modal.page';
import { LoadingController } from '@ionic/angular';

import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { DataService } from '../services/data-servicee/data-service.service';
import { Subscription } from 'rxjs';
import { ZipService } from '../services/zip-service/zip.service';
import { App } from '@capacitor/app';
import { ScormService } from '../services/zip-service/unzip.service';

const AUTH_API = environment.baseUrl;


// import { Browser } from '@capacitor/browser';


const zip = new JSZip();


@Component({
  selector: 'app-cyber-security',
  templateUrl: './cyber-security.page.html',
  styleUrls: ['./cyber-security.page.scss'],
})
export class CyberSecurityPage implements OnInit {
  @ViewChild('popover') popover: any;
  isOpen = false;
  value = 0.5;
  segment: any = 'course';
  showMain: boolean = true;
  showPwdSec: boolean = true;
  showDesktop: boolean = true;
  showLite: boolean = true;
  showInfo: boolean = true;
  courseName: any;
  data: any;
  token: any
  courseData: any;
  scormData: any;
  gradesData: any[] = [];
  scormId: any;
  selectedModuleIndices: { [key: number]: number } = {};
  myCourses = [
    {
      id: 1,
      name: 'Cyber Security Awareness',
      type: 'Self Learning',
      src: 'assets/img/cyber.png',
      value: 0,
      download: true,
      myCourse: true,
    },
  ];
  isExpanded: string = '';
  storyHtmlData: any;
  pdfUrl:string = '';
  subscription!: Subscription;

  courseDataNew: any;

  // content: string | null = null;
  private scormSubscription: any;

  content: SafeHtml | null = null; // Use SafeHtml type

  progress: number = 0;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService,
    public utility: Utility, private tokenService: TokenService, 
    private loadingCtrl: LoadingController,
    private modalController: ModalController,
    private toastCtrl: ToastController,
    public sanitizer: DomSanitizer,
    private dataServicee:DataService,
    private zipService:ZipService,
    private scormService: ScormService
  ) {

    
    // this.route.queryParams.subscribe((params: any) => {
    //   console.log("parmeters --->", params);

    //   if (params && params.data) {
    //     this.data = JSON.parse(params.data);
    //     console.log("data",this.data);

    //     this.courseName = params.data.displayname;
    //     this.authService?.getCourseContent(this.data.id).subscribe({
    //       next: (data) => {
    //         console.log(data);
    //         this.courseData = data;
    //         console.log("parmeters --->",  this.courseData);

    //       },
    //       error: (error) => {
    //         console.error('Login failed:', error);
    //       },
    //     });
    //   }
    // });
  }


  gettoken(id: any) {
    console.log(id);
    this.authService.token = this.tokenService.getToken();
    console.log(this.token);
  }




   getCourseContent=(id:any)=>{
    this.authService?.getCourseContent(id).subscribe({
      next: (data) => {
        console.log(data);
        this.courseData = data;
        this.courseDataNew = data[1].modules[2].description;
        console.log("courseData --->",  this.courseData);
        console.log("courseDataNew--->",  this.courseDataNew);

      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }
  
  ngOnInit() {
    this.subscription = this.dataServicee.currentData.subscribe(data =>{
      this.data = data
      console.log("data------------>:",this.data)
      this.getCourseContent(this.data.id)
    })
    this.token = this.tokenService.getToken();
    this.getScorms();
   
    
        // // Subscribe to scormContent$ to get updates
        // this.scormService.scormContent$.subscribe(content => {
        //   this.content = content;
        // });
    
        // // Load SCORM content on component initialization
        // const scormUrl = 'https://gurukul.skfin.in/webservice/pluginfile.php/14881/mod_scorm/package/0/Phishing.zip?token=4f086bb87670f7d1758c135bfef9ddaf'; // Replace with actual URL
        // this.scormService.loadScorm(scormUrl);

         // Subscribe to scormContent$ to get updates
    this.scormService.scormContent$.subscribe(content => {
      if (content) {
        this.content = this.sanitizer.bypassSecurityTrustHtml(content); // Sanitize and trust the HTML
      } else {
        this.content = null;
      }
    });

    // Load SCORM content on component initialization
    const scormUrl = 'https://gurukul.skfin.in/webservice/pluginfile.php/14881/mod_scorm/package/0/Phishing.zip?token=4f086bb87670f7d1758c135bfef9ddaf'; // Replace with actual URL
    this.scormService.loadScorm(scormUrl);

  }


  getScorms() {
    this.authService.getScormsByCourseId(this.data.id).subscribe({
      next: (data) => {
        console.log(data);
        this.scormData = data.scorms;
        console.log(this.scormData)

      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }



  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
    const user = this.tokenService.getUser();
  
    if (this.segment === 'grades') {
      console.log(this.data.id);

      this.authService.getUserGrades(user[0].id, this.data.id).subscribe({
        next: (res) => {
          // console.log(res);
          this.gradesData = res.usergrades;
          // this.gradesData = this.gradesData.map((obj) => {
          //   obj.gradeitems = obj.gradeitems.map((object: any) => {
          //     object.srNo = Number(object.itemname?.split('.')[0]);
          //     return object;
          //   })
          //   return obj;
          // })
          // this.gradesData = this.gradesData.map((o) => {
          //   o.gradeitems = o.gradeitems.sort((a: any, b: any) => a.srNo - b.srNo);
          //   return o;
          // })
          // const data = this.gradesData.sort((a, b) => {
          //   const aMatch = a.itemname.match(/^(\d+)\. (.*)$/);
          //   const bMatch = b.itemname.match(/^(\d+)\. (.*)$/);
          //   if (!aMatch || !bMatch) return 0;
          //   const aNum = parseInt(aMatch[1], 10);
          //   const bNum = parseInt(bMatch[1], 10);
          //   const aText = aMatch[2].trim();
          //   const bText = bMatch[2].trim();
          //   // First compare the numerical parts
          //   if (aNum !== bNum) {
          //     return aNum - bNum;
          //   }
          //   // If numerical parts are equal, compare the alphabetical parts
          //   return aText.localeCompare(bText);
          // });
          console.log("this.gradesData.sort((a, b) => a.srNo - b.srNo)", this.gradesData);

        },
        error: (error) => {
          console.error('Login failed:', error);
        },
      });
    }

  }

  onPwdSec() {
    this.showMain = true;
    this.showPwdSec = true;
    this.showDesktop = true;
    this.showLite = true;
    this.showInfo = true;
  }

  onCybSec() {
    this.showMain = true;
    this.showPwdSec = true;
    this.showDesktop = true;
    this.showLite = true;
    this.showInfo = true;
  }
  onDesktop() {
    this.showPwdSec = true;
    this.showMain = true;
    this.showDesktop = true;
    this.showLite = true;
    this.showInfo = true;
  }
  onDesktopLite() {
    this.showPwdSec = true;
    this.showMain = true;
    this.showDesktop = true;
    this.showLite = true;
    this.showInfo = true;
  }
  onInfo() {
    this.showPwdSec = true;
    this.showMain = true;
    this.showDesktop = true;
    this.showLite = true;
    this.showInfo = true;
  }

  onIndex() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(this.data),
      },
    };
    this.router.navigate(['course-index'], navigationExtras);
  }

  onComm() {
    this.router.navigate(['communication']);
  }

  async onClick(value: any) {
    console.log("value", value);
    const userid = this.tokenService.getUser()[0].id
    console.log(`>>>>>tojken`,userid)
    console.log(userid);
    this.authService.createRecentItems(value.id,userid,this.data.id).subscribe(async (res: any) => {
      // console.log(res,'res----->');  
    })
    // console.log(value,value.modname,"value.modname--->")
    if (value.modname === 'quiz') {
      localStorage.setItem('quizName', value.name)
      let navigationExtras: NavigationExtras = {
        queryParams: {
          // name: JSON.stringify(value.name),
          courseId: this.data.id,
          data: JSON.stringify(value.instance),
        },
      };
      this.router.navigate(['index-quiz'], navigationExtras)
    }
    if(value.modname === "book"){
      console.log('book')
      value.contents = value.contents.filter((el:any)=> el.filename.includes('.html'))
      let navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(value),
        },
      };
      this.router.navigate(['index-activity'],navigationExtras)
    }
    if (value.modname === 'page') {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(value),
        },
      };
      console.log('queryParams', navigationExtras);
      this.router.navigate(['index-activity'], navigationExtras)
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
          const url = this.extractFileUrl(content.fileurl) + `?token=${this.token}`
          console.log('pdf url',url)
          this.pdfUrl = url
          this.openPdfViewerModal()
        }
      }
    }
    if(value.modname === "simplecertificate"){
      console.log('"simplecertificate"')
        const url = `https://gurukul.skfin.in/mod/simplecertificate/simplecertificate.php?id=${value.id}&userid=${userid}&token=${this.token}`;
        // https://gurukul.skfin.in/mod/simplecertificate/view.php?id=446
        // await Browser.open({ url: url, });
      Browser.open({ url:value.url });
      console.log('url', url);
    }

    if (value.modname === 'scorm') {
      // let navigationExtras: NavigationExtras = {
      //   queryParams: {
      //     data: JSON.stringify(value),
      //   },
      // };
      // this.router.navigate(['IframeModalPage'], navigationExtras);
      console.log(`>>>>>values${JSON.stringify(value)}`);
      console.log('values',(value));
      // console.log('values', navigationExtras);
  //  Browser.open({ url: `https://gurukul.skfin.in/mod/scorm/scorm.php?id=${value.instance}&userid=${userid}&token=${this.token}` });


 // Define your function or method
  // openUrl(value: any, userid: string) {

  const url = `https://gurukul.skfin.in/mod/scorm/scorm.php?id=${value.instance}&userid=${userid}&token=${this.token}`;
  await Browser.open({ url: url, });

  // https://gurukul.skfin.in/mod/scorm/scorm.php?id=157&userid=565&token=0f146936696e9ed06abff2a53f5e3d8e

  // const url = `https://gurukul.skfin.in/mod/scorm/scorm.php?id=${value.instance}&userid=${userid}&token=${this.token}`;
  // this.iab.create(url, '_blank');

  // openUrl() {
  //   const url = `https://gurukul.skfin.in/mod/scorm/scorm.php?id=${value.instance}&userid=${userid}&token=${this.token}`;
  //   this.iab.create(url, '_blank');
  // }
  
    // console.log("this.scormData", this.scormData);  
    
    // this.scormData.forEach(async (scorm: any) => {
    //     if((value.instance === scorm.id) === true){
    //         console.log('dfdsfsdaf', scorm.packageurl);
    //         const url = value.url
    //         console.log('url', url);
    //         await this.zipService.downloadAndUnzip(scorm.packageurl + `?token=${this.token}`);

    //         this.zipService.progress$.subscribe(progress => {
    //           this.progress = progress; // Update progress
    //           console.log('this progress', this.progress);
    //         });
    //     }
    // });
  }

  if (value.modname == 'hvp') {
    console.log("this.scormData", this.scormData);
    
    console.log(value.instance,"test");
    const url = value.url
    Browser.open({ url });    
  }

      // const htmlFilePath = value.contents[0].fileurl + '?token=' +  (this.data.modname == 'page' ? environment.adminToken : this.utility.getToken());
      // // this.downloadFile(htmlFilePath, value.contents[0].filename);
      // // console.log("htmlFilePath", htmlFilePath);
      // // this.openIframeModal(htmlFilePath);
      
     
      // this.scormData.forEach(async (scorm: any) => {
      //     if((value.instance === scorm.id) === true){
      //         console.log(scorm.packageurl);
      //         // this.token = this.tokenService.getToken()
      //         const url = value.url
      //         // Browser.open({ url });

             
      //        window.alert(5 + 6);
             
      //        await this.zipService.downloadAndUnzip(scorm.packageurl + `?token=${this.token}`);
      //        window.alert(5 +7);
      //       //  App.addListener('appUrlOpen', data => {
      //       //   window.alert(21);
      //       //   console.log('PNG1')
      //       //   if (data.url.includes("6kMl0hgp5kt.png")) {
      //       //     console.log('PNG2')
      //       //     window.alert('6kMl0hgp5kt.png');
      //       //     window.close();
      //       //   }
      //       //   console.log(data.url);
      //       // });
      //      //  Browser.open({ url: `https://gurukul.skfin.in/mod/scorm/player.php?a=${value.instance}&currentorg=Phishing_ORG&scoid=${scorm.launch}&sesskey=o8KLPxGq2C&display=popup&mode=browse` });
      //     }
      // });




      
    
    // if (value.modname == 'hvp') {
    //   console.log("this.scormData", this.scormData);
      
    //   console.log(value.instance,"test");
    //   const url = value.url
    //   Browser.open({ url });

    


    // console.log('IF1')
    // window.alert('hv1p');
    // if (value.modname == 'hvp') {
    //   console.log('IF2')
    //   window.alert('hv1p');
    //   window.alert(value.modname);
    //   window.alert('value.modname');
      
    //   console.log(value.modname);
    //   console.log("this.scormData", this.scormData);
      
    //   console.log(value.instance,"test");
    //   window.alert('hv2p');
    //   window.alert('value.modname');
    //   window.alert('hv2p');
    //   const url = value.url
    //   Browser.open({ url });


      
    //   App.addListener('appUrlOpen', data => {
    //     window.alert(21);
    //     console.log('PNG1')
    //     if (data.url.includes("6kMl0hgp5kt.png")) {
    //       console.log('PNG2')
    //       window.alert('6kMl0hgp5kt.png');
    //       window.close();
    //     }
    //     console.log(data.url);
    //   });

    //   if (true) {
    //     // if (value.modname == 'hvp') {
    //   console.log('IF2');
    //   console.log(value.modname);
    //   console.log("this.scormData", this.scormData);
      
    //   console.log(value.instance,"test");
    //   const url = value.url
    //   Browser.open({ url });
      
    //   App.addListener('appUrlOpen', data => {
    //     console.log('PNG1');
    //     if (data.url.includes("6kMl0hgp5kt.png")) {
    //       console.log('PNG2');
    //       window.close();
    //     }
    //     console.log(data.url);
    //   });
    // }

    




      // this.scormData.forEach(async (hvp: any) => {
      //   console.log(hvp,"hvp--->")
      //     // if((value.instance === hvp.id) === true){
      //         console.log(hvp.packageurl);
      //         this.token = this.tokenService.getToken()
      //         const url = value.url
      //         Browser.open({ url });
      //         // console.log(scorm.packageurl + `?token=${this.token}`);
      //         // await this.zipService.downloadAndUnzip(scorm.packageurl + `?token=${this.token}`);
      //       // Browser.open({ url: `https://gurukul.skfin.in/mod/scorm/player.php?a=${value.instance}&currentorg=Phishing_ORG&scoid=${scorm.launch}&sesskey=o8KLPxGq2C&display=popup&mode=browse` });
      //     // }
      // });
  
    
    if (value.modname === 'feedback') {
      console.log('feedback',value)
      try {
        const res = await this.authService.checkFeedbackFormStatus(value.instance).toPromise()
        console.log('res',res)
        if(res.result.msg === "Proceed") {
          this.router.navigateByUrl(`/feedback/${this.data.id}/${value.instance}`)
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


  async openIframeModal(iframeSrc: string) {
    console.log("iframeSrc", iframeSrc)
    const modal = await this.modalController.create({
      component: IframeModalPage,
      componentProps: {
        iframeSrc: iframeSrc,
      }
    });
    return await modal.present();
  }

  toggleAccordion(i: number, j: number) {
    const accordionIndex = 'cyber_' + i + '_' + j;
    // If the clicked accordion is already expanded, collapse it
    this.isExpanded = this.isExpanded === accordionIndex ? '' : accordionIndex;
  }

  extractImageUrl(summary: string): string {
    const regex = /<img[^>]+src="([^">]+?\.(?:png|jpg|jpeg|gif|jfif))[^">]*"/;
    const matches = summary.match(regex);
    const imageUrl = matches ? matches[1] : '';
    console.log("imageUrl", imageUrl);
    return imageUrl;
  }

  // presentPopover(e: Event) {
  //   e.stopPropagation();
  //   this.popover.event = e;
  //   this.isOpen = true;
  // }

  presentPopover(event: MouseEvent, courseIndex: number, moduleIndex: number) {
    event.stopPropagation();
    this.selectedModuleIndices[courseIndex] = moduleIndex;
    this.isOpen = true;
  }

  isPopoverOpen(courseIndex: number, moduleIndex: number) {
    return this.isOpen && this.selectedModuleIndices[courseIndex] === moduleIndex;
  }
  extractFileUrl(url: string): string {
    const queryIndex = url.indexOf('?');
    if (queryIndex !== -1) {
      // Remove the query parameters
      return url.substring(0, queryIndex);
    }
    return url; 
  }

  async downloadFile(url: string, fileName: string) {
      try {
        // this.presentToast("File download started! Please wait....","success")
        const loading = await this.loadingCtrl.create({
          message: 'File downloading...',
        });
        loading.present();
        // Fetch image data from the URL
        const response = await fetch(url);
        console.log('fetch res',response)
        const blob = await response.blob();
        console.log('blob',blob)
        const blobToBase64:any = await this.blobToBase64(blob)
        console.log('blobToBase64',blobToBase64)
  
        // Get the path where the image will be saved
        // const path = `gurukul/${fileName}`;
        const currentDate = new Date().toLocaleString().replace(/[,:\s\/]/g, '-');

        const path = `gurukul/${currentDate}/${fileName}`;
        console.log('path',path)
        loading.dismiss();

        const res = await Filesystem.writeFile({
          path: path,
          data: blobToBase64,
          directory: Directory.External,
          // encoding: Encoding.UTF8,
          recursive: true
        });
        this.presentToast("File Downloaded Successfully! Please Check in Documents Folder","success")
        console.log("file save",res)
        const convertedUrl = Capacitor.convertFileSrc(res.uri);
        console.log("convertedUrl",convertedUrl)
        return this.sanitizer.bypassSecurityTrustResourceUrl(convertedUrl);
      } catch (error) {
        console.error('Error saving image:', error);
        throw error;
      }
  }

  blobToBase64(blob:Blob) {
    return new Promise((resolve, reject) => {
      const reader:any = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error:any) => {
        reject(error);
      };
    });
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

  
  ///////////////////////////////////
  // async downloadPdf() {
  //   if (this.platform.is('cordova') || this.platform.is('capacitor')) {
  //     // Mobile device
  //     await this.downloadPdfMobile();
  //   } else {
  //     // Browser
  //     this.downloadPdfBrowser();
  //   }
  // }

  // private async downloadPdfMobile() {
  //   try {
  //     const response = await fetch(this.pdfUrl);
  //     const blob = await response.blob();
  //     const base64Data = await this.blobToBase64(blob);
  //     const fileName = 'file.pdf'; // Customize the file name

  //     await Filesystem.writeFile({
  //       path: fileName,
  //       data: base64Data,
  //       directory: Directory.Documents,
  //       encoding: Encoding.Base64
  //     });

  //     // Open the file if needed (not always necessary for mobile)
  //     // Open the file with the default PDF viewer
  //     window.open(`file:///${fileName}`, '_system');
  //   } catch (error) {
  //     console.error('Error downloading the PDF:', error);
  //   }
  // }

  // private blobToBase64(blob: Blob): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => resolve(reader.result as string);
  //     reader.onerror = reject;
  //     reader.readAsDataURL(blob);
  //   });
  // }

//////////////////////////////////////



  async presentToast(message: any, color: any) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color,
    });

    toast.present();
  }

  handleRefresh(event: any) {
      // Any calls to load data go here
      this.authService.getCourseContent(this.data.id).subscribe({
        next: (data) => {
          console.log(data);

          this.courseData = data;
        },
        error: (error) => {
          console.error('Login failed:', error);
        },
      });
      this.ngOnInit()
      event.target.complete();
  }
  

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
