import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMyFavoriteMovieComponent } from './add-my-favorite-movie.component';

describe('AddMyFavoriteMovieComponent', () => {
  let component: AddMyFavoriteMovieComponent;
  let fixture: ComponentFixture<AddMyFavoriteMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMyFavoriteMovieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMyFavoriteMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
