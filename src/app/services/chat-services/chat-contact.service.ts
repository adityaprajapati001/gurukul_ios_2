import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../token/token.service';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

const AUTH_API = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ChatContactService {

  token: any;
  adminToken:string = environment.adminToken

  adminTokenNew = environment.adminToken;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) { 
    this.token = this.tokenService.getToken()
    this.adminToken=this.tokenService.getAdminToken() || ''
  }

  // getInstructors(userId: any): Observable<any> {
  //   let params = new HttpParams().set('userid', userId);
  //   console.log(params);
  //   let functionName = 'core_message_get_user_contacts'
  //   return this.http.get(AUTH_API +
  //     `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=${functionName}&wstoken=${this.token}`,
  //     { params }
  //   );
  // }

  getSearchInstructors(userId: any,searchData:string): Observable<any> {
    const formData = new FormData();
    formData.append('token', this.token);
    formData.append('userid', userId);
    formData.append('task', "search_contacts");
    formData.append('searchData', searchData);
    return this.http.post(AUTH_API +
      `webservice/rest/api.php`, formData
    )
    // .pipe(
    //   map((response:any) => {
    //     console.log(typeof response[0])
    //     const customerLists = [];
    //     if(typeof response[0] == 'object') {
    //       for (const key in response) {
    //         if (response.hasOwnProperty(key) && !isNaN(Number(key))) {
    //           customerLists.push(response[key]);
    //         }
    //       }
    //       return customerLists;
    //     } else if() {
          
    //     }
        
    //   })
    // );
  }

  getInstructors(userIdFrom: any,userIdTo:any): Observable<any> {
    const formData = new FormData();
    console.log('getInstructors:', formData);
    return this.http.post(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_message_get_messages&wstoken=${this.token}&useridto=${userIdTo}&useridfrom=${userIdFrom}&type=both&read=2&newestfirst=1&limitfrom=0&limitnum=0`, formData
    )
  }



  
  // Example for query parameters
// getInstructors(userIdFrom: any, userIdTo: any): Observable<any> {
//   let params = new HttpParams()
//     .set('moodlewsrestformat', 'json')
//     .set('wsfunction', 'core_message_get_messages')
//     .set('wstoken', this.token)
//     .set('useridfrom', userIdFrom)
//     .set('useridto', userIdTo)
//     .set('type', 'both')
//     .set('read', '2')
//     .set('newestfirst', '1')
//     .set('limitfrom', '0')
//     .set('limitnum', '0');

//   console.log('Sending parameters:', params.toString());

//   return this.http.get(AUTH_API + 'webservice/rest/server.php', { params });
// }


  getChatMemberInfo(userId: any): Observable<any> {
    // return this.http.get(AUTH_API +
    //   `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_message_get_member_info&wstoken=${this.adminToken}&userids[0]=${userId}&referenceuserid=${userId}`
    // );

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wstoken=${this.adminTokenNew}&wsfunction=core_message_get_member_info&userids[0]=${userId}&referenceuserid=${userId}`
    );
  }

  

}
