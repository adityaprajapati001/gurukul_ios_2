import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import { library, playCircle, radio, search } from 'ionicons/icons';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  URL: any;

  constructor(private router: Router) {
    this.URL = this.router.url;

    addIcons({ library, playCircle, radio, search });
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
