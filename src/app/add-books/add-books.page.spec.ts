import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddBooksPage } from './add-books.page';

describe('AddBooksPage', () => {
  let component: AddBooksPage;
  let fixture: ComponentFixture<AddBooksPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBooksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
