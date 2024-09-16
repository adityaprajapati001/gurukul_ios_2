import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
})
export class PreferencesPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onMessage(){
    this.router.navigate(['pref-messages'])
  }

  onNotification(){
    this.router.navigate(['pref-notifications'])
  }
}
