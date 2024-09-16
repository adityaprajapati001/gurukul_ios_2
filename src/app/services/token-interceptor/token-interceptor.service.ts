import { Injectable, Injector } from '@angular/core';
import { TokenService } from '../token/token.service';
import { HttpInterceptor } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private injector: Injector) { }

  intercept(req:any, next:any) {
    console.log('i am run')
    let tokenStorage=this.injector.get(TokenService)
    console.log(tokenStorage.getToken());
    // if(req.url.indexOf("/fcm/send")>0 && req.method == "POST") {
    //   req = req.clone({
    //     setHeaders: {
    //     'Authorization': `key=${environment.firebaseFCMServerKey}`,
    //     'Content-Type':'application/json'
    //   }
    // });
    //   return next.handle(req)
    // }
    let tokenizedReq = req.clone({
     setHeaders:{
      "x-access-token":`${tokenStorage.getToken()}`
     }
    })
    return next.handle(tokenizedReq)
  }
}