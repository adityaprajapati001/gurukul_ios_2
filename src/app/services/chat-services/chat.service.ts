import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../token/token.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const AUTH_API = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  token: any;
  private messagesSubscription: any;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) { 
    this.token = this.tokenService.getToken()
  }

  // getMessages(userIdTo: any): Observable<any> {
  //   let params = new HttpParams().set('useridto', userIdTo);
  //   let functionName = 'core_message_get_messages'
  //   return this.http.get(AUTH_API +
  //     `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=${functionName}&wstoken=${this.token}&type=conversations`,
  //     { params }
  //   );
  // }

  getMessages(userIdFrom: any,userIdTo:any): Observable<any> {
    let functionName = 'core_message_get_messages'
    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=${functionName}&wstoken=${this.token}&useridto=${userIdTo}&useridfrom=${userIdFrom}&type=both&read=0&newestfirst=1&limitfrom=0&limitnum=0`,
    );
  }

  // For safe
  // getConversations(userIdFrom: any,userIdTo:any): Observable<any> {
  //   return this.http.get(AUTH_API +
  //     `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_message_get_conversation_between_users&wstoken=${this.token}&userid=${userIdFrom}&otheruserid=${userIdTo}&includecontactrequests=0&includeprivacyinfo=0&memberlimit=0&memberoffset=0&messagelimit=100&messageoffset=0&newestmessagesfirst=1`,
  //   );
  // }

  getConversations(userIdFrom: any,userIdTo:any): Observable<any> {
    return new Observable<any>((observer) => {
      this.messagesSubscription = setInterval(() => {
        this.http.get<any>(AUTH_API + 
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_message_get_conversation_between_users&wstoken=${this.token}&userid=${userIdFrom}&otheruserid=${userIdTo}&includecontactrequests=0&includeprivacyinfo=0&memberlimit=0&memberoffset=0&messagelimit=100&messageoffset=0&newestmessagesfirst=1`
        )
          .subscribe(
            (response) => {
              observer.next(response); // Notify the observer with new data
            },
            (error) => {
              observer.error(error); // Notify the observer if there's an error
            }
          );
      }, 10000); // Polling interval, adjust as needed
    });
  }

  loadFirstTimeConversations(userIdFrom: any,userIdTo:any) {
    return this.http.get<any>(AUTH_API + 
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_message_get_conversation_between_users&wstoken=${this.token}&userid=${userIdFrom}&otheruserid=${userIdTo}&includecontactrequests=0&includeprivacyinfo=0&memberlimit=0&memberoffset=0&messagelimit=100&messageoffset=0&newestmessagesfirst=1`
    ).toPromise()
  }

  unsubscribeMessages() {
    if (this.messagesSubscription) {
      console.log('clear run')
      clearInterval(this.messagesSubscription);
    }
  }

  sendMessage(userIdTo: any,message:any) {
    console.log(message)
    let functionName = 'core_message_send_instant_messages'
    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=${functionName}&wstoken=${this.token}&messages[0][touserid]=${userIdTo}&messages[0][text]=${message}`,
    );
  }

  deleteMessage(userId:any,messageId:any) {
    let functionName = 'core_message_delete_message'
    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=${functionName}&wstoken=${this.token}&messageid=${messageId}&userid=${userId}&read=1`
    );
  }

  markReadAllConversations(userId:any,conversationId:any) {
    let functionName = 'core_message_mark_all_conversation_messages_as_read'
    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=${functionName}&wstoken=${this.token}&userid=${userId}&conversationid=${conversationId}`,
    );
  }

  markReadMessage(messageId:any) {
    const currentDate = new Date();
    const unixTimestamp = Math.floor(currentDate.getTime() / 1000);
    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_message_mark_message_read&wstoken=${this.token}&messageid=${messageId}&timeread=${unixTimestamp}`
    );
  }

}
