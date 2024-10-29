import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShelfPage } from './shelf.page';

const routes: Routes = [
  {
    path: '',
    component: ShelfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShelfPageRoutingModule {}
