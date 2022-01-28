import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { addMyCustomMovie } from 'src/app/state/movies.actions';

import { Movie } from 'src/app/models/models.interface';
import { forbiddenPopularityValidator } from 'src/app/directives/forbidden-popularity-validator.directive';

@Component({
  selector: 'app-add-my-favorite-movie',
  template: `
    <form
      class="mt-2"
      [formGroup]="addMyFaroviteMovieForm"
      (ngSubmit)="onSubmit()"
    >
      <input
        type="text"
        class="input-control"
        formControlName="title"
        id="movie-title"
        placeholder="enter movie title"
        autocomplete="off"
      />
      <div
        *ngIf="title.invalid && (title.dirty || title.touched)"
        class="invalid-input"
      >
        title can not be empty
      </div>

      <input
        type="text"
        class="input-control mt-2"
        formControlName="popularity"
        id="movie-popularity"
        placeholder="enter movie popularity"
        autocomplete="off"
      />

      <div
        *ngIf="popularity.invalid && (popularity.dirty || popularity.touched)"
        class="invalid-input"
      >
        <div *ngIf="popularity.errors?.required">
          popularity can not be empty
        </div>
        <div *ngIf="popularity.errors?.forbiddenValue">
          popularity must be numerical
        </div>
      </div>

      <div class="flex-column-container">
        <div class="item">
          <button
            class="btn btn-primary"
            id="save-btn"
            name="save-btn"
            [disabled]="!addMyFaroviteMovieForm.valid"
          >
            save
          </button>
        </div>
      </div>
    </form>
  `,
  styleUrls: ['./add-my-favorite-movie.component.scss'],
})
export class AddMyFavoriteMovieComponent implements OnInit {
  public addMyFaroviteMovieForm = this.fb.group({
    title: ['', Validators.required],
    popularity: [
      '',
      [Validators.required, forbiddenPopularityValidator(/\D+/)],
    ],
  });

  public get title(): any {
    return this.addMyFaroviteMovieForm.get('title');
  }

  public get popularity(): any {
    return this.addMyFaroviteMovieForm.get('popularity');
  }

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const myCustomMovie: Movie = {
      ...this.addMyFaroviteMovieForm.value,
      id: Date.now(),
      release_date: new Date().toISOString(),
      overview: '',
      poster_path: '/wwemzKWzjKYJFfCeiB57q3r4Bcm.png',
      vote_average: 0,
      vote_count: 0,
      favorite: true,
    };

    this.store.dispatch(addMyCustomMovie({ movie: myCustomMovie }));

    this.addMyFaroviteMovieForm.reset();
  }
}
