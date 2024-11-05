import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { BookDataService, Book } from '../shared/book-data.service'; // Adjust the import path as necessary
import * as Hammer from 'hammerjs';

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
})
export class BooksPage implements OnInit, AfterViewInit {
  @ViewChildren('card') cards!: QueryList<ElementRef>;

  books: Book[] = []; // Define books as an array of Book

  constructor(private bookDataService: BookDataService, private cdr: ChangeDetectorRef) {} // Inject the service

  ngOnInit(): void {
    // Subscribe to the observable to get the current books
    this.bookDataService.swipedBooks$.subscribe((books: Book[]) => {
      this.books = books; // Bind the retrieved books to the component's books array
      this.cdr.detectChanges(); // Detect changes to update the view
      this.initSwipeListeners(); // Reinitialize swipe listeners
    });
  }

  ngAfterViewInit(): void {
    this.initSwipeListeners();
  }

  private initSwipeListeners(): void {
    this.cards.forEach((card, index) => {
      const hammer = new Hammer(card.nativeElement);
      hammer.on('pan', (event) => this.handlePan(event, index));
      hammer.on('panend', (event) => this.handlePanEnd(event, index));
    });
  }

  handlePan(event: HammerInput, index: number): void {
    const card = this.cards.toArray()[index].nativeElement;

    // Allow only horizontal movement
    card.style.transform = `translateX(${event.deltaX}px)`;
  }

  handlePanEnd(event: HammerInput, index: number): void {
    const threshold = 100; // Distance to trigger a swipe action
    const card = this.cards.toArray()[index].nativeElement;

    // Check if the swipe is beyond the threshold
    if (Math.abs(event.deltaX) > threshold) {
        if (event.deltaX > 0) {
            // Swipe right
            this.addToWishlist(this.books[index]);
            card.style.transition = 'transform 0.3s ease-out'; // Smooth exit
            card.style.transform = 'translateX(100vw)'; // Move off screen to the right
            
            // Move to the previous card or loop to the last card
            if (index === 0) {
                setTimeout(() => {
                    this.books.unshift(this.books.pop()!); // Move last book to front
                    this.cdr.detectChanges(); // Update the view
                }, 300); // Delay to allow transition to complete
            }
        } else {
            // Swipe left
            this.addToCollection(this.books[index]);
            card.style.transition = 'transform 0.3s ease-out'; // Smooth exit
            card.style.transform = 'translateX(-100vw)'; // Move off screen to the left
            
            // Move to the next card or loop to the first card
            if (index === this.books.length - 1) {
                setTimeout(() => {
                    this.books.push(this.books.shift()!); // Move first book to end
                    this.cdr.detectChanges(); // Update the view
                }, 300); // Delay to allow transition to complete
            }
        }
    } else {
        // Reset the position if the swipe wasn't enough
        card.style.transition = 'transform 0.3s ease-out'; // Smooth reset
        card.style.transform = 'translateX(0)'; // Reset to original position
    }

    // Reset transition style after the animation
    setTimeout(() => {
        card.style.transition = ''; // Clear transition style
    }, 300);
}


  addToWishlist(book: Book): void {
    console.log('Added to Wishlist:', book);
    // Implement further functionality as needed
  }

  addToCollection(book: Book): void {
    console.log('Added to Collection:', book);
    // Implement further functionality as needed
  }
}
