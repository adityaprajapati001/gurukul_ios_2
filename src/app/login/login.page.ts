import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { TokenService } from '../services/token/token.service';
import { AuthService } from '../services/auth/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Subscription, timer } from 'rxjs';
import { FcmService } from '../services/fcm/fcm.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  otpLoginForm!: FormGroup;
  isLoggedIn: boolean = false;
  showPassword: boolean = false;
  passwordToggleIcon = 'eye-off-outline';
  toastMsg: any;
  isVisible: boolean = false;
  remainingTime = 30;
  timerColor: any = '#3553A1';
  segment: any = 'user';
  inputValue: any;
  userData: any[] = [];

  // isPasswordCorrect: boolean | null = null;



  private timerSubscription: Subscription | undefined;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private fcmService: FcmService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    console.log('rememberMeData', localStorage.getItem('rememberMeData'));

    this.createUserForm();
    this.createOtpForm(); 
  }

  createUserForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });

    const rememberMeDataString = localStorage.getItem('rememberMeData');
    if (rememberMeDataString !== null) {
      const rememberMeData = JSON.parse(rememberMeDataString);
      this.loginForm.patchValue(rememberMeData);
    }
  }

  createOtpForm() {
    this.otpLoginForm = this.fb.group({
      phone: ['', [Validators.required]],
      otp: ['', [Validators.required]],
    });
  }

  // Getter methods for form controls
  get f() {
    return this.loginForm.controls;
  }

  get g() {
    return this.otpLoginForm.controls;
  }

  // Method to toggle password visibility
  toggle() {
    this.showPassword = !this.showPassword;
    this.passwordToggleIcon = this.showPassword ? 'eye-outline' : 'eye-off-outline';
  }

  // Method to switch between user login and OTP login forms
  async changeForm(value: any) {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 2000
    });
    await loading.present();
    if (value === 'otp') {
      await loading.dismiss();
    } else {
      await loading.dismiss();
    }
  }

  async onSubmit() {
    this.isLoggedIn = true;
    const loading = await this.loadingController.create({
      // message: 'Loading...',
      duration: 2000
    });

    if (this.loginForm.valid) {
      // Fetch user info and perform login
      this.authService.getUserInfo(this.loginForm.get('username')?.value).subscribe({
        next: async (userData) => {
          if (userData) {
            console.log('userinfo',userData)
            await loading.present();
            const username = this.loginForm.get('username')?.value;
            const password = this.loginForm.get('password')?.value;
            this.authService.login(username, password).subscribe({
              next: async (res) => {
                this.tokenService.saveAdminToken(res?.token)
                console.log('login res',res)
                if (res.error) {
                  await loading.dismiss();
                  console.log(userData);
                  if (userData.length !== 0) {
                    if (parseInt(userData[0].username) === parseInt(username)) {
                      this.presentToast('Invalid User ID or Password', 'danger');
                    }
                  } else {
                    this.presentToast(res.error, 'danger');
                  }
                }
                if (res.token && res.token !== undefined) {
                  this.tokenService.saveToken(res.token);
                  if (this.loginForm.value.rememberMe) {
                    localStorage.setItem('rememberMeData', JSON.stringify(this.loginForm.value));
                  } else {
                    // If "Remember Me" is not checked, clear stored data
                    localStorage.removeItem('rememberMeData');
                  }
                  localStorage.setItem('username', username);
                  this.tokenService.saveUser(userData);
                  this.fcmService.fcm();
                  const fcmRes = await this.authService.updateFcmToken()
                  console.log('fcmRes',fcmRes)
                  setTimeout(() => {
                  this.router.navigate(['home'])
                  }, 300);
                  // this.router.navigate(['home']).then(() => {
                  //   location.reload();
                  // });
                  await loading.dismiss();
                }
              },
              error: async (error) => {
                await loading.dismiss();
                this.presentToast(error, 'danger');
                console.error('Login failed:', error);
              },
              complete: () => {
                // Optionally handle completion if needed
              }
            });
          }
        },
        error: (error) => {
          console.error('Error occurred:', error);
          this.presentToast(error, 'danger');
        }
      });
    }
  }


  // Method to handle submission of OTP form
  async onSubmitOtp() {
    this.isLoggedIn = true;
    const loading = await this.loadingController.create({
      // message: 'Loading...',
      duration: 2000
    });
    if (this.otpLoginForm.valid) {
      await loading.present();
      const phone = this.otpLoginForm.get('phone')?.value;
      const otp = this.otpLoginForm.get('otp')?.value;
      this.authService.loginViaOtp(phone, otp).subscribe({
        next: async (res) => {
          console.log(res);
          
          if (res.result === "error") {
            this.presentToast(res.result, 'danger');
          }
          if (res.result === "success") {
            this.tokenService.saveToken(res[0].token);
            localStorage.setItem('username', res[0].username);
            console.log('otp user',res)
            this.tokenService.saveUser(res[0]);
            this.fcmService.fcm();
            const fcmRes = await this.authService.updateFcmToken()
            console.log('fcm res',fcmRes)
            setTimeout(() => {
            this.router.navigate(['home'])
            }, 300);
            // this.tokenService.saveUser(userData);
            // this.fcmService.fcm();
            // const fcmRes = await this.authService.updateFcmToken()
            // this.router.navigate(['home']).then(() => {
            //   // location.reload();
            // });
            await loading.dismiss();
          }
        },
        error: async (error) => {
          await loading.dismiss();
          this.presentToast(error, 'danger');
          console.error('Login failed:', error);
        },
        complete: () => {
          // Optionally handle completion if needed
        }
      });
    }
  }

  // Method to handle max phone number length for OTP form
  onMaxPhone(event: Event) {
    this.inputValue = (event.target as HTMLInputElement).value;
    const maxLength = 10;
    if (this.inputValue.length > maxLength) {
      (event.target as HTMLInputElement).value = this.inputValue.slice(0, maxLength);
      this.otpLoginForm.patchValue({ phone: this.inputValue.slice(0, maxLength) });
    }
    console.log(this.inputValue.length);

    if (this.inputValue.length === 10) {
      this.authService.sendOtp(this.otpLoginForm.get('phone')?.value).subscribe(
        (data) => {
          if (data.result === "success") {
            this.presentToast("OTP Sent Successfully", 'success');
            const source = timer(0, 1000);
            this.timerSubscription = source.subscribe(() => {
              this.isVisible = true;
              if (this.remainingTime > 0) {
                this.remainingTime--;
                if (this.remainingTime <= 10) {
                  this.timerColor = '#B80000';
                }
                if (this.remainingTime == 0) {
                  this.authService.expireOtp(this.otpLoginForm.get('phone')?.value).subscribe({
                    next: (res) => {
                      if (res.result === "error") {
                        this.presentToast(res.result, 'danger');
                      }
                      if (res.result === "success") {
                          this.presentToast("Otp Expired, Please Try Again", 'danger');
                      }
                    },
                    error: (error) => {
                      this.presentToast(error, 'danger');
                      console.error('Login failed:', error);
                    },
                  });
                }
              } else {
                this.isVisible = false;
                this.timerSubscription!.unsubscribe();
                this.remainingTime = 30
              }
            });
          } else {
            this.presentToast("OTP Sending Failed", 'danger');
          }
        },
        (error) => {
          console.error('Error occurred:', error);
          this.presentToast(error, 'danger');
        }
      );
    }
  }

  isPhoneValid() {
    return this.otpLoginForm.get('phone')?.value.toString().length === 10;
  }

  // Method to resend OTP
  resendOtp() {
    console.log(this.inputValue);

    if (this.inputValue.length === 10) {
      this.authService.sendOtp(this.otpLoginForm.get('phone')?.value).subscribe(
        (data) => {
          if (data.result === "success") {
            this.presentToast("OTP Sent Successfully", 'success');
            const source = timer(0, 1000);
            this.timerSubscription = source.subscribe(() => {
              this.isVisible = true;
              if (this.remainingTime > 0) {
                this.remainingTime--;
                if (this.remainingTime <= 10) {
                  this.timerColor = '#B80000';
                }
                if (this.remainingTime <= 0) {
                  this.authService.expireOtp(this.otpLoginForm.get('phone')?.value).subscribe({
                    next: (res) => {
                      if (res.result === "error") {
                        this.presentToast(res.result, 'danger');
                      }
                      if (res.result === "success") {
                          this.presentToast("Otp Expired, Please Try Again", 'danger');
                      }
                    },
                    error: (error) => {
                      this.presentToast(error, 'danger');
                      console.error('Login failed:', error);
                    },
                  });
                }
              } else {
                this.isVisible = false;
                this.timerSubscription!.unsubscribe();
              }
            });
          } else {
            this.presentToast("OTP Sending Failed", 'danger');
          }
        },
        (error) => {
          console.error('Error occurred:', error);
          this.presentToast(error, 'danger');
        }
      );
    }
  }

  // Method to present toast messages
  async presentToast(message: any, color: any) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: color,
    });

    toast.present();
  }

  // Method to unsubscribe timer subscription on component destruction
  ionViewDidLeave() {
  
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.remainingTime = 30
    }
  }

  // Method to handle segment change
  segmentChanged(ev: any) {
    this.cdr.detectChanges()
    this.segment = ev.detail.value;
  }
  
}
