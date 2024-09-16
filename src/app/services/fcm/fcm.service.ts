import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  private newToken = new BehaviorSubject<any>({
    deviceToken: undefined,
  });

  constructor(private http:HttpClient) { }
  
 fcm(){ 
  PushNotifications.requestPermissions().then(result => {
    if (result.receive === 'granted') {
      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.register();
    } else {
      // Show some error
    }
  });

  PushNotifications.addListener('registration', (token: Token) => {
    console.log('Push registration success, token: ' + token.value)
    if(token.value) {
      this.setNewUserInfo(token.value)
    }
    // alert('Push registration success, token: ' + token.value);
  });

  PushNotifications.addListener('registrationError', (error: any) => {
    // alert('Error on registration: ' + JSON.stringify(error));
  });

  PushNotifications.addListener(
    'pushNotificationReceived',
    (notification: PushNotificationSchema) => {
      // console.log('Push received: ' + JSON.stringify(notification));
      // alert('Push received: ' + JSON.stringify(notification));
    },
  );

  PushNotifications.addListener(
    'pushNotificationActionPerformed',
    (notification: ActionPerformed) => {
      // console.log('Push action performed: ' + JSON.stringify(notification));
      // alert('Push action performed: ' + JSON.stringify(notification));
    },
  );
}
  
  setNewUserInfo(token: any) {
    this.newToken.next(token);
  }

  getNewUserInfo() {
    return this.newToken.asObservable();
  }

  async sendPushNotification() {
    try {
      const headers = new HttpHeaders({
        'Authorization': `key=${environment.firebaseFCMServerKey}`,
        'Content-Type':'application/json'
      });
      let url = 'https://fcm.googleapis.com/fcm/send';
      let body = {
        "to": "d9B4YlciSyW2VHfMHs6497:APA91bGhi09Yw__xXxZfXwP1E4y6Iann5adEnZCvi6tOpeDcGVV87A42E4h0R-OgNO_M7z1Vuhg2OB0yBSFYCHxoA5UDSF4SNQ53YGMr3Nt9k7XGvLRDCX0-xO1jGTi9QsgoF-bLi9dJ",
        "notification": {
            "title": "Check this Mobile (title)",
            "body": "Rich Notification testing (body)",
            "icon" : "https://cdn-icons-png.flaticon.com/256/15094/15094822.png",
          "sound" : "default"
        },
        "data": {
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREBuBZSySbBnaUW2zeJzQopgUWQjDyy_LUsv23zcq67Q&s",
            "meta": {
                "type": "small",
                "info": "Search"
            }
        }
    }
      const res = await this.http.post(url,JSON.stringify(body),{ headers }).toPromise()
    } catch(err) {
      console.log(err)
    }
  }

}