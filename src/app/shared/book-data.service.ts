import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Define a Book interface for better type safety
export interface Book {
  isbn: string;
  name: string;
  title: string;
  author: string;
  imageUrl: string;
  // Add other properties as needed
}

@Injectable({
  providedIn: 'root',
})
export class BookDataService {
  private swipedBooksSubject = new BehaviorSubject<Book[]>([]);
  swipedBooks$ = this.swipedBooksSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const storedBooks = localStorage.getItem('swipedBooks');
      if (storedBooks) {
        this.swipedBooksSubject.next(JSON.parse(storedBooks));
      }
    } catch (error) {
      console.error('Failed to load books from localStorage', error);
      this.swipedBooksSubject.next([]); // Start with an empty array on error
    }
  }

  addBook(book: Book) {
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

  private saveToLocalStorage(books: Book[]) {
    localStorage.setItem('swipedBooks', JSON.stringify(books));
  }

  // Method to get current list of books
  getBooks(): Book[] {
    return this.swipedBooksSubject.value; // Returns the current list of swiped books
  }
}
