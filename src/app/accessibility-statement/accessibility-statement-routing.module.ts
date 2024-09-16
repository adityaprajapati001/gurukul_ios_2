import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccessibilityStatementPage } from './accessibility-statement.page';

const routes: Routes = [
  {
    path: '',
    component: AccessibilityStatementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessibilityStatementPageRoutingModule {}
