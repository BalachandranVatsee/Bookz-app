import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  {
    path: 'shelf',
    loadChildren: () => import('./shelf/shelf.module').then( m => m.ShelfPageModule)
  },
  {
    path: '',
    redirectTo: 'shelf',
    pathMatch: 'full'
  },
  {
    path: 'shelf',
    loadChildren: () => import('./shelf/shelf.module').then( m => m.ShelfPageModule)
  },
  {
    path: 'books',
    loadChildren: () => import('./books/books.module').then( m => m.BooksPageModule)
  },
  {
    path: 'add-books',
    loadChildren: () => import('./add-books/add-books.module').then( m => m.AddBooksPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
