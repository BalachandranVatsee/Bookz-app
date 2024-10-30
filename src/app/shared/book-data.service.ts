import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookDataService {
  private swipedBooksSubject = new BehaviorSubject<any[]>([]);
  swipedBooks$ = this.swipedBooksSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const storedBooks = localStorage.getItem('swipedBooks');
    if (storedBooks) {
      this.swipedBooksSubject.next(JSON.parse(storedBooks));
    }
  }

  addBook(book: any) {
    const currentBooks = this.swipedBooksSubject.value;
    if (!currentBooks.some(b => b.isbn === book.isbn)) {
      currentBooks.push(book);
      this.swipedBooksSubject.next(currentBooks);
      this.saveToLocalStorage(currentBooks);
    }
  }

  removeBook(isbn: string) {
    const updatedBooks = this.swipedBooksSubject.value.filter(book => book.isbn !== isbn);
    this.swipedBooksSubject.next(updatedBooks);
    this.saveToLocalStorage(updatedBooks);
  }

  private saveToLocalStorage(books: any[]) {
    localStorage.setItem('swipedBooks', JSON.stringify(books));
  }
}
