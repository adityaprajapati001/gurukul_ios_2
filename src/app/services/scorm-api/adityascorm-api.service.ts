import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../token/token.service';
import { environment } from 'src/environments/environment';

const AUTH_API = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ScormApiService {
  private dataStorage: { [key: string]: string } = {};
  private moodleApiUrl = 'https://gurukul.skfin.in/webservice/rest/server.php'; // Replace with your Moodle site URL
  // private token = '0f146936696e9ed06abff2a53f5e3d8e'; // Replace with your web service token

  token: any;
  fcmToken: any =  ""
  instance: any;

  scoid: any;
  error: string;

  // scormid = 157;
  // attempt = 2;

  constructor(private http: HttpClient, private tokenService: TokenService) {
    this.token = this.tokenService.getToken();
    console.log('token', this.token);
    this.initScormApi();

  //     // Fetch SCORM data on component initialization
  // this.getScormUserData(this.scormid, this.attempt).subscribe(
  //   data => {
  //     this.scoid = data.data[1].scoid;
  //     console.log('SCORM Data:', this.scoid);
  //   },
  //   err => {
  //     this.error = 'Failed to fetch SCORM data';
  //     console.error('Error fetching SCORM data:', err);
  //   }
  // );

  }

  initScormApi() {
    (window as any).API = {
      LMSInitialize: (param: string) => {
        console.log('LMSInitialize called with param:', param);
        // Initialize SCORM session logic for SCORM 2004
        console.log('dsfa', param);
        return 'true';
      },
      
      LMSFinish: (param: string) => {
        console.log('LMSFinish called with param:', param);
        this.commitScormData(); // Commit SCORM data to Moodle
        return 'true';
      },
      LMSGetValue: (param: string) => {
        console.log('LMSGetValue called with param:', param);
        return this.dataStorage[param] || '';
      },
      LMSSetValue: (param: string, value: string) => {
        console.log('LMSSetValue called with param:', param, 'and value:', value);
        this.dataStorage[param] = value;
        return 'true';
      },
      LMSCommit: (param: string) => {
        console.log('LMSCommit called with param:', param);
        this.commitScormData(); // Commit SCORM data to Moodle
        return 'true';
      },
      LMSGetLastError: () => {
        return '0';
      },
      LMSGetErrorString: (errorCode: string) => {
        return 'No error';
      },
      LMSGetDiagnostic: (errorCode: string) => {
        return 'No diagnostic information';
      },
    };
  }



  private commitScormData(): void {
    const scormData = this.dataStorage;
    const body = {
      wstoken: this.token,
      wsfunction: '', // Replace with appropriate function name
      moodlewsrestformat: 'json',
      data: scormData
    };

    this.http.post(this.moodleApiUrl, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe(
      response => {
        console.log('SCORM data successfully committed to Moodle:', response);
      },
      error => {
        console.error('Error committing SCORM data to Moodle:', error);
      }
    );
  }



  getPassingScore(): number | null {
    return (window as any).SCORM2004_GetPassingScore();
  }

  setScore(score: number, maxScore: number, minScore: number): boolean {
    return (window as any).SCORM2004_SetScore(score, maxScore, minScore);
  }

  getScore(): string {
    return (window as any).SCORM2004_GetScore();
  }

  getScaledScore(): string {
    return (window as any).SCORM2004_GetScaledScore();
  }



//   const headers = new HttpHeaders({
//     'Content-Type': 'application/x-www-form-urlencoded'
//   });
//   const body = new URLSearchParams({
//     task: 'quizInfo',
//     courseid: courseid,
//     quizid: quizid
//   }).toString();
//   return this.http.post<any>(AUTH_API + 'webservice/rest/api.php', body, { headers }).toPromise();
//   // return this.http.post<any>(AUTH_API + `https://gurukul.skfin.in/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=mod_quiz_get_user_attempts&wstoken=${this.token}&quizid=${quizid}&=courseid=${courseid}`, body, { headers });
// }

                                //insertScormTracks//
///////////////////////////////////////////////////////////////////////////////////////

        // insertScormTracks(scoid: number, attempt: number, tracks: any[]): Observable<any> {

        //   const headers = new HttpHeaders({
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //   });

        //   let params = new HttpParams()
        //     .set('wstoken', this.token)
        //     .set('wsfunction', 'mod_scorm_insert_scorm_tracks')
        //     .set('moodlewsrestformat', 'json');

        //   let body = {
        //     scoid: scoid,
        //     attempt: attempt,
        //     tracks: tracks
        //   };

        //   return this.http.post(this.moodleApiUrl, body, { headers, params });
        // }




        // insertScormTracks(scoid: number, attempt: number, tracks: any[]): Observable<any> {
        //   const headers = new HttpHeaders({
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //   });
        
        //   let params = new HttpParams()
        //     .set('wstoken', this.token)
        //     .set('wsfunction', 'mod_scorm_insert_scorm_tracks')
        //     .set('moodlewsrestformat', 'json');
        
        //   // Convert tracks array to x-www-form-urlencoded format
        //   let body = new URLSearchParams();
        //   body.set('scoid', scoid.toString());
        //   body.set('attempt', attempt.toString());
        //   tracks.forEach((track, index) => {
        //     body.set(`tracks[${index}][element]`, track.element);
        //     body.set(`tracks[${index}][value]`, track.value);
        //   });
        
        //   return this.http.post(this.moodleApiUrl, body.toString(), { headers, params });
        // }


        insertScormTracks(tracks: any[]): Observable<any> {
          const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
          });
      
          let params = new HttpParams()
            .set('wstoken', this.token)
            .set('wsfunction', 'mod_scorm_insert_scorm_tracks')
            .set('moodlewsrestformat', 'json');
      
          // Convert tracks array to x-www-form-urlencoded format
          let body = new URLSearchParams();
          body.set('scoid', this.scoid);  // Set the specific scoid
          body.set('attempt', '6');  // Set the specific attempt number
          tracks.forEach((track, index) => {
            body.set(`tracks[${index}][element]`, track.element);
            body.set(`tracks[${index}][value]`, track.value);
          });
      
          return this.http.post(this.moodleApiUrl, body.toString(), { headers, params });
        }



        insertScormTracks2(tracks: any[], scormid: string, attempt: number): Observable<any> {
          const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
          });
        
          let params = new HttpParams()
            .set('wstoken', this.token)
            .set('wsfunction', 'mod_scorm_insert_scorm_tracks')
            .set('moodlewsrestformat', 'json');
        
          // Convert tracks array to x-www-form-urlencoded format
          let body = new URLSearchParams();
          body.set('scoid', scormid);  // Set the dynamic scoid
          body.set('attempt', attempt.toString());  // Set the dynamic attempt number
          tracks.forEach((track, index) => {
            body.set(`tracks[${index}][element]`, track.element);
            body.set(`tracks[${index}][value]`, track.value);
          });
        
          return this.http.post(this.moodleApiUrl, body.toString(), { headers, params });
        }
        




  // Method to get SCORM user data
  getScormUserData(scormId: number, attempt: number): Observable<any> {
    const params = {
      wstoken: this.token,
      wsfunction: 'mod_scorm_get_scorm_user_data',
      moodlewsrestformat: 'json',
      scormid: scormId.toString(),
      attempt: attempt.toString()
    };

    return this.http.get<any>(this.moodleApiUrl, { params });
  }



  getAttemptCount(scormid: number, userid: number): Observable<any> {
    const url = `${this.moodleApiUrl}?wstoken=${this.token}&wsfunction=mod_scorm_get_scorm_attempt_count&moodlewsrestformat=json&scormid=${scormid}&userid=${userid}`;
    return this.http.get<any>(url);
  }


  getScormsByCourseId(id: any): Observable<any> {
    const url = `${this.moodleApiUrl}?wstoken=${this.token}&wsfunction=mod_scorm_get_scorms_by_courses&moodlewsrestformat=json`;
    return this.http.get<any>(url);
  }

  
}
