import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pref-messages',
  templateUrl: './pref-messages.page.html',
  styleUrls: ['./pref-messages.page.scss'],
})
export class PrefMessagesPage implements OnInit {
  toggleValue: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  toggleChanged() {
    console.log('Toggle changed. New value:', this.toggleValue);
  }
}
