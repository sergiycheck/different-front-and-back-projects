import { Component, OnInit, OnDestroy } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { Movie } from 'src/app/models/models.interface';
import { Store } from '@ngrx/store';
import { retrievedMoviesList } from 'src/app/state/movies.actions';
import { selectMovieIds } from 'src/app/state/movies.selectors';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-movie-list',
  template: `
    <div>
      <ul class="movie-items-list">
        <app-movie-item
          class="col-sm-4"
          *ngFor="let movieId of movieIds"
          [movieId]="movieId"
        ></app-movie-item>
      </ul>
    </div>
  `,
  styleUrls: ['./movie-list.component.scss'],
})
export class MovieListComponent implements OnInit, OnDestroy {
  public movieIds$: Observable<readonly string[]>;
  public movieIds!: readonly Movie['id'][];
  public movieIdSubscription: Subscription;

  constructor(private movieService: MovieService, private store: Store) {
    this.movieIds$ = this.store.select(selectMovieIds);
    this.movieIdSubscription = this.movieIds$.subscribe((movieIds) => {
      this.movieIds = movieIds;
    });
  }

  ngOnInit(): void {
    this.movieService
      .getPopularMoviesList()
      .pipe(
        map((movies) => {
          return movies.map((movie) => ({
            ...movie,
            popularity: `${Math.round(Number(movie.popularity))}`,
            favorite: false,
          }));
        })
      )
      .subscribe((movies) => {
        this.store.dispatch(retrievedMoviesList({ movies }));
      });
  }

  ngOnDestroy(): void {
    this.movieIdSubscription.unsubscribe();
  }
}
