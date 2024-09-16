import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.page.html',
  styleUrls: ['./footer.page.scss'],
})
export class FooterPage implements OnInit {
  URL: any;

  constructor(private router: Router) {
    this.URL = this.router.url;
  }

  ngOnInit() { }

  onHome() {
    this.router.navigate(['home']).then(() => {
      // window.location.reload();
    })
  }

  onCalendar() {
    this.router.navigate(['calendar']).then(() => {
      // window.location.reload();
    })
  }

  onBell() {
    this.router.navigate(['notification']).then(() => {
      // window.location.reload();
    })
  }

  onChat() {
    this.router.navigate(['chat']).then(() => {
      // window.location.reload();
    })
  }

  onMore() {
    this.router.navigate(['more']).then(() => {
      // window.location.reload();
    })
  }
}
