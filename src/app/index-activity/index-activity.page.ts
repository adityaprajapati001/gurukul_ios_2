import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, MenuController, ModalController } from '@ionic/angular';
import { TokenService } from '../services/token/token.service';
import { Utility } from '../utility/utility';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { ViewerModalComponent } from '@herdwatch-apps/ngx-ionic-image-viewer';

import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { AuthService } from '../services/auth/auth.service';



@Component({
  selector: 'app-index-activity',
  templateUrl: './index-activity.page.html',
  styleUrls: ['./index-activity.page.scss'],
})
export class IndexActivityPage implements OnInit {

  public url: string = "https://www.vecka.nu";
  public fileurl: string = "https://gurukul.skfin.in/webservice/pluginfile.php/1319/mod_page/content/index.html?token=6699e5be3b6db948b9ec49f09d77c142";

  originalUrl = 'https://gurukul.skfin.in/webservice/pluginfile.php/1319/mod_page/content/index.html?forcedownload=1';
  modifiedUrlWithToken: string;
  private Admintoken: string = 'dc2b3c047f2af3940ab2f6d9f572dd24'; // Replace with your actual token
  sanitizedUrl: SafeResourceUrl;

  @ViewChild('popover') popover: any;
  @ViewChild('iframe') iframe!: ElementRef;
  isOpen = false;
  showPrevious = true;
  showNext = false;  
  index: number = 0;
  data: any;
  htmlfileUrl: any[]=[];
  storeCount:number=0;
  token: any;
  isHaveImage:boolean = false;
  externalHtml: any;

  newUrldata: any;
  convertedUrl: any;
  
  viewer = 'google';
  selectedType = 'markup';
  DemoDoc = "https://gurukul.skfin.in/webservice/pluginfile.php/1319/mod_page/content/index.html?token=6699e5be3b6db948b9ec49f09d77c142";

  pdfUrl: SafeResourceUrl | undefined;

  trustedDashboardUrl : SafeUrl;

  // dataNew: string | undefined;
  dataNew: string;

  courseDataNew: any;
  courseData: any;

  description: string = '';

  isHtmlFile: any;

  constructor(
    private menuCtrl: MenuController, 
    private route: ActivatedRoute, 
    private tokenService: TokenService, 
    public utility: Utility,
    public sanitizer: DomSanitizer,
    public el: ElementRef,
    public modalController: ModalController,
    public http: HttpClient,
    private loadingController: LoadingController,
    private authService: AuthService,
    
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
    // this.images = JSON.parse(params.data);
    // this.htmlfileUrl = JSON.parse(params.data);
    console.log("data:",this.data);
    // console.log("htmlfileurl:",this.htmlfileUrl);
    return this.newUrldata = this.data.contents[1].fileurl;
  }
});

// this.route.queryParams.subscribe(params => {
//   console.log('params', params);
//   this.dataNew = JSON.stringify(params);
//   console.log('params',this.dataNew);
// })


this.route.queryParams.subscribe(params => {
  console.log('Query Params:', params);

  // Extract and decode description from query parameters
  const descriptionEncoded = params['data'];

  if (descriptionEncoded) {
    try {
      // Decode the URL-encoded data
      const descriptionDecoded = decodeURIComponent(descriptionEncoded);

      // Extract the description part from the decoded JSON string
      const descriptionObject = JSON.parse(descriptionDecoded);
      const description = descriptionObject.description || '';

      // Use the description as needed
      console.log('Decoded Description:', description);

      // Further processing of the description if needed
      this.processDescription(description);
    } catch (error) {
      console.error('Error decoding or parsing description:', error);
    }
  } else {
    console.warn('No data parameter found in query params.');
  }
});
}

processDescription(description: string) {
// Process the description here if needed
// For example, you might want to display it or further manipulate it
this.description = description;
console.log('Processed Description:', description);


}

//////////////////////////////////////////////////

  // Method to remove query parameters
  removeQueryParams(url: string): string {
    const urlObject = new URL(url);
    return `${urlObject.origin}${urlObject.pathname}`;
  }

  // Method to add token to a URL
  addToken(url: string): string {
    const urlObject = new URL(url);
    // Ensure the URL doesn't already have a token query parameter
    if (!urlObject.searchParams.has('token')) {
      urlObject.searchParams.set('token', this.Admintoken);
    }
    return urlObject.toString();
  }

////////////////////////////////////////////

  

  // public get embeddedLink(): SafeResourceUrl {
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  // }
  
  // public get htmlFileUrl(): SafeResourceUrl {
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(this.fileurl);
  // }

 
 

  async ionViewDidEnter() {
    this.token = this.tokenService.getToken();
    // const data = JSON.stringify(this.data.contents[0]);
    // this.data.contents.push(JSON.parse(data))
    // Process contents
    if (this.data?.contents) {
      this.data.contents = await Promise.all(this.data.contents.map(async (content: any, i: number) => {
        console.log(content);

        content.isHtmlFile = content.filename.includes('.html'); 
        console.log("content.isHtmlFile", content.isHtmlFile);

        content.sanitizedVideoUrl = content?.mimetype ? (content.mimetype.includes('video') ? this.sanitizer.bypassSecurityTrustResourceUrl(this.extractImageUrl(content.fileurl) + '?token=' + this.utility.getToken()) : '') : '';
        console.log("content.sanitizedVideoUrl", content.sanitizedVideoUrl);
        
        content.htmlFileUrl = content.filename.includes('.html') ? await this.downloadFile(this.extractImageUrl(content.fileurl) + '?token=' + (this.data.modname == 'page' ? environment.adminToken : this.utility.getToken()), 'index_activity/' + content.filename, i) : '';
        console.log("content.htmlFileUrl", content.htmlFileUrl);

        if (content.filename.includes('.PNG') || content?.mimetype?.includes('video') || content.filename.includes('.jpg') || content?.mimetype?.includes('image/jpeg')) {
          content.isHaveImage = true;
          content.show = true;
        } else {
          content.isHaveImage = false;
        }
        return content;
      }));
    }
     const flagh = await this.afterGetingData();
  }


  async ngOnInit() {
    console.log(this.newUrldata);
    //  this.data.contents = this.getObjectWithHighestTimeCreated(this.data.contents);

   // Remove query parameters
   const urlWithoutParams = this.removeQueryParams(this.originalUrl);
   // Add token to the URL
   this.modifiedUrlWithToken = this.addToken(urlWithoutParams);
   // Sanitize the URL for use in iframe
   this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.modifiedUrlWithToken);
   console.log('Modified URL with token:', this.modifiedUrlWithToken);


   this.captureScreen();
  //  this.getCourseContent(this.data.id);

  }

////////////////////////////////////////////////////////////////////////

public async captureScreen() {
  const loading = await this.loadingController.create({
    duration: 2000
  });
  // await loading.present();
  const corsProxy = 'https://api.allorigins.win/raw?url=';
  const url = 'https://www.w3.org/Style/CSS/Test/CSS3/Selectors/current/html/static/index.html';
  const proxiedUrl = corsProxy + encodeURIComponent(url);

  this.http.get(proxiedUrl, { responseType: 'text' }).subscribe(
    (html) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      document.body.appendChild(tempDiv);

      html2canvas(tempDiv, { useCORS: true })
        .then((canvas) => {
          const imgWidth = 208;
          const pageHeight = 295;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          const contentDataURL = canvas.toDataURL('image/png');
          const pdf = new jspdf('p', 'mm', 'a4');
          pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);

          const pdfBlob = pdf.output('blob');
          const pdfBlobUrl = URL.createObjectURL(pdfBlob);

          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfBlobUrl);

          document.body.removeChild(tempDiv);
        })
        .catch((error) => {
          console.error('Error generating PDF:', error);
          document.body.removeChild(tempDiv);
        });
    },
    (error) => {
      console.error('Error fetching HTML:', error);
    }
  );
}
/////////////////////////////////////////////////////////////////////////



  getObjectWithHighestTimeCreated(arr:any) {
    
    return arr.reduce((prev:any, current:any) => {
      return (prev.timemodified > current.timemodified) ? prev : current;
    });
  }
  async afterGetingData() {
    setTimeout(() => {
      this.data.contents.forEach((element: any, i: number) => {
        element.showContent = true;
        element.showCollection=false;
        
      });
    }, 500)
    return true;
  }

  // onClickOfNextAndPre(index: number, type: string) {
  //   console.log(index, this.data.contents.length,"data.contents.length")
   
   
  //   console.log( this.index,index)
  //   if (index != -1) {
  //     this.data.contents.forEach((element: any, i: number) => {
  //       if (type == 'Next' && i === index + 1) {
  //         element.htmlFileUrlShow = true;
  //       } else if (type == 'Previous' && i === index - 1) {
  //         element.htmlFileUrlShow = true;
  //       } else {
  //         element.htmlFileUrlShow = false;
  //       }
  //     });
  //   }
  // }

  isShown(contents:any[],filesize:any){
      if(contents.length===1){
        return true
      }else {
        if(filesize){
          return true
        }else return false
      }

  }
  

  getFile(url:string){

    this.http.get(url, { responseType: 'text' }).subscribe(
      data => this.externalHtml = this.sanitizer.bypassSecurityTrustHtml(data)
    );
    return this.externalHtml
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
    // this.location.back();
// let navigationExtras: NavigationExtras = {
//       queryParams: {
//         data: JSON.stringify(this.data),
//       },
//     };
//     this.router.navigate(['cyber-security'],navigationExtras);
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
      const blob = await response.blob();
      // console.log('blob',blob)
      const blobToBase64:any = await this.blobToBase64(blob)
      // console.log('blobToBase64',blobToBase64)

      // Get the path where the image will be saved
      const currentDate = new Date().toLocaleString().replace(/[,:\s\/]/g, '-');

      const path = `gurukul/${currentDate}/${index}/${fileName}`;
      // console.log('path',path)
      // const fileName = `myFile-${currentDate}.pdf`;
      // console.log('data', Directory.Data)
      // console.log('Documents', Directory.Documents)
      const res = await Filesystem.writeFile({
        path: path,
        data: blobToBase64,
        directory: Directory.External,
        recursive: true
      });
      // console.log('File Downloaded Successfully!')
      // console.log("file save",res)
      const convertedUrl = Capacitor.convertFileSrc(res.uri);
      // console.log("convertedUrl",convertedUrl)
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


getItemType(item: any): string {
  if (!item.isHtmlFile && !item.sanitizedVideoUrl && item.isHaveImage) {
    return 'image';
  } else if (!item.isHaveImage && !item.sanitizedVideoUrl && item.isHtmlFile) {
    return 'html';
  } else if (item?.sanitizedVideoUrl) {
    return 'video';
  }
  return '';
}

}
