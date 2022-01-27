import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Movie } from 'src/app/models/models.interface';
import { selectMovieCollection } from 'src/app/state/movies.selectors';
import { removeMovie } from 'src/app/state/movies.actions';
import { imgRoute } from 'src/app/api/api-routes';

@Component({
  selector: 'app-favorite-movie-list',
  template: `
    <div>
      <ul class="favorite-movie-list">
        <app-movie-view-excerpt
          *ngFor="let movie of favoriteMovies"
          [movie]="movie"
          (buttonClickHandler)="onRemove($event)"
          [buttonHandlerText]="buttonText"
        ></app-movie-view-excerpt>
      </ul>
    </div>
  `,
})
export class FavoriteMovieListComponent implements OnInit, OnDestroy {
  public movieCollection$: any;
  public favoriteMovies: Movie[] = [];
  public imageRoute = imgRoute;
  private subscription: any = null;
  public buttonText = 'remove from favorites';

  constructor(private store: Store) {
    this.movieCollection$ = this.store.select(selectMovieCollection);
  }

  onRemove(movie: Movie): void {
    this.store.dispatch(removeMovie({ movieId: movie.id }));
  }

  ngOnInit(): void {
    this.subscription = this.movieCollection$.subscribe((movies: Movie[]) => {
      this.favoriteMovies = movies;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
