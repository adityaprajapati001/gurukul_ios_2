import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as JSZip from 'jszip';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

  
  export class ScormService {
    private scormContent = new BehaviorSubject<string | null>(null);
    
    constructor(private http: HttpClient) {}
  
    get scormContent$() {
      return this.scormContent.asObservable();
    }

    async loadScorm(scormUrl: string): Promise<void> {
      try {
        const response = await this.http.get(scormUrl, { responseType: 'blob' }).toPromise();
  
        // Check if response is undefined or not a Blob
        if (!response || !(response instanceof Blob)) {
          throw new Error('Response is not a valid Blob');
        }
  
        // Convert Blob to ArrayBuffer
        const arrayBuffer = await this.blobToArrayBuffer(response);
  
        // Load the ArrayBuffer with JSZip
        const zip = await JSZip.loadAsync(arrayBuffer);
  
        // Extract launcher.html file (changed from index.html to launcher.html)
        const indexFile = zip.file('launcher.html');
        if (indexFile) {
          const content = await indexFile.async('string');
          this.scormContent.next(content); // Set the extracted content
        } else {
          throw new Error('launcher.html not found in SCORM package');
        }
      } catch (error) {
        console.error('Error loading SCORM content:', error);
        this.scormContent.next(null); // Ensure to update even in case of error
      }
    }
  
    private blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
      });
    }
  }
  