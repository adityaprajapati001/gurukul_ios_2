import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'calender',
        loadChildren: () => import('./../calendar/calendar.module').then(m => m.CalendarPageModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('./../chat/chat.module').then(m => m.ChatPageModule)
      },
      {
        path: 'more',
        loadChildren: () => import('./../more/more.module').then(m => m.MorePageModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
