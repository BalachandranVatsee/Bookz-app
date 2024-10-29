import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.page.html', // Ensure this file exists
  styleUrls: ['./shelf.page.scss'],
})
export class ShelfPage implements OnInit {
  books: any[] = [];
  isAscending: boolean = true;
  selectedBook: any = null; // Holds the selected book for the details display

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.fetchBooks('search terms');
  }

  // Method to select a book and display its details
  selectingBook(book: any) {
    this.selectedBook = book; // Set the selected book
  }

  // Method to close the selected book details and return to the book list
  closeSelectingBook() {
    this.selectedBook = !this.selectedBook; // Clear the selected book
    this.selectedBook = null;
}

  // Method to fetch books based on a search term
  fetchBooks(searchTerm: string): void {
    if (!searchTerm) {
      console.warn('Search term is empty, fetching default books.');
      searchTerm = 'harry potter';
    }
    this.bookService.getBooks(searchTerm).subscribe(
      (response) => {
        if (response && response.items) {
          this.books = response.items.map((item: any) => {
            let thumbnail = item.volumeInfo.imageLinks?.thumbnail || 'assets/placeholder.png';
            if (thumbnail.startsWith('http://')) {
              thumbnail = thumbnail.replace('http://', 'https://');
            }

            const format = item.saleInfo.isEbook ? 'Ebook' : 'Physical Book';
            return {
              title: item.volumeInfo.title,
              authors: item.volumeInfo.authors,
              thumbnail: thumbnail,
              categories: item.volumeInfo.categories,
              publishedDate: item.volumeInfo.publishedDate,
              format: format,
              publisher: item.volumeInfo.publisher
            };
          });
        } else {
          console.warn('No items found in the response');
          this.books = [];
        }
      },
      (error) => {
        console.error('Error fetching books:', error);
        this.books = [];
      }
    );
  }

  // Method to sort books in ascending/descending order
  sortBooks(): void {
    this.isAscending = !this.isAscending;
    this.books.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) return this.isAscending ? -1 : 1;
      if (titleA > titleB) return this.isAscending ? 1 : -1;
      return 0;
    });
  }
}
