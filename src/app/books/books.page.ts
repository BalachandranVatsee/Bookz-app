import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
})
export class BooksPage implements OnInit, AfterViewInit {
  @ViewChildren('card') cards!: QueryList<ElementRef>;

  books = [
    { id: 1, title: 'Book 1' },
    { id: 2, title: 'Book 2' },
    { id: 3, title: 'Book 3' },
    { id: 4, title: 'Book 4' },
    { id: 5, title: 'Book 5' },
    { id: 6, title: 'Book 6' },
    // Add more book objects as needed
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
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
      } else {
        // Swipe left
        this.addToCollection(this.books[index]);
        card.style.transition = 'transform 0.3s ease-out'; // Smooth exit
        card.style.transform = 'translateX(-100vw)'; // Move off screen to the left
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

  addToWishlist(book: any): void {
    console.log('Added to Wishlist:', book);
    this.books = this.books.filter(b => b.id !== book.id); // Remove swiped book
  }

  addToCollection(book: any): void {
    console.log('Added to Collection:', book);
    this.books = this.books.filter(b => b.id !== book.id); // Remove swiped book
  }
}
