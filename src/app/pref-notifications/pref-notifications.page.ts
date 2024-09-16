import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pref-notifications',
  templateUrl: './pref-notifications.page.html',
  styleUrls: ['./pref-notifications.page.scss'],
})
export class PrefNotificationsPage implements OnInit {
  allowNotif: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  toggleChanged() {
    console.log('Toggle changed. New value:', this.allowNotif);
  }
}
