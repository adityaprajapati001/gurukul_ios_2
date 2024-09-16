import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'jspdf',
  templateUrl: './jspdf.component.html',
  // styleUrls: ['jspdf.component.scss'],
})
export class jspdf implements OnInit {
  pdfUrl: SafeResourceUrl | undefined;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.captureScreen();
  }

  public captureScreen() {
    // Alternative CORS proxy
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const url =
      'https://www.w3.org/Style/CSS/Test/CSS3/Selectors/current/html/static/index.html';
    const proxiedUrl = corsProxy + encodeURIComponent(url);

    // Fetch the HTML content
    this.http.get(proxiedUrl, { responseType: 'text' }).subscribe(
      (html) => {
        // Create a new div and set its innerHTML to the fetched HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        document.body.appendChild(tempDiv);

        // Use html2canvas on the newly created div
        html2canvas(tempDiv, { useCORS: true })
          .then((canvas) => {
            // Set PDF dimensions
            const imgWidth = 208;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Convert canvas to data URL
            const contentDataURL = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
            const position = 0;
            pdf.addImage(
              contentDataURL,
              'PNG',
              0,
              position,
              imgWidth,
              imgHeight
            );

            // Convert PDF to Blob URL
            const pdfBlob = pdf.output('blob');
            this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              URL.createObjectURL(pdfBlob)
            );

            // Clean up by removing the temporary div
            document.body.removeChild(tempDiv);
          })
          .catch((error) => {
            console.error('Error generating PDF:', error);
            document.body.removeChild(tempDiv);
          });
      },
      (error) => {
        console.error('Error fetching HTML:', error);
      }
    );
  }
}
