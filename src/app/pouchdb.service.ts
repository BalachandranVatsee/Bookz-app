// pouchdb.service.ts
import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';

@Injectable({
  providedIn: 'root',
})
export class PouchdbService {
  private db: any;

  constructor() {
    // Initialize PouchDB with a local database called 'booksDB'
    this.db = new PouchDB('booksDB');
  }

  // Add or update a book in PouchDB
  async addOrUpdateBook(book: any): Promise<any> {
    try {
      const existingBook = await this.db.get(book.id).catch((err: any) => null);
      if (existingBook) {
        book._rev = existingBook._rev; // Use _rev to update the existing book
      }
      const result = await this.db.put(book);
      return result;
    } catch (error) {
      console.error('Error adding/updating book:', error);
    }
  }

  // Fetch all books from PouchDB
  async getBooks(): Promise<any[]> {
    try {
      const result = await this.db.allDocs({ include_docs: true });
      return result.rows.map((row: any) => row.doc);
    } catch (error) {
      console.error('Error fetching books from PouchDB:', error);
      return [];
    }
  }

  // Fetch a specific book from PouchDB
  async getBookById(bookId: string): Promise<any> {
    try {
      const book = await this.db.get(bookId);
      return book;
    } catch (error) {
      console.error('Error fetching book from PouchDB:', error);
    }
  }

  // Delete a book from PouchDB
  async deleteBook(bookId: string): Promise<void> {
    try {
      const book = await this.db.get(bookId);
      await this.db.remove(book);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  }
}
