import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Browser } from '@capacitor/browser';
import { TokenService } from '../services/token/token.service';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { PdfViewerModalPage } from '../modal-controller/pdf-viewer-modal/pdf-viewer-modal.page';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-course-index',
  templateUrl: './course-index.page.html',
  styleUrls: ['./course-index.page.scss'],
})
export class CourseIndexPage implements OnInit {
  isExpanded: boolean[] = [];
  data: any;
  courseData: any;
  scormData: any;
  pdfUrl:any = '';
  token: any

  constructor(private router: Router,private route: ActivatedRoute,private authService: AuthService,
    private loadingCtrl:LoadingController,
    private tokenService: TokenService,private modalController: ModalController,private toastCtrl: ToastController,
    private domSenitizer:DomSanitizer,
    
  ) { }

  
  gettoken(id: any) {
    console.log(id);
    this.authService.token = this.tokenService.getToken();
    console.log(this.token);
  }


  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      if (params && params.data) {
        this.data = JSON.parse(params.data);
        if (this.data.id) {
          this.authService.getCourseContent(this.data.id)?.subscribe({
            next: (data) => {
              this.courseData = data;
              console.log('courseData',this.courseData)
            },
            error: (error) => {
              console.error(error);
            },
          });
        }
      }
    });
    this.getScorms();
  }

  getScorms() {
    this.authService.getScormsByCourseId(this.data.id).subscribe({
      next: (data) => {
        console.log(data);
        this.scormData = data.scorms;

      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  onClose(){
    console.log("this.data ---- ", this.data);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(this.data),
      },
    };
    this.router.navigate(['cyber-security'],navigationExtras);
  }

  async onClick(value: any){
    // console.log(value);
    // const userid = this.tokenService.getUser()[0].id
    // console.log(userid);
    // console.log("value", value);
    const userid = this.tokenService.getUser()[0].id
    console.log(`>>>>>tojken`,userid)
    console.log(userid);
    
    this.authService.createRecentItems(value.id,userid,this.data.id).subscribe(async (res: any) => {
    // this.authService.createRecentItems(value.id,userid,this.data.id).subscribe((res: any) => {
      console.log(res);  
    })
    console.log(value.modname,"value.modname")
    if(value.modname === 'quiz'){
      localStorage.setItem('quizName',value.name)
      let navigationExtras: NavigationExtras = {
        queryParams: {
          courseId: this.data.id,
          data: JSON.stringify(value.instance),
        },
      };
      this.router.navigate(['index-quiz'],navigationExtras)
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


    if (value.modname === 'feedback') {
      console.log('feedback',value)
      // value.contents = value.contents.filter((el:any)=> el.filename.includes('.html'))
      // const data = {
      //   feedback
      // }
      // let navigationExtras: NavigationExtras = {
      //   data: JSON.stringify(value),
      // };
      // console.log(navigationExtras,'navigationExtras')
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

        // this.router.navigate(['/feedback'], navigationExtras)
        
  
      // this.router.navigateByUrl(`/feedback/${this.data.id}/${value.instance}`)
      // this.getFeedbackItems(this.data.id,value.instance)
    }

    if(value.modname === 'page'){
      let navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(value),
        },
      };
      this.router.navigate(['index-activity'],navigationExtras)
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
          const url = this.extractFileUrl(content.fileurl) + `?token=${this.tokenService.getToken()}`
          console.log('pdf url',url)
          // this.pdfUrl = this.domSenitizer.bypassSecurityTrustResourceUrl(url)
          this.pdfUrl =url
          this.openPdfViewerModal()
        }
      }
    }
    if (value.modname === 'scorm') {
      // Browser.open({ url: value.url});
      // console.log(`>>>>>values${JSON.stringify(value)}`);
      console.log('value', value);
      // this.scormData.forEach((scorm: any) => {
      //   this.courseData.find((module: any) => module.modules.some((item: any) => {
      //     // console.log((item.instance === scorm.id) === true);
          
      //     if((item.instance === scorm.id) === true){
      //       Browser.open({ url: `https://gurukul.skfin.in/mod/scorm/player.php?a=${item.instance}&currentorg=Phishing_ORG&scoid=${scorm.launch}&sesskey=o8KLPxGq2C&display=popup&mode=browse` });
      //     }
      //   }
      //   ));
      // });
      // const url = `https://gurukul.skfin.in/mod/scorm/scorm.php?id=155&userid=565&token=0f146936696e9ed06abff2a53f5e3d8e`;
      const url = `https://gurukul.skfin.in/mod/scorm/scorm.php?id=${value.instance}&userid=${userid}&token=${this.tokenService.getToken()}`;
      await Browser.open({ url: url});
      console.log('value.instance',value.instance);
      console.log('userid', userid);
      console.log('token', this.token);
      // https://gurukul.skfin.in/mod/scorm/scorm.php?id=155&userid=565&token=0f146936696e9ed06abff2a53f5e3d8e
    }
    if (value.modname === 'simplecertificate') {
      Browser.open({ url: value.url});
      // this.scormData.forEach((scorm: any) => {
      //   this.courseData.find((module: any) => module.modules.some((item: any) => {
      //     // console.log((item.instance === scorm.id) === true);
          
      //     if((item.instance === scorm.id) === true){
      //       Browser.open({ url: `https://gurukul.skfin.in/mod/scorm/player.php?a=${item.instance}&currentorg=Phishing_ORG&scoid=${scorm.launch}&sesskey=o8KLPxGq2C&display=popup&mode=browse` });
      //     }
      //   }
      //   ));
      // });
    }
    if (value.modname == 'hvp') {
      console.log("this.scormData", this.scormData);
      
      console.log(value.instance,"test");
      const url = value.url
      Browser.open({ url });
    }
  }

  toggleAccordion(index: number) {
    this.isExpanded[index] = !this.isExpanded[index];
  }

  async downloadFile(url: string, fileName: string) {
    try {
      const loading = await this.loadingCtrl.create({
        message: 'File downloading...',
      });
      loading.present();
      // Fetch image data from the URL
      const response = await fetch(url);
      const blob = await response.blob();
      const blobToBase64:any = await this.blobToBase64(blob)

      // Get the path where the image will be saved
      // const path = `gurukul/${fileName}`;
      const currentDate = new Date().toLocaleString().replace(/[,:\s\/]/g, '-');

      const path = `gurukul/${currentDate}/${fileName}`;

      loading.dismiss()
      await Filesystem.writeFile({
        path: path,
        data: blobToBase64,
        directory: Directory.External,
        recursive: true
      });
      this.presentToast("File Downloaded Successfully! Please Check in Documents Folder","success")
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
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

async presentToast(message: any, color: any) {
  let toast = await this.toastCtrl.create({
    message: message,
    duration: 5000,
    position: 'top',
    color: color,
  });

  toast.present();
}
}
