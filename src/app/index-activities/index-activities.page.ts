import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { TokenService } from '../services/token/token.service';
import { Utility } from '../utility/utility';
import { DomSanitizer } from '@angular/platform-browser';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { ViewerModalComponent } from '@herdwatch-apps/ngx-ionic-image-viewer';

@Component({
  selector: 'app-index-activities',
  templateUrl: './index-activities.page.html',
  styleUrls: ['./index-activities.page.scss'],
})
export class IndexActivitiesPage implements OnInit {
  @ViewChild('popover') popover: any;
  @ViewChild('iframe') iframe!: ElementRef;
  isOpen = false;
  showPrevious = true;
  showNext = false;
  data: any;
  token: any;
  isHaveImage:boolean = false;
  showUsedVehical:boolean=true;
  showUsedVehical1:boolean=false;
  showUsedVehical2:boolean=false;
  
  constructor(
    private menuCtrl: MenuController, 
    private route: ActivatedRoute, 
    private tokenService: TokenService, 
    public utility: Utility,
    public sanitizer: DomSanitizer,
    public el: ElementRef,
    public modalController: ModalController,
    private router: Router,
    // private location: Location,
  ) {

    // this.token = this.tokenService.getToken();
    // this.route.queryParams.subscribe(async (params: any) => {
    //   this.isHaveImage = false;
    //   if (params && params.data) {
    //     this.data = JSON.parse(params.data);
    //     console.log('take params data',this.data)
    //     this.data.contents = await Promise.all(this.data.contents.map(async (content: any, i: number) => {
    //       content.isHtmlFile = content.filename.includes('.html'),
    //       content.sanitizedVideoUrl = content?.mimetype ? content.mimetype.includes('video') ? this.sanitizer.bypassSecurityTrustResourceUrl(this.extractImageUrl(content.fileurl) + '?token=' + utility.getToken()) : '' : '',
    //       content.htmlFileUrl = content.filename.includes('.html') ? await this.downloadFile(this.extractImageUrl(content.fileurl) + '?token=' +  (this.data.modname == 'page' ? environment.adminToken : utility.getToken()), 'index_activity/' + content.filename, i) : ''
    //       return content;
    //       // htmlFileData: await this.authService.fetchHtmlContent(this.extractImageUrl(content.fileurl) + '?token=' + utility.getToken())
    //     }));
    //     for (let index = 0; index < this.data.contents.length; index++) {
    //       const content = this.data.contents[index];
    //       console.log(content.filename);
          
    //       if(content.filename.includes('.PNG') || content?.mimetype?.includes('video') || content.filename.includes('.jpg')) {
    //         this.isHaveImage = true
    //       }
    //     }
    //     // this.data.contents = this.data.contents.map((content: any) => ({
    //     //   ...content,
    //     //   sanitizedHtml: this.sanitizer.bypassSecurityTrustHtml(content.htmlFileData)
    //     // }));
    //     console.log('data sd------------>',this.data)
    //     // console.log('this.data.contents[3].isHtmlFile',this.data.contents[0].isHtmlFile)
    //     // console.log('this.data.contents[2].isHtmlFile',this.data.contents[1].isHtmlFile)
    //     // console.log('this.data.contents[2].isHtmlFile',this.data.contents[2].isHtmlFile)
    //     console.log('isHaveImage',this.isHaveImage)
    //   }
    // });

    this.token = this.tokenService.getToken();
    this.route.queryParams.subscribe(async (params: any) => {
  this.isHaveImage = false;
  if (params && params.data) {
    this.data = JSON.parse(params.data);
    console.log('take params data', this.data);


  }
});

  }

  async ngOnInit() {
    this.token = this.tokenService.getToken();
    console.log("aaaaaaaaaa");

    // Process contents
    this.data.contents = await Promise.all(this.data.contents.map(async (content: any, i: number) => {
      content.isHtmlFile = content.filename.includes('.html');
      content.sanitizedVideoUrl = content?.mimetype ? (content.mimetype.includes('video') ? this.sanitizer.bypassSecurityTrustResourceUrl(this.extractImageUrl(content.fileurl) + '?token=' + this.utility.getToken()) : '') : '';
      content.htmlFileUrl = content.filename.includes('.html') ? await this.downloadFile(this.extractImageUrl(content.fileurl) + '?token=' + (this.data.modname == 'page' ? environment.adminToken : this.utility.getToken()), 'index_activity/' + content.filename, i) : '';
      
      // Check if the content has an image or a video
      if (content.filename.includes('.PNG') || content?.mimetype?.includes('video') || content.filename.includes('.jpg')) {
        this.isHaveImage = true;
      }
      
      return content;
    }));
  }

  handleIframeLoad(event: any) {
    const iframe = event.target;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // Apply CSS to disable pointer events for all elements
    const style = iframeDoc.createElement('style');
    style.textContent = `
      * {
        pointer-events: none;
      }
      a {
        pointer-events: auto;
      }
    `;
    iframeDoc.head.appendChild(style);
  }
  onIndex() {
    this.menuCtrl.open('endMenu');
  }

  showUsedVehicalCheckCondition(){
    this.showUsedVehical=false;
    this.showUsedVehical1=true;
    this.showUsedVehical2=false;
  }
  showUsedVehicalCheckCondition1(){
    this.showUsedVehical=false;
    this.showUsedVehical1=false;
    this.showUsedVehical2=true;
  }
  showUsedVehicalprreviouesCheckCondition1(){
    this.showUsedVehical=true;
    this.showUsedVehical1=false;
    this.showUsedVehical2=false;
  }
  showUsedVehicalCheckCondition2(){
    this.showUsedVehical=false;
    this.showUsedVehical1=false;
    this.showUsedVehical2=true;
  }
  showUsedVehicalprreviouesCheckCondition2(){
    this.showUsedVehical=false;
    this.showUsedVehical1=true;
    this.showUsedVehical2=false;
  }

  async openViewer() {
  const modal = await this.modalController.create({
    component: ViewerModalComponent,
    componentProps: {
      src: "./assets/img/demo.jpg"
    },
    cssClass: 'ion-img-viewer',
    keyboardClose: true,
    showBackdrop: true
  });

  return await modal.present();
}

  onClose() {
    this.menuCtrl.close('endMenu');
  }

  onBack() {
let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(this.data),
      },
    };
    this.router.navigate(['cyber-security'],navigationExtras);
    // this.location.back();
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  onPrevious() {
    this.showPrevious = true;
    this.showNext = false;
  }

  onNext() {
    this.showNext = true;
    this.showPrevious = false;
  }

  // extractImageUrl(url: string): string {
  //   const fileExtensions = ['.PNG', '.png', '.jpeg', '.jpg', '.jfif'];

  //   let lastDotIndex = -1;
  //   for (const extension of fileExtensions) {
  //     const extensionIndex = url.lastIndexOf(extension);
  //     if (extensionIndex > lastDotIndex) {
  //       lastDotIndex = extensionIndex;
  //     }
  //   }

  //   const extractedUrl = url.substring(0, lastDotIndex + 4);

  //   return extractedUrl;
  // }

  extractImageUrl(url: string): string {
    const queryIndex = url.indexOf('?');
    if (queryIndex !== -1) {
      // Remove the query parameters
      return url.substring(0, queryIndex);
    }
    return url; 
  }

  async downloadFile(url: string, fileName: string, index: number) {
    try {
      // Fetch image data from the URL
      const response = await fetch(url);
      console.log('fetch res',response)
      const blob = await response.blob();
      console.log('blob',blob)
      const blobToBase64:any = await this.blobToBase64(blob)
      console.log('blobToBase64',blobToBase64)

      // Get the path where the image will be saved
      const currentDate = new Date().toLocaleString().replace(/[,:\s\/]/g, '-');

      const path = `gurukul/${currentDate}/${index}/${fileName}`;
      console.log('path',path)
      // const fileName = `myFile-${currentDate}.pdf`;
      console.log('data', Directory.Data)
      console.log('Documents', Directory.Documents)
      const res = await Filesystem.writeFile({
        path: path,
        data: blobToBase64,
        directory: Directory.External,
        recursive: true
      });
      console.log('File Downloaded Successfully!')
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

currentIndex=0
nextContent(): void {
  if (this.currentIndex < this.data.contents.length - 1) {
    this.currentIndex++;
  }
}

previousContent(): void {
  if (this.currentIndex > 0) {
    this.currentIndex--;
  }
}
}
