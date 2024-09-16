import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  courseId:any;
  instanceId:any;
  feedbacks:any = [];
  formData!:FormGroup;

  constructor(
    private authService:AuthService,
    private route:ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController
  ) { 
    this.formData = this.formBuilder.group({});
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.courseId = this.route.snapshot.paramMap.get('courseId');
    this.instanceId = this.route.snapshot.paramMap.get('instanceId');
    console.log(this.courseId,this.instanceId)
    this.getFeedbackItems(this.courseId,this.instanceId);
    this.onSubmit('load');
  }

  async getFeedbackItems(courseId:any,instanceId:any) {
    try {
      const res:any = await this.authService.getFeedbackItems(courseId,instanceId).toPromise();
      if(res) {
        this.feedbacks = res.items
        this.feedbacks.map((el:any)=>{
          if(el.typ != 'label') {
            el.presentation = this.parsePresentation(el.presentation)
          }
        })
        console.log('getFeedbackItems',this.feedbacks)
        for (let index = 0; index < this.feedbacks.length; index++) {
          const feedback = this.feedbacks[index];
          if(feedback.typ != 'label') {
            const controlName = feedback.id
            this.formData.addControl(controlName, this.formBuilder.control('', Validators.required));
          }
        }
        console.log('formData',this.formData)
        
      }
    } catch(err) {
      console.log(err)
    }
  }

  parsePresentation(presentationString:string) {
    // Split the presentation string based on '|'
    let values = presentationString.split('|');

    // Remove any additional characters like 'd>>>>>' or 'r>>>>>'
    values = values.map(value => value.replace(/^[dr]>>>>>/, '').trim());

    // Create an array of objects with 'label' and 'value' properties
    let presentationArray = values.map((value, index) => {
        return {
            label: value,
            value: index + 1 // Or use 'value' if needed
        };
    });

    return presentationArray;
  }

  async onSubmit(type: any) {
    try {
      var result: any = [];
      console.log("this.formData.value", this.formData.value);
      for (const key in this.formData.value) {
        if (this.formData.value.hasOwnProperty(key)) {
          result.push({ [key]: this.formData.value[key] });
        }
      }
      console.log('formData',JSON.stringify(result) )
      const res = await this.authService.submitFeedback(this.instanceId,JSON.stringify(result), type).toPromise();
      console.log('form submit',res)
      if(res?.result == 'error') {
        this.presentToast(res[0]['msg'],'danger')
        return
      } else if(res[0]['msg']) {
        this.presentToast(res[0]['msg'],'success')
      }
    } catch(err) {
      console.log(err)
      // this.presentToast(err,'danger')
    }
    
  }

  async presentToast(message: any, color: any) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: color,
    });

    toast.present();
  }

}

