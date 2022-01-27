import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieViewExcerptComponent } from './movie-view-excerpt.component';

describe('MovieViewExcerptComponent', () => {
  let component: MovieViewExcerptComponent;
  let fixture: ComponentFixture<MovieViewExcerptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieViewExcerptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieViewExcerptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
