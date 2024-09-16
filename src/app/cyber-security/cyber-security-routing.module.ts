import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CyberSecurityPage } from './cyber-security.page';


const routes: Routes = [
  {
    path: '',
    component: CyberSecurityPage
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CyberSecurityPageRoutingModule {}
