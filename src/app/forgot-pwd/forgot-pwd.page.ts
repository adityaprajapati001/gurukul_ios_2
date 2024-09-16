import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.page.html',
  styleUrls: ['./forgot-pwd.page.scss'],
})
export class ForgotPwdPage implements OnInit {
  forgotForm!: FormGroup;

   isPasswordCorrect: boolean | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService,
    private toastCtrl: ToastController,private router: Router) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.forgotForm = this.fb.group({
      username: ['', [Validators.required]]
    })
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      console.log(this.forgotForm.get('username')?.value);
      try {
        this.authService.validateEmail(this.forgotForm.get('username')?.value).subscribe({
          next: (res) => {
            console.log(res);
            if(res.length !== 0){
              this.authService
              .forgotPassword(
                this.forgotForm.get('username')?.value)
              .subscribe({
                next: (res) => {
                  console.log(res.error);
                  console.log(res);
    
                  if (res.error) {
                    this.presentToast(res.error, 'danger');
                  }
                  if (res.status && res.status !== undefined) {
    
                    this.router.navigate(['login']).then(() => {
                      this.presentToast('Mail Sent Successfully','success')
                    });
                  }
                },
                error: (error) => {
                  // this.toastMsg = error;
                  this.presentToast(error, 'danger');
                  console.error('Login failed:', error);
                },
              });
            }else{
              this.presentToast('Email not found,Please enter Valid Email','danger')
            }
          },
          error: (error) => {
            this.presentToast(error, 'danger');
            console.error('Login failed:', error);
          },
        });
      } catch (error) {
        console.error('Error occurred during login:', error);
      }
    } else {
      return;
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

  onlogin(){
    this.router.navigate(['/login']);
  }

}
