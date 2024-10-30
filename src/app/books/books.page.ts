import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import * as Hammer from 'hammerjs';
import { BookDataService, Book } from '../shared/book-data.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
})
export class BooksPage implements OnInit, AfterViewInit {
  books: Book[] = [];
  currentIndex: number = 0;

  @ViewChildren('card') cardElements!: QueryList<ElementRef>;
  private hammerInstance?: HammerManager;

  constructor(private bookDataService: BookDataService) {}

  ngOnInit() {
    this.bookDataService.swipedBooks$.subscribe(books => {
      this.books = books;
      this.currentIndex = 0;
      if (this.books.length > 0) {
        this.attachSwipeListenerToCurrentCard();
      }
    });
  }

  ngAfterViewInit() {
    if (this.books.length > 0) {
      this.attachSwipeListenerToCurrentCard();
    }
  }

  attachSwipeListenerToCurrentCard() {
    if (this.hammerInstance) {
      this.hammerInstance.destroy();
    }

    const currentCardElement = this.cardElements.toArray()[this.currentIndex]?.nativeElement;
    if (currentCardElement) {
      this.hammerInstance = new Hammer(currentCardElement);
      this.hammerInstance.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
      this.hammerInstance.on('pan', (e) => this.onPan(e));
      this.hammerInstance.on('panend', (e) => this.onPanEnd(e));
    }
  }

  onPan(event: HammerInput) {
    const card = this.cardElements.toArray()[this.currentIndex]?.nativeElement;
    if (card) {
      card.style.transform = `translateX(${event.deltaX}px) rotate(${event.deltaX / 10}deg)`;
    }
  }

  onPanEnd(event: HammerInput) {
    const card = this.cardElements.toArray()[this.currentIndex]?.nativeElement;
    if (card) {
      const swipeThreshold = 100;

      if (Math.abs(event.deltaX) > swipeThreshold) {
        const isSwipeRight = event.deltaX > 0;
        this.completeSwipe(card, isSwipeRight);
      } else {
        this.resetSwipe(card);
      }
    }
  }

  completeSwipe(card: HTMLElement, isSwipeRight: boolean) {
    const cardOffset = isSwipeRight ? window.innerWidth : -window.innerWidth;
    card.style.transition = 'transform 0.3s ease';
    card.style.transform = `translateX(${cardOffset}px)`;

    setTimeout(() => {
      // Update the index based on the swipe direction
      this.currentIndex = isSwipeRight ? (this.currentIndex - 1 + this.books.length) % this.books.length : (this.currentIndex + 1) % this.books.length;

      // Reset the card position and reattach swipe listeners
      this.updateCardPositions();
      this.attachSwipeListenerToCurrentCard();
    }, 300);
  }

  resetSwipe(card: HTMLElement) {
    card.style.transition = 'none';
    card.style.transform = 'translateX(0) rotate(0deg)';
  }

  updateCardPositions() {
    const cards = this.cardElements.toArray();

    cards.forEach((card, index) => {
      const cardElement = card.nativeElement;
      cardElement.style.transition = 'none';
      cardElement.style.transform = 'translateX(0) rotate(0deg)';
      cardElement.style.zIndex = `${cards.length - index}`;

      // Show only the current card
      if (index === this.currentIndex) {
        cardElement.style.display = 'flex';
      } else {
        cardElement.style.display = 'none';
      }
    });
  }

  trackByFn(index: number): number {
    return index;
  }
}
