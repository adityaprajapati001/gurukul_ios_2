// src/app/services/zip.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import * as JSZip from 'jszip';
import { Filesystem, Directory, FileInfo } from '@capacitor/filesystem';
import { LoadingController, ModalController } from '@ionic/angular';
import { IframeModalPage } from 'src/app/modal-controller/iframe-modal/iframe-modal.page';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZipService {
  private progressSubject = new BehaviorSubject<number>(0); // Observable to track progress

  constructor(
    private http: HttpClient, 
    private modalController: ModalController,
    private loadingCtrl: LoadingController
  ) { }

  get progress$() {
    return this.progressSubject.asObservable(); // Expose progress as observable
  }

  async downloadAndUnzip(url: string): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Downloading Content...',
    });
    await loading.present();

    try {
      let totalBytes = 0;
      let loadedBytes = 0;

      this.http.get(url, {
        responseType: 'arraybuffer',
        observe: 'events',
        reportProgress: true
      }).subscribe({
        next: async (event: HttpEvent<ArrayBuffer>) => {
          switch (event.type) {
            case HttpEventType.ResponseHeader:
              const contentLength = event.headers.get('Content-Length');
              totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
              break;

            case HttpEventType.DownloadProgress:
              if (event.loaded) {
                loadedBytes = event.loaded;
                this.progressSubject.next(totalBytes > 0 ? loadedBytes / totalBytes : 0);
              }
              break;

            case HttpEventType.Response:
              const zipFile: ArrayBuffer = event.body as ArrayBuffer;
              const zip = await JSZip.loadAsync(zipFile);
              const files = Object.keys(zip.files);
              const totalFiles = files.length;
              let filesProcessed = 0;

              for (const filePath of files) {
                const file = zip.files[filePath];
                const fileData = await file.async('uint8array');
                let modifiedContent: Uint8Array;
                

                if (filePath === 'lms/scormdriver.js') {
                  const scormdriverContent = await file.async('string');
                  const scormModifiedContent = scormdriverContent.replace(/var blnStandAlone = false;/g, 'var blnStandAlone = true;');
                  modifiedContent = new TextEncoder().encode(scormModifiedContent);
                  console.log('fsafadsf', scormModifiedContent);

                 } else if (filePath === 'lms/API.js') {
                    const APIContent = await file.async('string');
                    const APIModifiedContent = APIContent.replace(/var blnStandAlone = false;/g, 'var blnStandAlone = true;');
                    modifiedContent = new TextEncoder().encode(APIModifiedContent);
                    console.log('API', APIModifiedContent);

                                      
				}	else if (filePath === 'launcher.html') {
						// Decode file data to a string
						const launcherContent = new TextDecoder().decode(fileData);
						
						// Define the replacement script contents
						const scriptAReplacement = `
						<script>
						/******************************************************************************/
						//
						// NOTE TO DEVELOPERS:
						// The following code should be integrated with your web page in order to open
						// the presentation in a new window.  To launch the presentation immediately, 
						// simply copy the code below into your web page.  To launch the presentation
						// when a button or link is clicked, call LaunchPresentation when the onClick
						// event is triggered.
						//
						/******************************************************************************/
						
						var Safari =  (navigator.appVersion.indexOf("Safari") >= 0);
						
						var g_bChromeless = false;
						var g_bResizeable = true;
						var g_nContentWidth = 980;
						var g_nContentHeight = 611;
						var g_strStartPage = "index_lms.html" + document.location.search;
						var g_strBrowserSize = "fullscreen";
						
						function LaunchContent()
						{
							var nWidth = screen.availWidth;
							var nHeight = screen.availHeight;
					
							if (nWidth > g_nContentWidth && nHeight > g_nContentHeight && g_strBrowserSize != "fullscreen")
							{
								nWidth = g_nContentWidth;
								nHeight = g_nContentHeight;
								
								if (!Safari && !g_bChromeless)
								{
									nWidth += 17;
								}
							}
					
							// Build the options string
							var strOptions = "width=" + nWidth +",height=" + nHeight;
							if (g_bResizeable)
							{
								strOptions += ",resizable=yes"
							}
							else
							{
								strOptions += ",resizable=no"
							}
					
							if (g_bChromeless)
							{
								strOptions += ", status=0, toolbar=0, location=0, menubar=0, scrollbars=0";
							}
							else
							{
								strOptions += ", status=1, toolbar=1, location=1, menubar=1, scrollbars=1";
							}
					
							// Launch the URL
							if (Safari)
							{
								var oWnd = window.open("", "_blank", strOptions);
								oWnd.location = g_strStartPage;
							}
							else
							{
								window.open(g_strStartPage , "_blank", strOptions);
							}
						}
						</script>`;
					
						const scriptBReplacement = `
						<script>
						/******************************************************************************/
						//
						// NOTE TO DEVELOPERS:
						// The following code should be integrated with your web page in order to open
						// the presentation in a new window.  To launch the presentation immediately, 
						// simply copy the code below into your web page.  To launch the presentation
						// when a button or link is clicked, call LaunchPresentation when the onClick
						// event is triggered.
						//
						/******************************************************************************/
						
						var Safari =  (navigator.appVersion.indexOf("Safari") >= 0);
						
						var g_bChromeless = false;
						var g_bResizeable = true;
						var g_nContentWidth = 740;
						var g_nContentHeight = 476;
						var g_strStartPage = "index_lms.html" + document.location.search;
						var g_strBrowserSize = "fullscreen";
						
						function LaunchContent()
						{
							var nWidth = screen.availWidth;
							var nHeight = screen.availHeight;
					
							if (nWidth > g_nContentWidth && nHeight > g_nContentHeight && g_strBrowserSize != "fullscreen")
							{
								nWidth = g_nContentWidth;
								nHeight = g_nContentHeight;
								
								if (!Safari && !g_bChromeless)
								{
									nWidth += 17;
								}
							}
					
							// Build the options string
							var strOptions = "width=" + nWidth +",height=" + nHeight;
							if (g_bResizeable)
							{
								strOptions += ",resizable=yes"
							}
							else
							{
								strOptions += ",resizable=no"
							}
					
							if (g_bChromeless)
							{
								strOptions += ", status=0, toolbar=0, location=0, menubar=0, scrollbars=0";
							}
							else
							{
								strOptions += ", status=1, toolbar=1, location=1, menubar=1, scrollbars=1";
							}
					
							// Launch the URL
							if (Safari)
							{
								// var oWnd = window.open("", "_blank", strOptions);
								oWnd.location = g_strStartPage;
								window.location.href = g_strStartPage;
							}
							else
							{
								// window.open(g_strStartPage , "_blank", strOptions);
								window.location.href = g_strStartPage;
							}
						}
						</script>`;

						const scriptDReplacement = `
						<script>
			
			/******************************************************************************/
			//
			// NOTE TO DEVELOPERS:
			// The following code should be integrated with your web page in order to open
			// the presentation in a new window.  To launch the presentation immediately, 
			// simply copy the code below into your web page.  To launch the presentation
			// when a button or link is clicked, call LaunchPresentation when the onClick
			// event is triggered.
			//
			/******************************************************************************/		
		
		
			var Safari =  (navigator.appVersion.indexOf("Safari") >= 0);
			
			var g_bChromeless = false;
			var g_bResizeable = false;
			var g_nContentWidth = 980;
			var g_nContentHeight = 634;
			var g_strStartPage = "index_lms.html" + document.location.search;
			var g_strBrowserSize = "fullscreen";
		
			function LaunchContent()
			{
				var nWidth = screen.availWidth;
				var nHeight = screen.availHeight;

				if (nWidth > g_nContentWidth && nHeight > g_nContentHeight && g_strBrowserSize != "fullscreen")
				{
					nWidth = g_nContentWidth;
					nHeight = g_nContentHeight;
					
					if (!Safari && !g_bChromeless)
					{
						nWidth += 17;
					}
				}

				// Build the options string
				var strOptions = "width=" + nWidth +",height=" + nHeight;
				if (g_bResizeable)
				{
					strOptions += ",resizable=yes"
				}
				else
				{
					strOptions += ",resizable=no"
				}

				if (g_bChromeless)
				{
					strOptions += ", status=0, toolbar=0, location=0, menubar=0, scrollbars=0";
				}
				else
				{
					strOptions += ", status=1, toolbar=1, location=1, menubar=1, scrollbars=1";
				}

				// Launch the URL
				if (Safari)
				{
					var oWnd = window.open("", "_blank", strOptions);
					oWnd.location = g_strStartPage;
				}
				else
				{
					window.open(g_strStartPage , "_blank", strOptions);
				}
			}

			
			
		</script>`;
					
						const scriptCReplacement = `
						<script>
						/******************************************************************************/
						//
						// NOTE TO DEVELOPERS:
						// The following code should be integrated with your web page in order to open
						// the presentation in a new window.  To launch the presentation immediately, 
						// simply copy the code below into your web page.  To launch the presentation
						// when a button or link is clicked, call LaunchPresentation when the onClick
						// event is triggered.
						//
						/******************************************************************************/
						
						var Safari =  (navigator.appVersion.indexOf("Safari") >= 0);
						
						var g_bChromeless = false;
						var g_bResizeable = true;
						var g_nContentWidth = 980;
						var g_nContentHeight = 611;
						var g_strStartPage = "index_lms.html" + document.location.search;
						var g_strBrowserSize = "fullscreen";
						
						function LaunchContent() {
							// Redirect the current window to the target URL
							window.location.href = g_strStartPage;
						}
						</script>`;
					
						// Create regex patterns for matching the exact script content
						const scriptAPattern = /<script>\s*\/\*\*[\s\S]*?NOTE TO DEVELOPERS:[\s\S]*?function\s+LaunchContent[\s\S]*?<\/script>/i;   //phishing
						const scriptBPattern = /<script>\s*\/\*\*[\s\S]*?NOTE TO DEVELOPERS:[\s\S]*?function\s+LaunchContent[\s\S]*?<\/script>/i;   //introduction
						const scriptDPattern = /<script>\s*\/\*\*[\s\S]*?NOTE TO DEVELOPERS:[\s\S]*?function\s+LaunchContent[\s\S]*?<\/script>/i;   //introduction
					
						// Debugging: Print matched scripts
						console.log('Script A match:', launcherContent.match(scriptAPattern));
						console.log('Script B match:', launcherContent.match(scriptBPattern));
						console.log('Script D match:', launcherContent.match(scriptDPattern));
					
						// Replace the script content with scriptCReplacement
						const launcherModifiedContent = launcherContent
							.replace(scriptAPattern, scriptCReplacement)
							.replace(scriptBPattern, scriptCReplacement)
							.replace(scriptDPattern, scriptCReplacement);
					

						modifiedContent = new TextEncoder().encode(launcherModifiedContent);
						console.log('Modified launcher.html content:', launcherModifiedContent);

					
						
						

					
						
					
                

    // // } else if (filePath === 'launcher.html') {
    // const launcherContent = new TextDecoder().decode(fileData);

    // // First replacement: Update Safari and non-Safari window opening logic
    // let launcherModifiedContent = launcherContent.replace(
    //     `		<script>
			
		// 	/******************************************************************************/
		// 	//
		// 	// NOTE TO DEVELOPERS:
		// 	// The following code should be integrated with your web page in order to open
		// 	// the presentation in a new window.  To launch the presentation immediately, 
		// 	// simply copy the code below into your web page.  To launch the presentation
		// 	// when a button or link is clicked, call LaunchPresentation when the onClick
		// 	// event is triggered.
		// 	//
		// 	/******************************************************************************/		
		
		
		// 	var Safari =  (navigator.appVersion.indexOf("Safari") >= 0);
			
		// 	var g_bChromeless = false;
		// 	var g_bResizeable = true;
		// 	var g_nContentWidth = 980;
		// 	var g_nContentHeight = 611;
		// 	var g_strStartPage = "index_lms.html" + document.location.search;
		// 	var g_strBrowserSize = "fullscreen";
		
		// 	function LaunchContent()
		// 	{
		// 		var nWidth = screen.availWidth;
		// 		var nHeight = screen.availHeight;

		// 		if (nWidth > g_nContentWidth && nHeight > g_nContentHeight && g_strBrowserSize != "fullscreen")
		// 		{
		// 			nWidth = g_nContentWidth;
		// 			nHeight = g_nContentHeight;
					
		// 			if (!Safari && !g_bChromeless)
		// 			{
		// 				nWidth += 17;
		// 			}
		// 		}

		// 		// Build the options string
		// 		var strOptions = "width=" + nWidth +",height=" + nHeight;
		// 		if (g_bResizeable)
		// 		{
		// 			strOptions += ",resizable=yes"
		// 		}
		// 		else
		// 		{
		// 			strOptions += ",resizable=no"
		// 		}

		// 		if (g_bChromeless)
		// 		{
		// 			strOptions += ", status=0, toolbar=0, location=0, menubar=0, scrollbars=0";
		// 		}
		// 		else
		// 		{
		// 			strOptions += ", status=1, toolbar=1, location=1, menubar=1, scrollbars=1";
		// 		}

		// 		// Launch the URL
		// 		if (Safari)
		// 		{
		// 			var oWnd = window.open("", "_blank", strOptions);
		// 			oWnd.location = g_strStartPage;
		// 		}
		// 		else
		// 		{
		// 			window.open(g_strStartPage , "_blank", strOptions);
		// 		}
		// 	}

			
			
		// </script>`,
    //     `		<script>
			
		// 	/******************************************************************************/
		// 	//
		// 	// NOTE TO DEVELOPERS:
		// 	// The following code should be integrated with your web page in order to open
		// 	// the presentation in a new window.  To launch the presentation immediately, 
		// 	// simply copy the code below into your web page.  To launch the presentation
		// 	// when a button or link is clicked, call LaunchPresentation when the onClick
		// 	// event is triggered.
		// 	//
		// 	/******************************************************************************/		
		
		
		// 	var Safari =  (navigator.appVersion.indexOf("Safari") >= 0);
			
		// 	var g_bChromeless = false;
		// 	var g_bResizeable = true;
		// 	var g_nContentWidth = 980;
		// 	var g_nContentHeight = 611;
		// 	var g_strStartPage = "index_lms.html" + document.location.search;
		// 	var g_strBrowserSize = "fullscreen";
			
		
		// 	function LaunchContent() {
    //         // Redirect the current window to the target URL
    //         window.location.href = g_strStartPage;
    //     }
			
			
		// </script>`
    // );

    // // Second replacement: Update new script pattern
    // launcherModifiedContent = launcherModifiedContent.replace(
    //     `		<script>
			
		// 	/******************************************************************************/
		// 	//
		// 	// NOTE TO DEVELOPERS:
		// 	// The following code should be integrated with your web page in order to open
		// 	// the presentation in a new window.  To launch the presentation immediately, 
		// 	// simply copy the code below into your web page.  To launch the presentation
		// 	// when a button or link is clicked, call LaunchPresentation when the onClick
		// 	// event is triggered.
		// 	//
		// 	/******************************************************************************/		
		
		
		// 	var Safari =  (navigator.appVersion.indexOf("Safari") >= 0);
			
		// 	var g_bChromeless = false;
		// 	var g_bResizeable = true;
		// 	var g_nContentWidth = 740;
		// 	var g_nContentHeight = 476;
		// 	var g_strStartPage = "index_lms.html" + document.location.search;
		// 	var g_strBrowserSize = "fullscreen";
		
		// 	function LaunchContent()
		// 	{
		// 		var nWidth = screen.availWidth;
		// 		var nHeight = screen.availHeight;

		// 		if (nWidth > g_nContentWidth && nHeight > g_nContentHeight && g_strBrowserSize != "fullscreen")
		// 		{
		// 			nWidth = g_nContentWidth;
		// 			nHeight = g_nContentHeight;
					
		// 			if (!Safari && !g_bChromeless)
		// 			{
		// 				nWidth += 17;
		// 			}
		// 		}

		// 		// Build the options string
		// 		var strOptions = "width=" + nWidth +",height=" + nHeight;
		// 		if (g_bResizeable)
		// 		{
		// 			strOptions += ",resizable=yes"
		// 		}
		// 		else
		// 		{
		// 			strOptions += ",resizable=no"
		// 		}

		// 		if (g_bChromeless)
		// 		{
		// 			strOptions += ", status=0, toolbar=0, location=0, menubar=0, scrollbars=0";
		// 		}
		// 		else
		// 		{
		// 			strOptions += ", status=1, toolbar=1, location=1, menubar=1, scrollbars=1";
		// 		}

		// 		// Launch the URL
		// 		if (Safari)
		// 		{
		// 			// var oWnd = window.open("", "_blank", strOptions);
		// 			oWnd.location = g_strStartPage;
		// 			window.location.href = g_strStartPage;
		// 		}
		// 		else
		// 		{
		// 			// window.open(g_strStartPage , "_blank", strOptions);
		// 			window.location.href = g_strStartPage;
		// 		}
		// 	}

			
			
		// </script>`,
    //     `		<script>
			
		// 	/******************************************************************************/
		// 	//
		// 	// NOTE TO DEVELOPERS:
		// 	// The following code should be integrated with your web page in order to open
		// 	// the presentation in a new window.  To launch the presentation immediately, 
		// 	// simply copy the code below into your web page.  To launch the presentation
		// 	// when a button or link is clicked, call LaunchPresentation when the onClick
		// 	// event is triggered.
		// 	//
		// 	/******************************************************************************/		
		
		
		// 	var Safari =  (navigator.appVersion.indexOf("Safari") >= 0);
			
		// 	var g_bChromeless = false;
		// 	var g_bResizeable = true;
		// 	var g_nContentWidth = 740;
		// 	var g_nContentHeight = 476;
		// 	var g_strStartPage = "index_lms.html" + document.location.search;
		// 	var g_strBrowserSize = "fullscreen";
			
		
		// 	function LaunchContent() {
    //         // Redirect the current window to the target URL
    //         window.location.href = g_strStartPage;
    //     }
			
			
		// </script>`
    // );

    // Encode and log the modified content
    // modifiedContent = new TextEncoder().encode(launcherModifiedContent);
    // console.log('Modified launcher.html content:', launcherModifiedContent);


                
  
  } else if (filePath === 'html5/lib/scripts/bootstrapper.min.js') {
                  const bootstrapperContent = await file.async('string');
                  let bootstrapperModifiedContent = bootstrapperContent.replace(
                    `updateScore:function(t){if((!h.hasFlag(h.constants.MULTIPLE_QUIZ_TRACKING)||!i)&&(null==t&&(t=this.scorings.guessCurrentScoring()),null!=t&&t.isType("quiz"))){var n=t.prop("PercentScore");this.lastScore!==n&&(e=t,this.lastScore=n,this.api.SetScore(n,100,0))}}`,
                    `updateScore: function(t) {
                      if ((!h.hasFlag(h.constants.MULTIPLE_QUIZ_TRACKING) || !i) && 
                        (null == t && (t = this.scorings.guessCurrentScoring()),
                        null != t && t.isType("quiz"))) {
                        var n = t.prop("PercentScore");
                        this.lastScore !== n && (e = t, this.lastScore = n, this.api.SetScore(n, 100, 0));

                        var decodedValue2 = this.lastScore;
                        var decodedValue3 = this.api.SetScore;

                        console.log('this.api.SetScore(n, 100, 0)', this.api.SetScore(n, 100, 0));
                        console.log('this.api.SetScore(n)', this.api.SetScore(n));
                        console.log('this.api.SetScore(100)', this.api.SetScore(100));
                        console.log('this.api.SetScore(0)', this.api.SetScore(0));
                        console.log(' this.lastScore', this.lastScore);
                        console.log('decodedHtml2', decodedValue2);
                        console.log('decodedHtml3', decodedValue3);
                        
                        window.parent.postMessage({ type: 'decodedHtml2', value: decodedValue2 }, '*');    
                        return decodedValue2;}}`
                  );

                  // Further modification for updateStatus function
                  bootstrapperModifiedContent = bootstrapperModifiedContent.replace(
                    `updateStatus:function(){var t=this.scorings.getStatus(),e=p[t]||r.noop;return this.lastStatus&&this.lastStatus===t||(this.lastStatus=t,e(this)),this}`,
                    `updateStatus: function() {
                        var t = this.scorings.getStatus()
                          , e = p[t] || r.noop;
                        console.log('this.lastStatus', this.lastStatus);
                        console.log('t', t);
                        return this.lastStatus && this.lastStatus === t || (this.lastStatus = t,
                        e(this)),
                        this
                        
                    },

                    updateStatus: function() {
                        var t = this.scorings.getStatus();
                        var e = p[t] || r.noop;
                    
                        window.parent.postMessage({ type: 't', value: t }, '*');
                    

                        if (this.lastStatus === t) {
                            return t;
                        }
                  
                        this.lastStatus = t;
                        e(this);
                    

                        return t;
                    }`
                  );
                  // Further modification for updateStatus function
                  bootstrapperModifiedContent = bootstrapperModifiedContent.replace(
                    `forceCommit:function(){return this.resumer.savePresentationData(),this.sendData().commit(),this}`,
                    `forceCommit: function() {
                        console.log('this.resumer', this.resumer);
                        console.log('this.resumer.savePresentationData', this.resumer.savePresentationData);
                        return this.resumer.savePresentationData(),
                        this.sendData().commit(),
                        this

                    },

                    forceCommit: function() {    
                        console.log('this.resumer', this.resumer);  
                        console.log('this.resumer', this.resumer.courseStartTime);           
                        var decoded4Value = this.resumer.courseStartTime;
                        console.log('decodedHtml4', decoded4Value); 
                        
                        window.parent.postMessage({ type: 'decodedHtml4', value: decoded4Value }, '*');
                        
                        return decoded4Value;
                    }`
                  );

                  modifiedContent = new TextEncoder().encode(bootstrapperModifiedContent);
                  console.log('Modified bootstrapper.min.js content:', bootstrapperModifiedContent);
                } else {
                  modifiedContent = fileData;
                }
               

                await this.saveFile(`gurukul/unzip_files/${filePath}`, modifiedContent);

                filesProcessed++;
                this.progressSubject.next((filesProcessed + 1) / totalFiles); // Update progress
              }

              const directoryContents = await this.readDirectory('gurukul/unzip_files');  
              const storyHtmlUri = directoryContents.find(filename => filename === 'launcher.html');

              if (storyHtmlUri) {
                const iframeUrl = `gurukul/unzip_files/${storyHtmlUri}`;
				console.log('iframeUrl',iframeUrl);
                this.progressSubject.next(1); // Complete progress
                loading.dismiss();
                this.openIframeModal(iframeUrl);
              } else {
                console.error('launcher.html file not found in the directory');
                this.progressSubject.next(1); // Complete progress
                loading.dismiss();
              }
              break;
          }
        },
        error: async (error) => {
          console.error('Error downloading and unzipping file:', error);
          this.progressSubject.next(0); // Reset progress on error
          loading.dismiss();
        }
      });
    } catch (error) {
      console.error('Error downloading and unzipping file:', error);
      this.progressSubject.next(0); // Reset progress on error
      loading.dismiss();
    }
  }
  
  // // src/app/services/zip.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
// import * as JSZip from 'jszip';
// import { Filesystem, Directory, FileInfo } from '@capacitor/filesystem';
// import { LoadingController, ModalController } from '@ionic/angular';
// import { IframeModalPage } from 'src/app/modal-controller/iframe-modal/iframe-modal.page';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ZipService {
//   private progressSubject = new BehaviorSubject<number>(0); // Observable to track progress

//   constructor(
//     private http: HttpClient, 
//     private modalController: ModalController,
//     private loadingCtrl: LoadingController
//   ) { }

//   get progress$() {
//     return this.progressSubject.asObservable(); // Expose progress as observable
//   }

//   async downloadAndUnzip(url: string): Promise<void> {
//     const loading = await this.loadingCtrl.create({
//       message: 'Downloading Content...',
//     });
//     await loading.present();

//     try {
//       let totalBytes = 0;
//       let loadedBytes = 0;

//       this.http.get(url, {
//         responseType: 'arraybuffer',
//         observe: 'events',
//         reportProgress: true
//       }).subscribe({
//         next: async (event: HttpEvent<ArrayBuffer>) => {
//           switch (event.type) {
//             case HttpEventType.ResponseHeader:
//               const contentLength = event.headers.get('Content-Length');
//               totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
//               break;
//             case HttpEventType.DownloadProgress:
//               if (event.loaded) {
//                 loadedBytes = event.loaded;
//                 this.progressSubject.next(totalBytes > 0 ? loadedBytes / totalBytes : 0);
//               }
//               break;
//             case HttpEventType.Response:
//               const zipFile: ArrayBuffer = event.body as ArrayBuffer;
//               const zip = await JSZip.loadAsync(zipFile);
//               const files = Object.keys(zip.files);
//               const totalFiles = files.length;
//               let filesProcessed = 0;

//               for (const filePath of files) {
//                 const file = zip.files[filePath];
//                 const fileData = await file.async('uint8array');
//                 await this.saveFile(`gurukul/unzip_files/${filePath}`, fileData);

//                 if (filePath === 'lms/scormdriver.js') {
//                   const scormdriverContent = await file.async('string');
//                   const modifiedContent = scormdriverContent.replace(/var blnStandAlone = false;/g, 'var blnStandAlone = true;');
//                   const encoder = new TextEncoder();
//                   const modifiedContentArray = encoder.encode(modifiedContent);
//                   await this.saveFile(`gurukul/unzip_files/${filePath}`, modifiedContentArray);
//                 }

//                 filesProcessed++;
//                 this.progressSubject.next((filesProcessed + 1) / totalFiles); // Update progress
//               }

//               const directoryContents = await this.readDirectory('gurukul/unzip_files');  
//               const storyHtmlUri = directoryContents.find(filename => filename === 'launcher.html');

//               if (storyHtmlUri) {
//                 const iframeUrl = `gurukul/unzip_files/${storyHtmlUri}`;
//                 this.progressSubject.next(1); // Complete progress
//                 loading.dismiss();
//                 this.openIframeModal(iframeUrl);
//               } else {
//                 console.error('launcher.html file not found in the directory');
//                 this.progressSubject.next(1); // Complete progress
//                 loading.dismiss();
//               }

//               break;
//           }
//         },
//         error: async (error) => {
//           console.error('Error downloading and unzipping file:', error);
//           this.progressSubject.next(0); // Reset progress on error
//           loading.dismiss();
//         }
//       });
//     } catch (error) {
//       console.error('Error downloading and unzipping file:', error);
//       this.progressSubject.next(0); // Reset progress on error
//       loading.dismiss();
//     }
//   }

  async ensureDirectoryExists(directoryPath: string): Promise<void> {
    try {
      const directoryExists = await this.checkDirectoryExists(directoryPath);
      if (!directoryExists) {
        await Filesystem.mkdir({
          path: directoryPath,
          directory: Directory.External,
          recursive: true
        });
      }
    } catch (error) {
      console.error('Error creating directory:', error);
    }
  }

  async checkDirectoryExists(directoryPath: string): Promise<boolean> {
    try {
      const result = await Filesystem.stat({
        path: directoryPath,
        directory: Directory.External
      });
      return result.type === 'directory';
    } catch (error) {
      return false;
    }
  }

  async saveFile(filePath: string, fileData: Uint8Array): Promise<void> {
    try {
      const blob = new Blob([fileData]);
      const blobToBase64:any = await this.blobToBase64(blob)
      await Filesystem.writeFile({
        path: filePath,
        data: blobToBase64,
        directory: Directory.External,
        recursive: true
      });
    } catch (error) {
      console.error('Error saving file:', error);
    }
  }

  async readDirectory(directoryPath: string): Promise<string[]> {
    try {
      const result = await Filesystem.readdir({
        path: directoryPath,
        directory: Directory.External
      });
      return result.files.map((fileInfo: FileInfo) => fileInfo.name);
    } catch (error) {
      console.error('Error reading directory:', error);
      return [];
    }
  }

  async openIframeModal(iframeSrc: string) {
    const modal = await this.modalController.create({
      component: IframeModalPage,
      componentProps: {
        iframeSrc: iframeSrc,
      }
    });
    return await modal.present();
  }

  async clearDirectory(directoryPath: string): Promise<void> {
    try {
      await Filesystem.rmdir({
        path: directoryPath,
        directory: Directory.External,
        recursive: true
      });
      console.log('Directory cleared successfully:', directoryPath);
    } catch (error) {
      console.error('Error clearing directory:', error);
    }
  }

  blobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader:any = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error:any) => {
        reject(error);
      };
    });
  }
}



// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import * as JSZip from 'jszip';
// import { Filesystem, Directory, Encoding, FileInfo } from '@capacitor/filesystem';
// import { LoadingController, ModalController } from '@ionic/angular';
// import { IframeModalPage } from 'src/app/modal-controller/iframe-modal/iframe-modal.page';

// @Injectable({
//   providedIn: 'root'
// })
// export class ZipService {

//   constructor(
//     private http: HttpClient, 
//     private modalController: ModalController,
//     private loadingCtrl: LoadingController
//   ) { }

//   async downloadAndUnzip(url: string): Promise<void> {
//     const loading = await this.loadingCtrl.create({
//       // message: 'Please Wait...',
//       message: 'Downloading Content...',
//     });
//     loading.present();
//     try {
//       // Clear existing directory
//       // await this.clearDirectory('unzipped_assets');
     
// console.log("URL:",url)
//       const zipFileResponse = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
//       console.log("zipFileResponse:",zipFileResponse)
//       // Check if the response is undefined
//       if (!zipFileResponse) {
//         console.error('Empty response received from the server');
//         loading.dismiss();
//         return;
//       }

//       const zipFile: ArrayBuffer = zipFileResponse;
//       const zip = await JSZip.loadAsync(zipFile);
      
//       console.log("zipFile:",zipFile)
//       console.log("zip:",zip)
//       // Iterate through each file in the zip
//       for (const filePath of Object.keys(zip.files)) {
//         const file = zip.files[filePath];

//         // Ensure parent directory exists
//         // const parentDirectory = `gurukul/${filePath.substring(0, filePath.lastIndexOf('/'))}`;
//         // await this.ensureDirectoryExists(parentDirectory);
//         console.log("file:",file)
//         // Save the file
//         const fileData = await file.async('uint8array');
//         console.log("fileData:",fileData)
//         await this.saveFile(`gurukul/unzip_files/${filePath}`, fileData);



//         ///////////////////////////////////////////////////////////////////////////

//          // Check if the file is scormdriver.js
//          if (filePath === 'lms/scormdriver.js') {
//         // Read file content as string
//         const scormdriverContent = await file.async('string');
//         console.log('Original scormdriver.js content:');

//         // Replace the specific text
//         const modifiedContent = scormdriverContent.replace(/var blnStandAlone = false;/g, 'var blnStandAlone = true;');
//         console.log('modifiedContent');
        
//         // Save the modified file content back
//         // await this.saveFile(`gurukul/unzip_files/${filePath}`, new Uint8Array(Buffer.from(modifiedContent, 'utf8')));
//         // console.log('scormdriver.js file updated successfully', this.saveFile);
//         // }

//         // Convert the modified content to Uint8Array
//         const encoder = new TextEncoder();
//         const modifiedContentArray = encoder.encode(modifiedContent);

//         // Save the modified file content back
//         await this.saveFile(`gurukul/unzip_files/${filePath}`, modifiedContentArray);
//         console.log('scormdriver.js file updated successfully');
//       }

//       /////////////////////////////////////////////////////////////////////////////////////////////
            
//       }



//       // Read the contents of the directory after all files are saved
//       const directoryContents = await this.readDirectory('gurukul/unzip_files');  
//       // Find the URI of story.html file
//       // const storyHtmlUri = directoryContents.find(filename => filename === 'story.html' || 'launcher.html');
//       const storyHtmlUri = directoryContents.find(filename => filename === 'launcher.html');
//       // After saving and reading, open the iframe modal with the story.html URI
//       if (storyHtmlUri) {
//         const iframeUrl = `gurukul/unzip_files/${storyHtmlUri}`;
//         loading.dismiss();
//         this.openIframeModal(iframeUrl);

//       } else {
//         console.error('story.html file not found in the directory');
//         loading.dismiss();
//       }
//     } catch (error) {
//       console.error('Error downloading and unzipping file:', error);
//       loading.dismiss();
//     }
//   }

//   async ensureDirectoryExists(directoryPath: string): Promise<void> {
//     try {
//       // Check if the directory exists before attempting to create it
//       const directoryExists = await this.checkDirectoryExists(directoryPath);
//       if (!directoryExists) {
//         await Filesystem.mkdir({
//           path: directoryPath,
//           directory: Directory.External,
//           recursive: true
//         });
//       }
//     } catch (error) {
//       console.error('Error creating directory:', error);
//     }
//   }

//   async checkDirectoryExists(directoryPath: string): Promise<boolean> {
//     try {
//       const result = await Filesystem.stat({
//         path: directoryPath,
//         directory: Directory.External
//       });
//       return result.type === 'directory';
//     } catch (error) {
//       // If an error occurs, assume the directory does not exist
//       return false;
//     }
//   }

//   async saveFile(filePath: string, fileData: Uint8Array): Promise<void> {
//     console.log("saveFile:",fileData, filePath)
//     try {
//       const blob = new Blob([fileData]);
//       const blobToBase64:any = await this.blobToBase64(blob)
//       await Filesystem.writeFile({
//         path: filePath,
//         data: blobToBase64,
//         directory: Directory.External,
//         // encoding: Encoding.UTF8,
//         recursive: true
//       });
//     } catch (error) {
//       console.error('Error saving file:', error);
//     }
//   }

//   async readDirectory(directoryPath: string): Promise<string[]> {
//     try {
//       const result = await Filesystem.readdir({
//         path: directoryPath,
//         directory: Directory.External
//       });
//       // Map FileInfo objects to file names
//       return result.files.map((fileInfo: FileInfo) => fileInfo.name);
//     } catch (error) {
//       console.error('Error reading directory:', error);
//       return [];
//     }
//   }

//   async openIframeModal(iframeSrc: string) {
//     const modal = await this.modalController.create({
//       component: IframeModalPage,
//       componentProps: {
//         iframeSrc: iframeSrc,
//       }
//     });
//     return await modal.present();
//   }

//   async clearDirectory(directoryPath: string): Promise<void> {
//     try {
//       await Filesystem.rmdir({
//         path: directoryPath,
//         directory: Directory.External,
//         recursive: true // Delete directory and all its contents recursively
//       });
//       console.log('Directory cleared successfully:', directoryPath);
//     } catch (error) {
//       console.error('Error clearing directory:', error);
//     }
//   }

//   blobToBase64(blob:Blob) {
//     return new Promise((resolve, reject) => {
//       const reader:any = new FileReader();
//       reader.readAsDataURL(blob);
//       reader.onloadend = () => {
//         const base64Data = reader.result.split(',')[1];
//         resolve(base64Data);
//       };
//       reader.onerror = (error:any) => {
//         reject(error);
//       };
//     });
//   }

// }
