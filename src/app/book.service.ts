// book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'https://www.googleapis.com/books/v1/volumes';

  getBooks(searchTerm: string): Observable<any> {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`;
    console.log('Fetching books from:', apiUrl); // Log the API URL
    return this.http.get(apiUrl);
}

getSearchedBooks(searchTerm: string, searchType: string): Observable<any> {
  const searchField = searchType === 'isbn' ? 'isbn' : searchType === 'name' ? 'intitle' : 'inauthor';
  const url = `${this.apiUrl}?q=${searchField}:${searchTerm}`;
  return this.http.get(url);
}

}
