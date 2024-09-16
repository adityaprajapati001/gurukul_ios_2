// scorm-api.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScormApiService {

  private dataStorage: { [key: string]: string } = {};

  constructor() {
    this.initScormApi();
  }

  initScormApi() {
    (window as any).API = {
      LMSInitialize: (param: string) => {
        console.log('LMSInitialize called with param:', param);
        // Initialize SCORM session logic
        return 'true';
      },
      LMSFinish: (param: string) => {
        console.log('LMSFinish called with param:', param);
        // Finish SCORM session logic
        return 'true';
      },
      LMSGetValue: (param: string) => {
        console.log('LMSGetValue called with param:', param);
        // Retrieve value from storage
        return this.dataStorage[param] || '';
      },
      LMSSetValue: (param: string, value: string) => {
        console.log('LMSSetValue called with param:', param, 'and value:', value);
        // Store value in storage
        this.dataStorage[param] = value;
        return 'true';
      },
      LMSCommit: (param: string) => {
        console.log('LMSCommit called with param:', param);
        // Commit logic
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
}
