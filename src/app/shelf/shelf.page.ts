import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { Router } from '@angular/router';
import { BookDataService } from '../shared/book-data.service';

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.page.html', // Ensure this file exists
  styleUrls: ['./shelf.page.scss'],
})
export class ShelfPage implements OnInit {
  swipedBooks: any[] = []; // Initialize an empty array for swiped books
  selectedBook: any | null = null; // To hold the currently selected book
  isAscending: boolean = true;
  tags: string[] = []; // List of tags
  newTag: string = ''; // Input for new tag
  isTagPopupOpen: boolean = false;
  filteredBooks: any[] | null = null; // Array to store filtered books
  selectedTag: string = ''; // Currently selected tag for filtering
  router: any;

  
  goBack() {
    this.selectedBook = null; // Reset selected book
    this.clearFilter(); // Clear any filters if needed
    this.router.navigate(['/books']); // Navigate back to the desired route
  }

  constructor(private bookDataService: BookDataService) {}

  openTagPopup(){
    this.isTagPopupOpen = true;
  }

  closeTagPopup(){
    this.isTagPopupOpen=!this.isTagPopupOpen;
  }

  ngOnInit() {
    this.bookDataService.swipedBooks$.subscribe(books => {
      this.swipedBooks = books;
      console.log('Books loaded from shared service:', this.swipedBooks);
    });
  }

  getSwipedBooks() {
    const storedBooks = localStorage.getItem('swipedBooks');
    if (storedBooks) {
        this.swipedBooks = JSON.parse(storedBooks);
        console.log('Books loaded from local storage:', this.swipedBooks);
    } else {
        console.log('No books found in local storage.');
    }
}

  viewBookDetails(book: any) {
    this.selectedBook = book;
    console.log('Selected book details:', this.selectedBook);
  }

  closeSelectingBook() {
    this.selectedBook = null;
  }

  backToList() {
    console.log('Returning to book list.');
    this.selectedBook = null;
  }

  sortBooks(): void {
    this.isAscending = !this.isAscending;
    this.swipedBooks.sort((a, b) => {
      const titleA = a.name.toLowerCase();
      const titleB = b.name.toLowerCase();
      if (titleA < titleB) return this.isAscending ? -1 : 1;
      if (titleA > titleB) return this.isAscending ? 1 : -1;
      return 0;
    });
  }

  addTag() {
    if (this.newTag) {
      // Check if the tag already exists in the tags array
      const existingTagCount = this.tags.filter(tag => tag === this.newTag).length;
      
      if (existingTagCount > 0) {
        console.log('Tag already exists:', this.newTag);
        // Push the new tag to selectedBook.tags multiple times based on existing count
        for (let i = 0; i < existingTagCount + 1; i++) {
          // Ensure selectedBook.tags is initialized
          if (!this.selectedBook.tags) {
            this.selectedBook.tags = [];
          }
          this.selectedBook.tags.push(this.newTag);
        }
        console.log('Updated selected book details with duplicate tag:', this.selectedBook);
      } else {
        this.tags.push(this.newTag);
        
        // Add the tag to the selected book if available
        if (this.selectedBook) {
          if (!this.selectedBook.tags) {
            this.selectedBook.tags = [];
          }
          this.selectedBook.tags.push(this.newTag);
          console.log('Updated selected book details:', this.selectedBook);
        }
      }
  
      this.newTag = '';
      this.closeTagPopup();
    }
  }
  

  // Filter books based on the selected tag
  filterBooksByTag(tag: string) {
    this.selectedTag = tag;
    this.filteredBooks = this.swipedBooks.filter(book => 
      book.tags && book.tags.includes(tag)
    );

    console.log('Filtered books with tag', tag, ':', this.filteredBooks);
  }

  // Clear the filtered books and show all books again
  clearFilter() {
    this.filteredBooks = null;
    this.selectedTag = '';
  }

  onComposeClick(): void {
    // Navigate to the 'Add Book' page or open a compose modal
    this.router.navigate(['/add-book']);
  }
}
