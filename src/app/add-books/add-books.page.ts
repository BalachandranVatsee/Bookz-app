import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import * as Hammer from 'hammerjs';
import { BookService } from '../book.service';
import { Router } from '@angular/router';
import { BookDataService } from '../shared/book-data.service';

@Component({
  selector: 'app-add-books',
  templateUrl: './add-books.page.html',
  styleUrls: ['./add-books.page.scss'],
})
export class AddBooksPage implements OnInit, AfterViewInit {
  searchQuery: string = '';
  searchType: string = 'name';
  searchPlaceholder: string = 'Search by Title';
  filteredBooks: any[] = [];
  showResults: boolean = false;

  @ViewChildren('card') cardElements!: QueryList<ElementRef>;
  private hammerInstance?: HammerManager;

  constructor(private bookService: BookService, private router: Router, private bookDataService: BookDataService) {} 


  
gotoBooks() {
  this.router.navigate(['/books']);
}
  ngOnInit() {}

  ngAfterViewInit() {
    this.attachSwipeListenerToTopCard();
  }

  setSearchType(type: 'isbn' | 'name' | 'author') {
    this.searchType = type;
    this.searchPlaceholder = `Search by ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  }

  performSearch() {
    if (!this.searchQuery.trim() || !this.searchType) return;
  
    console.log(`Searching for: ${this.searchQuery} with type: ${this.searchType}`);
  
    // Fetch books based on the search type and query
    this.bookService.getSearchedBooks(this.searchQuery, this.searchType).subscribe(response => {
        console.log('API response:', response); // Log the full response
  
        // Check if items were returned
        if (response.items && response.items.length > 0) {
            this.filteredBooks = response.items.map((item: any) => ({
                name: item.volumeInfo.title,
                author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author',
                isbn: item.volumeInfo.industryIdentifiers
                    ? item.volumeInfo.industryIdentifiers.find((identifier: any) => identifier.type.includes('ISBN'))?.identifier
                    : 'N/A',
                thumbnail: item.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') || 'assets/placeholder.png',
                categories: item.volumeInfo.categories || [],
                publishedDate: item.volumeInfo.publishedDate || 'Unknown',
                format: item.saleInfo.isEbook ? 'Ebook' : 'Physical Book',
                publisher: item.volumeInfo.publisher || 'Unknown'
            }));
            this.showResults = true;
        } else {
            // No items found
            this.filteredBooks = [];
            this.showResults = false;
        }
  
        // Attach swipe listener if there are results
        if (this.showResults) {
            setTimeout(() => this.attachSwipeListenerToTopCard(), 0);
        }
    }, error => {
        console.error('Error fetching books:', error); // Log any errors
    });
  }
  

  attachSwipeListenerToTopCard() {
    if (this.hammerInstance) {
      this.hammerInstance.destroy();
    }

    const topCardElement = this.cardElements.first?.nativeElement;
    if (topCardElement) {
      this.hammerInstance = new Hammer(topCardElement);
      this.hammerInstance.get('pan').set({ direction: Hammer.DIRECTION_ALL });
      this.hammerInstance.on('pan', (e) => this.onPan(e));
      this.hammerInstance.on('panend', (e) => this.onPanEnd(e));
    }
  }

  onPan(event: any) {
    const card = this.cardElements.first?.nativeElement;
    if (card) {
      card.classList.add('swiping');
      card.style.transform = `translate(${event.deltaX}px, ${event.deltaY}px) rotate(${event.deltaX / 10}deg)`;
    }
  }

  onPanEnd(event: any) {
    const card = this.cardElements.first?.nativeElement;
    if (card) {
        card.classList.remove('swiping');
        const swipeThresholdX = 100;
        const swipeThresholdY = -100; // Negative for upward direction

        if (Math.abs(event.deltaX) > swipeThresholdX) {
            const isSwipeRight = event.deltaX > 0;
            this.completeSwipe(card, isSwipeRight ? window.innerWidth : -window.innerWidth, 0, !isSwipeRight);
        } else if (event.deltaY < swipeThresholdY) { 
            // Swipe up detected
            this.completeSwipe(card, 0, -window.innerHeight, false); // Move the card upward
        } else {
            card.style.transform = '';
        }
    }
}

completeSwipe(card: HTMLElement, x: number, y: number, storeInLocalStorage: boolean) {
  console.log('Swiping completed:', { x, y, storeInLocalStorage });

  card.style.transition = 'transform 0.3s ease';
  card.style.transform = `translate(${x}px, ${y}px) rotate(${x / 10}deg)`;

  setTimeout(() => {
    const swipedCard = this.filteredBooks.shift();
    console.log('Swiped Card:', swipedCard); // Log the swiped card

    if (swipedCard) {
        if (storeInLocalStorage) {
            // Handle right swipe (add to shared service)
            this.bookDataService.addBook(swipedCard);
        } else {
            // Handle left swipe (remove from shared service)
            this.bookDataService.removeBook(swipedCard.isbn);
        }
    }

    // Reset the card's transform and transition
    card.style.transition = 'none';
    card.style.transform = 'translate(0, 0) rotate(0deg)';

    setTimeout(() => {
        if (this.filteredBooks.length > 0) {
            this.attachSwipeListenerToTopCard();
        }
    }, 50);
  }, 300);
}






  trackByFn(index: number, item: any): number {
    return index; // or use item.id if each book has a unique id
  }
}
