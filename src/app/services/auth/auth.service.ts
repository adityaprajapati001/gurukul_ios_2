import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../token/token.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FcmService } from '../fcm/fcm.service';
import { PushNotifications, Token } from '@capacitor/push-notifications';

const AUTH_API = environment.baseUrl;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Custom-Header': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type,Access-Control-Allow-Headers,lang',
    'Access-Control-Allow-Origin': '*'
  }),
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: any;
  fcmToken: any =  ""
  instance: any;
  // fcmToken: any =  "0f146936696e9ed06abff2a53f5e3d8e"
  constructor(private http: HttpClient,private tokenService: TokenService,private fcmService: FcmService) { 
    this.token = this.tokenService.getToken()
    // this.initPushNotifications();
  }

  initPushNotifications() {
    this.fcmService.getNewUserInfo().subscribe(token => {
      this.fcmToken = token;
      console.log("02222222222222222222222222222222222222222222222222220222222@@@@@@@@@@",this.fcmToken);
    })
  }

  login(username: string, password: string): Observable<any> {
    let params = new HttpParams()
      .set('username', username)
      .set('password', password);
    console.log(params);

    return this.http.get(AUTH_API +
      'login/token.php?service=moodle_mobile_app',
      { params },
      
    );
  }

  validateEmail(email: any): Observable<any> {
    let params = new HttpParams().set('values[0]', email);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wstoken=${this.tokenService.getAdminToken()}&wsfunction=core_user_get_users_by_field&field=email`,
      { params }
    );
  }

  sendOtp(phone: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams({
      task: 'sendotp',
      phone: phone
    }).toString();
    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
  }

  loginViaOtp(phone: string, otp: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams({
      task: 'verifyopt',
      phone: phone,
      votpid: otp,
    }).toString();
    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
  }

  expireOtp(phone: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams({
      task: 'expiredOTP',
      phone: phone,
    }).toString();
    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
  }

  forgotPassword(email: any): Observable<any> {
    let params = new HttpParams().set('email', email);
    console.log(params);

    return this.http.get(`https://gurukul.skfin.in/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_auth_request_password_reset&wstoken=${environment.adminToken}`,
      { params }
    );
  }

  getUserInfo(username: any): Observable<any> {
    let params = new HttpParams().set('values[0]', username);
    console.log(params);


    // return this.http.get(AUTH_API +
    //   `webservice/rest/server.php?moodlewsrestformat=json&wstoken=${this.tokenService.getAdminToken()}&wsfunction=core_user_get_users_by_field&field=username`,
    //   { params }
    // );
    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wstoken=${environment.adminToken}&wsfunction=core_user_get_users_by_field&field=username`,
      { params }
    );
    
 

  //   `webservice/rest/server.php?moodlewsrestformat=json&wstoken=${this.token}&wsfunction=core_user_get_users_by_field&field=username`,
  //   { params }
  // );
  }

  getUserInfoByUserId(userId: any): Observable<any> {
    let params = new HttpParams().set('values[0]', userId);
    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wstoken=${this.token}&wsfunction=core_user_get_users_by_field&field=id`,
      { params }
    );
  }

  getRecentCourses(): Observable<any> {
    // let params = new HttpParams().set('userid', id);
    // console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=block_recentlyaccesseditems_get_recent_items&wstoken=${this.token}`,
      // { params }
    );
  }

//   task:createRecentItem
// token:d92a80ae5302871cc8294257a89cc269
// userid:4998
// courseid:2
// cmid:375
// timeaccess:1714107995


createRecentItems(id: any,userId: any,courseid: any) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  // Get the current timestamp in milliseconds
  const timeaccess = Date.now().toString();

  const body = new URLSearchParams({
    task: 'createRecentItem',
    cmid: id,
    token: this.token,
    userid: userId,
    courseid : courseid,
    timeaccess: timeaccess,
  }).toString();

  return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
}

  getRecentCoursesByID(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams({
      task: 'getModuleInstance',
      cmid: id,
    }).toString();
    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
  }

  getCourses(id: any): Observable<any> {
    let params = new HttpParams().set('userid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_enrol_get_users_courses&wstoken=${this.token}`,
      { params }
    );
  }

  getCoursesById(id: any): Observable<any> {
    let params = new HttpParams().set('value', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_course_get_courses_by_field&wstoken=${this.token}&field=id`,
      { params }
    );
  }

  getCalendarEvent(year: any, month: any): Observable<any> {
    let params = new HttpParams()
      .set('year', year)
      .set('month', month);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_calendar_get_calendar_monthly_view&wstoken=${this.token}`,
      { params }
    );
  }

  getCourseContent(id: any): Observable<any> {
    let params = new HttpParams().set('courseid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_course_get_contents&wstoken=${this.token}`,
      { params }
    );
  }
  

  getUserGrades(userId: any, courseId: any): Observable<any> {
    let params = new HttpParams()
      .set('userid', userId)
      .set('courseid', courseId);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=gradereport_user_get_grade_items&wstoken=${this.token}`,
      { params }
    );
  }

  getScormsByCourseId(id: any): Observable<any> {
    let params = new HttpParams().set('courseids[0]', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_scorm_get_scorms_by_courses&wstoken=${this.token}`,
      { params }
    );
  }

  isAttemptFinish(userid: any, quizid: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams({
      task: 'isAttemptFinished',
      // task: 'isAttemptFinished',
      userid: userid,
      quiz: quizid
    }).toString();
    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
  }

  //////////////////////////////////////
  isAttemptFinishInstance(userid: any, quizid: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams({
      task: 'isAttemptFinished',
      // task: 'isAttemptFinished',
      userid: userid,
      quiz: quizid
    }).toString();
    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
  }
//////////////////////////////////////////



  getMaxAttemptData(quizid: any, userid: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // });
    // return this.http.post<any>(AUTH_API + `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_get_user_attempts&wstoken=${this.token}&quizid=${quizid}&=courseid=${courseid}`, { headers });
    let params = new HttpParams()
    .set('quizid', quizid)
    .set('userid', userid);

  return this.http.get(AUTH_API + `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_get_user_attempts&wstoken=${this.token}`,
      { params }
    );
  }

///////////////////////////////////////
  AttemptSummary(): Observable<any> {
    // let params = new HttpParams().set('quizid', id);
    // console.log(params);

    // let params = new HttpParams()
    // .set('quizid', quizid)
    // .set('userid', userid);

    return this.http.get(AUTH_API +
      // `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_start_attemp&wstoken=${this.token}&quizid=12`
       `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_get_user_attempts&wstoken=${this.token}&quizid=12`
    );
  }
////////////////////////////////////////

getQuizDataNew(quizid: any, courseid: any): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });
  const body = new URLSearchParams({
    task: 'quizInfo',
    courseid: courseid,
    quizid: quizid
  }).toString();
  return this.http.post<any>(AUTH_API + `https://gurukul.skfin.in/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_get_user_attempts&wstoken=${this.token}&quizid=${quizid}`, body, { headers });
}




  async getQuizData(quizid: any, courseid: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams({
      task: 'quizInfo',
      courseid: courseid,
      quizid: quizid
    }).toString();
    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers }).toPromise();
    // return this.http.post<any>(AUTH_API + `https://gurukul.skfin.in/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_get_user_attempts&wstoken=${this.token}&quizid=${quizid}&=courseid=${courseid}`, body, { headers });
  }

  getUserToken(userid: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams({
      task: 'getUserToken',
      userid: userid,
    }).toString();
    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
  }

  startQuizById(id: any): Observable<any> {
    let params = new HttpParams().set('quizid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_start_attempt&wstoken=${this.token}`,
      { params }
    );
  }

  // https://gurukul.skfin.in/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_start_attempt&wstoken=4f086bb87670f7d1758c135bfef9ddaf&quizid=12


  getAttemptSummary(id: any): Observable<any> {
    let params = new HttpParams().set('attemptid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_get_attempt_summary&wstoken=${this.token}`,
      { params }
    );
  }

  getNotificationByUserId(id: any): Observable<any> {
    let params = new HttpParams().set('useridto', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=message_popup_get_popup_notifications&wstoken=${this.token}`,
      { params }
    );
  }

  getGradesByUserId(id: any): Observable<any> {
    let params = new HttpParams().set('userid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=gradereport_overview_get_course_grades&wstoken=${this.token}`,
      { params }
    );
  }

  getBadgesByUserId(id: any): Observable<any> {
    let params = new HttpParams().set('userid', id);
    console.log(params);

    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_badges_get_user_badges&wstoken=${this.token}`,
      { params }
    );
  }
  
  getTickerContent(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams({
      task: 'getTickerContent'
    }).toString();
    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
  }

  async fetchHtmlContent(filePath: string) {
    try {
      return this.http.get(filePath, { responseType: 'text' }).toPromise();
    } catch(err:any) {
      throw Error(err)
    }
  }

  async updateFcmToken() {
    try {
          // let body = {
          //   task:"fcmTokenGenrate",
          //   userid: 8835,
          //   fcmToken:"daqshYtXRcOd6YtzfRg7yy:APA91bGiTZIP_HTzz7RX2EEvVgDP0LjtoYPFyoXTt5jyKRd-o-oKfduWMQKzeP3Nw1uvlj0eEtU8h8y97eBr_5OYaGuZLwnskVrjp5p8Zl8fQplZBIk38XfLJOS8lyibjLJVMRcIa6_S"
          // }



      // console.log('getuser',this.tokenService.getUser())
      //     const body = new URLSearchParams({
      //        task:"fcmTokenGenrate",
      //       userid: this.tokenService.getUser()[0].id,
      //       fcmToken:"daqshYtXRcOd6YtzfRg7yy:APA91bGiTZIP_HTzz7RX2EEvVgDP0LjtoYPFyoXTt5jyKRd-o-oKfduWMQKzeP3Nw1uvlj0eEtU8h8y97eBr_5OYaGuZLwnskVrjp5p8Zl8fQplZBIk38XfLJOS8lyibjLJVMRcIa6_S"
      //     }).toString();
      //     const headers = new HttpHeaders({
      //       'Content-Type': 'application/x-www-form-urlencoded'
      //     });
      //     return await this.http.post(AUTH_API + 'webservice/rest/api.php',body,{headers}).toPromise()

      return PushNotifications.addListener('registration', async (token: Token) => {
        console.log('Push registration succes, token: ' + token.value)
        this.fcmToken = token.value
        console.log('getUserDetailsFromLocal',this.getUserDetailsFromLocal())
        if(token.value) {
          const body = new URLSearchParams({
          task:"fcmTokenGenrate",
          userid: this.getUserDetailsFromLocal()[0].id,
          fcmToken:this.fcmToken
          }).toString();
          const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
          });
          await this.http.post(AUTH_API + 'webservice/rest/api.php',body,{headers}).toPromise()
        }
        // alert('Push registration success, token: ' + token.value);
      });
    } catch(err:any) {
      console.log(err)
      throw Error(err)
    }
  }

  getUserDetailsFromLocal() {
    return JSON.parse(localStorage.getItem('auth-user') as string)
  }

  checkFeedbackFormStatus(feedbackId:any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    
    const body = new URLSearchParams({
      task:'QuizefeedbackSubmit',
      userid: this.getUserDetailsFromLocal()[0].id,
      feedbackid:feedbackId,
      feedbackAns:'[]',
      status: 'load'
    }).toString();

    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
  }

  submitFeedback(feedbackId:any,data:any, type: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    
    const body = new URLSearchParams({
      task:'QuizefeedbackSubmit',
      userid: this.getUserDetailsFromLocal()[0].id,
      feedbackid:feedbackId,
      feedbackAns:data,
      status:type 
    }).toString();

    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
  }

  getFeedbackItems(courseId:any,feedbackId:any) {
    return this.http.get(AUTH_API +
      `webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_feedback_get_items&wstoken=${this.token}&courseid=${courseId}&feedbackid=${feedbackId}`
    );
  }

  getImg(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    
    const body = new URLSearchParams({
      task:'QuizefeedbackSubmit',
    }).toString();

    return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers });
  }

}
