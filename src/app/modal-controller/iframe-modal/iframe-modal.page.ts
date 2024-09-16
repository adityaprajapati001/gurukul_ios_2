import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding, FileInfo } from '@capacitor/filesystem';
import { LoadingController, ModalController } from '@ionic/angular';
// declare var pipwerks: any;

import { AiccService } from '../../services/zip-service/aicc.service';
import { Router } from '@angular/router';

import { IframeMessageListenerService } from '../../services/iframe-message-listener/iframe-message-listener.service';
import { Subscription } from 'rxjs';
import { ScormApiService } from 'src/app/services/scorm-api/adityascorm-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-iframe-modal',
  templateUrl: './iframe-modal.page.html',
  styleUrls: ['./iframe-modal.page.scss'],
})
export class  IframeModalPage implements OnInit {
  iframeSrc!: SafeResourceUrl;
  htmlData:any = '';
  
  decodedHtmlValue: string | null = null;
  decodedHtml2Value: string | null = null;
  tValue: string | null = null;
  resumer: string | null = null;

  private messageSubscription: Subscription;
  updateScore: number | undefined;
  scormData: any;
  error: string;
  learnerName: string = '';

  moduleInstance: number | undefined;
  currentAttempts: number = 1;
  maxAttempts: any;
  // private maxAttempts = 6;
  // private scormId = 157;
  scormIdNew: any | undefined;
  userRealid: number | null = null;
  userData: any;

  scoid: any;
  loading: any;

  constructor(
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    private router: Router,
    private iframeMessageListenerService: IframeMessageListenerService,
    private scormApiService: ScormApiService,
    private authservice: AuthService,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
    private loadingController: LoadingController,
  ) {
   
  }



  ngOnInit(): void {
    this.messageSubscription = this.iframeMessageListenerService.messages$.subscribe(
      (value: any) => {
        console.log('Received value:', value); // Confirm the value structure

        if (value && value.type) {
          switch (value.type) {
            // case 'decodedHtml':
            //   this.decodedHtmlValue = value.value;
            //   console.log('Decoded HTML Value set to:', this.decodedHtmlValue);
            //   break;
            case 'decodedHtml2':
              this.updateScore = value.value;
              console.log('Decoded HTML2 Value set to:', this.updateScore);
              break;
            case 't':
              this.tValue = value.value;
              console.log('T Value set to:', this.tValue);
              break;
            case 'decodedHtml4':
                this.resumer = value.value;
                console.log('T Value set to:', this.resumer);
                break;
            default:
              console.warn('Unknown message type:', value.type);
              break;
          }
          this.cdr.detectChanges(); // Manually trigger change detection
        } else {
          console.error('Received value does not have a type:', value);
        }
      }
    );
    this.loadStoryHtml();
    this.GetAttempts();
    this.getUser();
  }

  
  // ngOnInit(): void {
  //   this.loadStoryHtml();
  // }

  dismiss() {
    this.modalController.dismiss();
  }



  async loadStoryHtml() {
    // Define paths
    const directoryPath = 'gurukul/unzip_files';
    const directoryPath2 = 'gurukul/unzip_files/scormcontent';

    // Fetch directory contents
    console.log('directoryPath', directoryPath);
    const directoryContents = await this.readDirectory(directoryPath);
    console.log('Directory contents:', directoryContents);

    console.log('directoryPath2', directoryPath2);
    const directoryContents2 = await this.readDirectory(directoryPath2);
    console.log('Directory contents2:', directoryContents2);

    // Try to find 'index.html' in the first directory
    let htmlPath = directoryContents.find(file => file.name === 'index.html');

    if (!htmlPath) {
        // If 'index.html' is not found, try the second directory
        htmlPath = directoryContents2.find(file => file.name === 'index.html');
    }

    // If 'index.html' is not found, try to find 'launcher.html' in the second directory
    if (!htmlPath) {
        htmlPath = directoryContents.find(file => file.name === 'launcher.html');
    }

    // Handle the case where neither 'launcher.html' nor 'index.html' is found
    if (!htmlPath) {
        console.error('HTML file (launcher.html or index.html) not found in the directories');
        return;
    }

    // Convert the file URI and set the iframe source
    console.log('htmlPath', htmlPath);
    const convertedUrl = Capacitor.convertFileSrc(htmlPath.uri);
    console.log('convertedUrl', convertedUrl);
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(convertedUrl);
    console.log('iframeSrc', this.iframeSrc);
}



  // async loadStoryHtml() {
  //   const directoryPath = 'gurukul/unzip_files';
  //   console.log('directoryPath', directoryPath);
  //   const directoryContents = await this.readDirectory(directoryPath);
  //   console.log('Directory contents:', directoryContents);

  //   const directoryPath2 = 'gurukul/unzip_files/scormcontent';
  //   console.log('directoryPath', directoryPath2);
  //   const directoryContents2 = await this.readDirectory(directoryPath2);
  //   console.log('Directory contents:', directoryContents2);

  //   // const htmlPath = directoryContents.find(file => file.name === 'launcher.html');

  //   // Find the HTML file, which could be either 'launcher.html' or 'index.html'
  //   const htmlPath = directoryContents2.find(file => 
  //     file.name === 'index.html'
  //   );

  //   if (!htmlPath) {
  //     console.error('HTML file (launcher.html or index.html) not found in the directory');
  //     return;
  // }

  //   console.log('htmlPath',htmlPath);
  //   // const bootstrapper = directoryContents.find(file => file.name === '/EXTERNAL/gurukul/unzip_files/launcher.htmlgurukul/unzip_files/html5/lib/scripts/bootstrapper.min.js');
  //   // console.log('bootstrapper', bootstrapper)

  //   if (!htmlPath) {
  //     console.error('story.html file not found in the directory');
  //     return;
  //   }
  //   const convertedUrl = Capacitor.convertFileSrc(htmlPath.uri);
  //   console.log('convertedUrl',convertedUrl)
  //   this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(convertedUrl);
  //   console.log('iframeSrc',this.iframeSrc)


  // }
  
  async readFile(filePath: string): Promise<string | Blob | undefined> {
    try {
      const result = await Filesystem.readFile({
        path: filePath,
        directory: Directory.External,
        // encoding: Encoding.UTF8
      });
      return result.data;
    } catch (error) {
      console.error('Error reading file:', error);
      return undefined;
    }
  }

  async readDirectory(directoryPath: string): Promise<any[]> {
    try {
      const result = await Filesystem.readdir({
        path: directoryPath,
        directory: Directory.External
      });
      // Map FileInfo objects to file names
      return result.files
      // return result.files.map((fileInfo: FileInfo) => fileInfo.name);
    } catch (error) {
      console.error('Error reading directory:', error);
      return [];
    }
  }

  

  handleUpdateScore() { // **Updated**
    if (this.scormIdNew && this.updateScore !== undefined) {
      this.GetAttempts();
    } else {
      console.error('Cannot proceed: scormIdNew or updateScore is not set.');
    }
  }
  


  getUser() {
    const username = localStorage.getItem('username');
    console.log('Username from local storage:', username);
  
    if (!username) {
      console.error('Username is not set');
      return;
    }
  
    this.authservice.getUserInfo(username).subscribe({
      next: (data) => {
        console.log('User data:', data);
        if (data && data.length > 0) {
          this.userData = data;
          this.userRealid = data[0].id;
          console.log('User Real ID:', this.userRealid);
  
          // Load course content only after userRealid is set
          this.loadCourseContent(this.scormIdNew);
        } else {
          console.error('No user data received or data array is empty');
        }
      },
      error: (error: any) => {
        console.error('Error fetching user info:', error);
      },
    });
  }
  
  
loadCourseContent(scormId: any): void {
  this.scormApiService.getScormsByCourseId(scormId).subscribe(
    (response: any) => {
      console.log('response', response);
      if (response && response.scorms && response.scorms.length > 0) {
        this.scormIdNew = response.scorms[4]?.id; //user  need to set dynamic according user.
        // this.scormIdNew = response.scorms[8]?.id; //admin
        this.maxAttempts = response.scorms[8]?.maxattempt;
        console.log('this.scormIdNew', this.scormIdNew);
        console.log('this.maxAttempts', this.maxAttempts);

        if (this.scormIdNew) {
          this.getScormUserData();
        } else {
          console.error('scormIdNew is undefined after loading course content.');
        }
      } else {
        console.error('No scorms found in the response.');
      }
    },
    (error: any) => {
      console.error('Error fetching course content:', error);
    }
  );
}


getScormUserData() {
  if (!this.scormIdNew || this.userRealid === null) {
    console.error('scormIdNew or userRealid is not set. Cannot fetch SCORM user data.');
    return;
  }

  console.log('Fetching SCORM user data for scormIdNew:', this.scormIdNew);

  this.scormApiService.getScormUserData(this.scormIdNew, this.currentAttempts).subscribe(
    data => {
      this.scormData = data;
      this.scoid = data.data[1].scoid;
      console.log('SCORM Data:', this.scormData);
      console.log('scoid:', this.scoid);

      // Call GetAttempts only after scormData is fetched
      this.GetAttempts();
    },
    err => {
      this.error = 'Failed to fetch SCORM data';
      console.error('Error fetching SCORM data:', err);
    }
  );
}
  

  GetAttempts() {
    if (this.userRealid === null) {
      console.error('UserRealid is not set. Cannot fetch attempts.');
      return;
    }
  
    console.log('GetAttempts_userRealid:', this.userRealid);
  
    this.scormApiService.getAttemptCount(this.scormIdNew, this.userRealid).subscribe(
      data => {
        console.log('Attempt data:', data);
        
        // Ensure that attemptscount is correctly extracted
        if (data && data.attemptscount !== undefined) {
          this.currentAttempts = data.attemptscount;
          console.log('Current attempts:', this.currentAttempts);
  
          // Check if the current attempts is less than the maximum allowed attempts
          if (this.currentAttempts < this.maxAttempts) {
            console.log('Attempt is within the allowed limit. Proceeding with submission.');
            this.sendScormData(); // Call sendScormData only if within limits
          } else {
            console.log('Maximum attempts reached. Further submissions are not allowed.');
            this.error = 'Maximum attempts reached. Further submissions are not allowed.';
            // Optional: Disable submission button or similar UI changes
          }
        } else {
          console.error('Attempt count data is missing or malformed:', data);
          // Handle missing or malformed data appropriately
          this.error = 'Error retrieving attempt count. Cannot proceed with submission.';
        }
      },
      error => {
        console.error('Error fetching SCORM attempts:', error);
        this.error = 'Error fetching SCORM attempts.';
      }
    );
  }
  


 async sendScormData() { // **Updated**

    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 1000
    });
    
    if (this.updateScore === undefined) {
      console.error('Cannot send SCORM data: updateScore is not set.');
      return;
    }

    const tracks = [
      { element: 'cmi.core.score.raw', value: this.updateScore },
      { element: 'cmi.core.score.min', value: '0' },
      { element: 'cmi.core.score.max', value: '100' },
      { element: 'cmi.core.lesson_status', value: this.tValue }
    ];

    console.log('Tracks data to be sent:', tracks);

    // **Increment currentAttempts and send with SCORM data**
    const newAttemptCount = this.currentAttempts + 1;
    console.log('Attempt count to be sent:', newAttemptCount);
    
    this.scormApiService.insertScormTracks2(tracks, this.scoid, newAttemptCount).subscribe(
      response => {
        console.log('Success:', response);
        // Update the currentAttempts to the newly incremented value
        this.currentAttempts = newAttemptCount;
        // **Check if the maximum attempts have been reached**
        
        if (this.currentAttempts >= this.maxAttempts) {
          console.log('Maximum attempts reached. Further submissions are not allowed.');
        }
      },
      error => {
        console.error('Error:', error);
      }
    );
    await loading.dismiss();
    // this.router.navigate(['/home']);
        if (this.modalController) {
          await this.modalController.dismiss(); // If using modalController
      } else {
          console.log('ModalController is not available.');
          // Optionally, handle navigation or other cleanup if needed
      }

  }
  

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe(); // Clean up subscription on component destroy
    }
  }
}


