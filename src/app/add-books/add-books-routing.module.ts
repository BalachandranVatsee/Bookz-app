import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddBooksPage } from './add-books.page';

const routes: Routes = [
  {
    path: '',
    component: AddBooksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddBooksPageRoutingModule {}
