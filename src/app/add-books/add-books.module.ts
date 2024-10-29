import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddBooksPageRoutingModule } from './add-books-routing.module';

import { AddBooksPage } from './add-books.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddBooksPageRoutingModule
  ],
  declarations: [AddBooksPage]
})
export class AddBooksPageModule {}
