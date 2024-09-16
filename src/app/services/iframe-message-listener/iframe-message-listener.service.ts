// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class IframeMessageListenerService {

//   constructor() { }
// }


// import { Injectable, OnDestroy } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class IframeMessageListenerService implements OnDestroy {
//   private messageListener: (event: MessageEvent) => void;
  
//   messages$: any;

//   constructor() {
//     this.messageListener = this.handleMessage.bind(this);
//     window.addEventListener('message', this.messageListener, false);
//   }

//   private handleMessage(event: MessageEvent): void {
//     // Optionally, check the event.origin to verify it's coming from the expected source
//     // if (event.origin !== 'http://your-iframe-origin.com') return;

//     if (event.data.type === 'decodedHtml') {
//       console.log('Received decoded HTML value:', event.data.value);
//       // You can also handle the value as needed in your app
//     }
//   }

//   ngOnDestroy(): void {
//     window.removeEventListener('message', this.messageListener, false);
//   }
// }


import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IframeMessageListenerService implements OnDestroy {
  private messageListener: (event: MessageEvent) => void;
  private messageSubject = new Subject<any>(); // or use a specific type for more strict typing

  // Observable stream for components to subscribe to
  messages$ = this.messageSubject.asObservable();
  

  constructor() {
    this.messageListener = this.handleMessage.bind(this);
    window.addEventListener('message', this.messageListener, false);
  }

  private handleMessage(event: MessageEvent): void {
    // // Log the entire event object for debugging
    // console.log('Received event:', event);
    
    // // Log the type and value from the event data
    // console.log('Event data type:', event.data.type);

    // console.log('Event', event);
    // console.log('Event data value:', event.data.value);

    // Check if both type and value exist in the event data
    if (event.data.type && event.data.value) {
        this.messageSubject.next({
            type: event.data.type,
            value: event.data.value
        });
    }


  

  // private handleMessage(event: MessageEvent): void {
  //   // Optionally, check the event.origin to verify it's coming from the expected source
  //   // if (event.origin !== 'http://your-iframe-origin.com') return;

  //   if (event.data.type === 'decodedHtml') {
  //     console.log('Received decoded HTML value:', event.data.value);
  //     this.messageSubject.next(event.data.value); // Emit the message value to subscribers
  //   }

  //   if (event.data.type === 'decodedHtml2') {
  //     console.log('Received decoded HTML value2:', event.data.value);
  //     this.messageSubject.next(event.data.value); // Emit the message value to subscribers
  //   }

  //   if (event.data.type === 't') {
  //     console.log('Received decoded HTML value t:', event.data.value);
  //     this.messageSubject.next(event.data.value); // Emit the message value to subscribers
  //   }
    

  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.messageListener, false);
  }
}

