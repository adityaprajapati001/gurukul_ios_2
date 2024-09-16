// src/app/services/aicc.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AiccService {
  private blnIFrameLoaded = false;
  private intReCheckAttempts = 0;
  private IFrameLoaded_TimeOutID: any = null;
  private intReCheckAttemptsBeforeTimeout = 10; // Adjust as necessary
  private intReCheckLoadedInterval = 500; // Adjust as necessary

  constructor() {}

  private URLEncode(str: string): string {
    return encodeURIComponent(str);
  }

  private WriteToDebug(message: string): void {
    console.debug(message);
  }

  private CheckIFrameLoaded(requestType: string): void {
    this.WriteToDebug("In CheckIFrameLoaded strRequestType=" + requestType);

    if (this.blnIFrameLoaded) {
      this.WriteToDebug("Frame Loaded");
      // Implement ProcessLMSResult and GetIFrameContents
      // Example:
      // ProcessLMSResult(requestType, this.GetIFrameContents());
    } else {
      // Re-check or timeout
      this.WriteToDebug("Frame Not Loaded");
      this.intReCheckAttempts++;

      if (this.intReCheckAttempts > this.intReCheckAttemptsBeforeTimeout) {
        this.WriteToDebug("Frame Timeout Error");
        alert("The LMS timed out while responding to an AICC request.");
      } else {
        this.WriteToDebug("Resetting CheckIFrameLoaded");
        this.IFrameLoaded_TimeOutID = window.setTimeout(() => this.CheckIFrameLoaded(requestType), this.intReCheckLoadedInterval);
      }
    }
  }

  private IFrameLoaded(): void {
    this.WriteToDebug("IFrameLoaded");
    this.blnIFrameLoaded = true;
  }

  private GetIFrameContents(): string {
    let strContents = "";

    this.WriteToDebug("In GetIFrameContents");

    try {
      const iframe = document.getElementById('aiccIframe') as HTMLIFrameElement;
      const iframeDoc = iframe?.contentDocument;
      if (iframeDoc) {
        strContents = iframeDoc.body.innerHTML;
      }
    } catch (e) {
      this.WriteToDebug("Error accessing iframe contents. Error=" );
      strContents = "";
    }

    this.WriteToDebug("strContents=" + strContents);
    return strContents;
  }

  public SubmitFormUsingIFrame(
    strAICCURL: string,
    strAICCSID: string,
    strRequestType: string,
    strAICCData: string
  ): void {
    this.WriteToDebug("In SubmitFormUsingIFrame, setting fields");

    const iframe = document.getElementById('aiccIframe') as HTMLIFrameElement;
    const iframeDoc = iframe?.contentDocument;

    if (!iframeDoc) {
      this.WriteToDebug("IFrame document not found");
      return;
    }

    const form = iframeDoc.getElementById('frmAICC') as HTMLFormElement;
    if (!form) {
      this.WriteToDebug("Form frmAICC not found");
      return;
    }

    const sessionInput = form.querySelector('input[name="session_id"]') as HTMLInputElement;
    const commandInput = form.querySelector('input[name="command"]') as HTMLInputElement;
    const aiccDataInput = form.querySelector('input[name="aicc_data"]') as HTMLInputElement;
    const versionInput = form.querySelector('input[name="version"]') as HTMLInputElement;

    if (!sessionInput || !commandInput || !aiccDataInput || !versionInput) {
      this.WriteToDebug("One or more form inputs not found");
      return;
    }

    form.action = strAICCURL;
    sessionInput.value = strAICCSID;
    commandInput.value = this.URLEncode(strRequestType);
    aiccDataInput.value = this.URLEncode(strAICCData);

    // Check LMS version
    const lmsVersion = (window.parent as any).AICC_LMS_Version;
    versionInput.value = lmsVersion ? this.URLEncode(lmsVersion) : "3.5";

    this.WriteToDebug("Submitting Form");
    form.submit();

    this.blnIFrameLoaded = false;
    this.intReCheckAttempts = 0;

    this.WriteToDebug("Clearing Timeout");
    if (this.IFrameLoaded_TimeOutID) {
      clearTimeout(this.IFrameLoaded_TimeOutID);
      this.IFrameLoaded_TimeOutID = null;
    }

    this.CheckIFrameLoaded(strRequestType);
  }
}
