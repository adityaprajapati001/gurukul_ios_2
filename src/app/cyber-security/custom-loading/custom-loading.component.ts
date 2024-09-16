import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { IframeMessageListenerService } from '../../services/iframe-message-listener/iframe-message-listener.service';
import { ScormApiService } from 'src/app/services/scorm-api/adityascorm-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/token/token.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-custom-loading',
  templateUrl: './custom-loading.component.html',
  styleUrls: ['./custom-loading.component.scss'],
})
export class CustomLoadingComponent implements OnInit, OnDestroy {

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
    private iframeMessageListenerService: IframeMessageListenerService,
    private scormApiService: ScormApiService,
    private authservice: AuthService,
    private tokenservice: TokenService,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
    private router: Router,
    private loadingController: LoadingController,
  ) { }

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

  // ngOnInit(): void {
  //   this.messageSubscription = this.iframeMessageListenerService.messages$.subscribe(
  //     (value: any) => {
  //       this.receivedHtmlValue = value;
  //       this.updateScore = value;
  //       console.log('Message received in component:', value);
  //       // After setting updateScore, check if it's valid and proceed
  //       if (this.updateScore !== undefined) {
  //         this.handleUpdateScore();
  //       } else {
  //         console.error('UpdateScore is undefined.');
  //       }
  //     }
  //   );

    this.GetAttempts();
    this.getUser();

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
  

  // GetAttempts() {
  //   // Simulate the attempt count retrieval
  //   if (this.userRealid === null) {
  //     console.error('UserRealid is not set. Cannot fetch attempts.');
  //     return;
  //   }

  //   console.log('GetAttempts_userRealid:', this.userRealid);

  //   // Example logic: simulate fetching current attempts
  //   this.currentAttempts = this.currentAttempts || 0;

  //   console.log('Current Attempt Count:', this.currentAttempts);

  //   if (this.currentAttempts < this.maxAttempts) {
  //     console.log('Attempt is within the allowed limit. Proceeding with submission.');
  //     this.sendScormData();
  //   } else {
  //     this.error = 'Maximum attempt limit reached';
  //     console.error('Maximum attempt limit reached');
  //   }
  // }


  //   GetAttempts() {
  //   if (this.userRealid === null) {
  //     console.error('UserRealid is not set. Cannot fetch attempts.');
  //     return;
  //   }

  //   console.log('GetAttempts_userRealid:', this.userRealid);
    
  //   this.scormApiService.getAttemptCount(this.scormIdNew, this.userRealid).subscribe(
  //     data => {
  //       console.log('GetAttempts', data);
  //       // const currentAttempts = data.attemptscount;
  //       this.currentAttempts = data.attemptscount;
  //       console.log('Current Attempt Count:', this.currentAttempts);

  //       if (this.currentAttempts < this.maxAttempts) {
  //         console.log('Attempt is within the allowed limit. Proceeding with submission.');
  //         this.sendScormData();
  //       } else {
  //         this.error = 'Maximum attempt limit reached';
  //         console.error('Maximum attempt limit reached');
  //       }
  //     },
  //     err => {
  //       console.error('Error fetching attempt count:', err);
  //       this.error = 'Failed to fetch attempt count';
  //     }
  //   );
  // }



  // GetAttempts() { // **Updated**
  //   if (this.userRealid === null) {
  //     console.error('UserRealid is not set. Cannot fetch attempts.');
  //     return;
  //   }
  
  //   console.log('GetAttempts_userRealid:', this.userRealid);
  
  //   this.scormApiService.getAttemptCount(this.scormIdNew, this.userRealid).subscribe(
  //     data => {
  //       console.log('Attempt data:', data);
        
  //       // Ensure that attemptscount is correctly extracted
  //       if (data && data.attemptscount !== undefined) {
  //         this.currentAttempts = data.attemptscount;
  //         console.log('Current attempts:', this.currentAttempts);
  
  //         // Check if the current attempts is less than the maximum allowed attempts
  //         if (this.currentAttempts < this.maxAttempts) {
  //           this.sendScormData(); // **Updated**
  //         } else {
  //           console.log('Maximum attempts reached.');
  //         }
  //       } else {
  //         console.error('Attempt count data is missing or malformed:', data);
  //         console.log('Proceeding with sending data as no valid attempt count found.');
  //         this.sendScormData(); // **Updated**
  //       }
  //     },
  //     error => {
  //       console.error('Error fetching SCORM attempts:', error);
  //     }
  //   );
  // }


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
  


  // sendScormData() {
  //   if (this.updateScore === undefined) {
  //     console.error('Cannot send SCORM data: updateScore is not set.');
  //     return;
  //   }

  //   const tracks = [
  //     { element: 'cmi.core.score.raw', value: this.updateScore },
  //     { element: 'cmi.core.score.min', value: '0' },
  //     { element: 'cmi.core.score.max', value: '100' },
  //     { element: 'cmi.core.lesson_status', value: this.tValue }
  //   ];

  //   console.log('Tracks data to be sent:', tracks);

  //   this.scormApiService.insertScormTracks(tracks).subscribe(
  //     response => {
  //       console.log('Success:', response);
  //       // Increment attempt count after successful submission
  //       this.currentAttempts = (this.currentAttempts || 0) + 1;
  //     },
  //     error => {
  //       console.error('Error:', error);
  //     }
  //   );
  // }


  // sendScormData() {
  //   if (this.updateScore === undefined || this.scoid === undefined || this.currentAttempts === undefined) {
  //     console.error('Cannot send SCORM data: Required data is not set.');
  //     return;
  //   }
  
  //   const tracks = [
  //     { element: 'cmi.core.score.raw', value: this.updateScore },
  //     { element: 'cmi.core.score.min', value: '0' },
  //     { element: 'cmi.core.score.max', value: '100' },
  //     { element: 'cmi.core.lesson_status', value: this.tValue }
  //   ];
  
  //   console.log('Tracks data to be sent:', tracks);
  
  //   this.scormApiService.insertScormTracks2(tracks, this.scoid, this.currentAttempts).subscribe(
  //     response => {
  //       console.log('Success:', response);
  //       // Increment attempt count after successful submission
  //       this.currentAttempts = (this.currentAttempts || 0) + 1;
  //     },
  //     error => {
  //       console.error('Error:', error);
  //     }
  //   );
  // }
  

  // sendScormData() {
  //   if (this.updateScore === undefined) {
  //     console.error('Cannot send SCORM data: updateScore is not set.');
  //     return;
  //   }

  //   const tracks = [
  //     { element: 'cmi.core.score.raw', value: this.updateScore },
  //     { element: 'cmi.core.score.min', value: '0' },
  //     { element: 'cmi.core.score.max', value: '100' },
  //     { element: 'cmi.core.lesson_status', value: this.tValue }
  //   ];

  //   console.log('Tracks data to be sent:', tracks);

  //   this.scormApiService.insertScormTracks(tracks).subscribe(
  //     response => {
  //       console.log('Success:', response);
  //       // Increment attempt count after successful submission
  //       this.currentAttempts++;
  //       console.log('Current attempt count after submission:', this.currentAttempts);

  //       // Check if the maximum attempts have been reached
  //       if (this.currentAttempts >= this.maxAttempts) {
  //         console.log('Maximum attempts reached. Further submissions are not allowed.');
  //       }
  //     },
  //     error => {
  //       console.error('Error:', error);
  //     }
  //   );
  // }


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
    await loading.present();
    this.router.navigate(['/home']);
    await loading.dismiss();

  }


  async submit() { // **Updated**

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
    await loading.present();
    // this.router.navigate(['/home']);
    await loading.dismiss();

  }


  

  home(){
    this.router.navigate(['/cyber-security']);
  }
  

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe(); // Clean up subscription on component destroy
    }
  }
}



// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Subscription } from 'rxjs';
// import { IframeMessageListenerService } from '../../services/iframe-message-listener/iframe-message-listener.service';
// import { ScormApiService } from 'src/app/services/scorm-api/adityascorm-api.service';
// import { AuthService } from 'src/app/services/auth/auth.service';
// import { TokenService } from 'src/app/services/token/token.service';

// @Component({
//   selector: 'app-custom-loading',
//   templateUrl: './custom-loading.component.html',
//   styleUrls: ['./custom-loading.component.scss'],
// })
// export class CustomLoadingComponent implements OnInit, OnDestroy {

//   passingScore: number | null = null;
//   currentScore: string = '';
//   scaledScore: string = '';
//   setScoreResult: boolean = false;

//   private messageSubscription: Subscription;
//   receivedHtmlValue: string;
//   messages: any;
//   updateScore: number | undefined; // Ensure this is correctly typed
//   scormData: any;
//   error: string;
//   learnerName: string = '';

//   moduleInstance: number | undefined;

//   currentAttempts: any;
//   private maxAttempts = 6;
//   private scormId = 157;
//   scormIdNew: any | undefined; // Ensure this is correctly typed
//   userRealid: number | null = null;
//   userData: any;
  
//   constructor(
//     private iframeMessageListenerService: IframeMessageListenerService,
//     private scormApiService: ScormApiService,
//     private authservice: AuthService,
//     private tokenservice: TokenService
//   ) { }

//   ngOnInit(): void {
//     this.messageSubscription = this.iframeMessageListenerService.messages$.subscribe(
//       (value: any) => {
//         this.receivedHtmlValue = value;
//         this.updateScore = value;
//         console.log('Message received in component:', value);
//         // After setting updateScore, check if it's valid and proceed
//         if (this.updateScore !== undefined) {
//           this.handleUpdateScore();
//         } else {
//           console.error('UpdateScore is undefined.');
//         }
//       }
//     );

//     this.getUser();
//   }
  
//   handleUpdateScore() {
//     // Example of how to call methods after updateScore is set
//     if (this.scormIdNew) {
//       this.GetAttempts(); // Assuming GetAttempts depends on updateScore being set
//     } else {
//       console.error('scormIdNew is not set.');
//     }
//   }

//   getUser() {
//     const username = localStorage.getItem('username');
//     console.log('Username from local storage:', username);
    
//     if (!username) {
//       console.error('Username is not set');
//       return;
//     }

//     this.authservice.getUserInfo(username).subscribe({
//       next: (data) => {
//         console.log('User data:', data);
//         if (data && data.length > 0) {
//           this.userData = data;
//           this.userRealid = data[0].id;
//           console.log('User Real ID:', this.userRealid);

//           this.loadCourseContent(this.scormId);
//         } else {
//           console.error('No user data received or data array is empty');
//         }
//       },
//       error: (error: any) => {
//         console.error('Error fetching user info:', error);
//       },
//     });
//   }
  
//   loadCourseContent(scormId: any): void {
//     this.scormApiService.getScormsByCourseId(scormId).subscribe(
//       (response: any) => {
//         console.log('response', response);
//         if (response && response.scorms && response.scorms.length > 0) {
//           this.scormIdNew = response.scorms[8]?.id;
//           console.log('this.scormIdNew', this.scormIdNew);

//           if (this.scormIdNew) {
//             this.getScormUserData();
//           } else {
//             console.error('scormIdNew is undefined after loading course content.');
//           }
//         } else {
//           console.error('No scorms found in the response.');
//         }
//       },
//       (error: any) => {
//         console.error('Error fetching course content:', error);
//       }
//     );
//   }

//   getScormUserData() {
//     if (!this.scormIdNew) {
//       console.error('scormIdNew is not set. Cannot fetch SCORM user data.');
//       return;
//     }
  
//     console.log('Fetching SCORM user data for scormIdNew:', this.scormIdNew);
  
//     this.scormApiService.getScormUserData(this.scormIdNew, 2).subscribe(
//       data => {
//         this.scormData = data;
//         console.log('SCORM Data:', this.scormData);
//       },
//       err => {
//         this.error = 'Failed to fetch SCORM data';
//         console.error('Error fetching SCORM data:', err);
//       }
//     );
//   }

//   GetAttempts() {
//     if (this.userRealid === null) {
//       console.error('UserRealid is not set. Cannot fetch attempts.');
//       return;
//     }

//     console.log('GetAttempts_userRealid:', this.userRealid);
    
//     this.scormApiService.getAttemptCount(this.scormIdNew, this.userRealid).subscribe(
//       data => {
//         const currentAttempts = data.attemptscount;
//         this.currentAttempts = currentAttempts;
//         console.log('Current Attempt Count:', currentAttempts);

//         if (currentAttempts < this.maxAttempts) {
//           console.log('Attempt is within the allowed limit. Proceeding with submission.');
//           this.sendScormData();
//         } else {
//           this.error = 'Maximum attempt limit reached';
//           console.error('Maximum attempt limit reached');
//         }
//       },
//       err => {
//         console.error('Error fetching attempt count:', err);
//         this.error = 'Failed to fetch attempt count';
//       }
//     );
//   }

//   sendScormData() {
//     if (this.updateScore === undefined) {
//       console.error('Cannot send SCORM data: updateScore is not set.');
//       return;
//     }

//     const tracks = [
//       { element: 'cmi.core.score.raw', value: this.updateScore },
//       { element: 'cmi.core.score.min', value: '0' },
//       { element: 'cmi.core.score.max', value: '100' },
//       { element: 'cmi.core.lesson_status', value: 'completed' }
//     ];

//     console.log('Tracks data to be sent:', tracks);

//     this.scormApiService.insertScormTracks(tracks).subscribe(
//       response => {
//         console.log('Success:', response);
//       },
//       error => {
//         console.error('Error:', error);
//       }
//     );
//   }

//   ngOnDestroy(): void {
//     if (this.messageSubscription) {
//       this.messageSubscription.unsubscribe(); // Clean up subscription on component destroy
//     }
//   }
// }
