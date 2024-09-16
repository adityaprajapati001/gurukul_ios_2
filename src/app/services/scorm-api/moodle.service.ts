import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../token/token.service';
import { environment } from 'src/environments/environment';
import { FcmService } from '../fcm/fcm.service';

const AUTH_API = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class MoodleService {
  // private apiUrl = 'https://gurukul.skfin.in/webservice/rest/server.php'; // Replace with your Moodle site URL
  // private token = '0f146936696e9ed06abff2a53f5e3d8e'; // Replace with your web service token

  token: any;
  fcmToken: any =  ""
  instance: any;

  constructor(private http: HttpClient, private tokenService: TokenService) {
    this.token = this.tokenService.getToken();
    console.log('token', this.token);
  }

  
  // Example: Get SCORM activity details
  getScormActivity(activityId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const params = new URLSearchParams({
      wstoken: this.token,
      wsfunction: 'mod_scorm_get_scorm',
      moodlewsrestformat: 'json',
      scormid: activityId.toString()
    });
    console.log('gfdgfdgd', `${AUTH_API}?${params.toString()}`);
    return this.http.get(`${AUTH_API}?${params.toString()}`,  { headers });

  }



  // Example: Save SCORM data
  saveScormData(activityId: number, data: any): Observable<any> {
    const params = new URLSearchParams({
      wstoken: this.token,
      wsfunction: 'mod_scorm_save_scorm_data', // Replace with appropriate function name
      moodlewsrestformat: 'json'
    });
    const body = {
      scormid: activityId,
      data: data
    };
    return this.http.post(`${AUTH_API}?${params.toString()}`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
