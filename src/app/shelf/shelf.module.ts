import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShelfPageRoutingModule } from './shelf-routing.module';

import { ShelfPage } from './shelf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShelfPageRoutingModule
  ],
  declarations: [ShelfPage]
})
export class ShelfPageModule {}
