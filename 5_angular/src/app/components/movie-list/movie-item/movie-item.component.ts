import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { imgRoute } from '../../../api/api-routes';
import { Movie } from '../../../models/models.interface';
import { addMovie, removeMovie } from '../../../state/movies.actions';
import { Observable, Subscription } from 'rxjs';
import { selectMovieById } from 'src/app/state/movies.selectors';

@Component({
  selector: 'app-movie-item',
  template: `
    <app-movie-view-excerpt
      *ngIf="movie"
      [movie]="movie"
      (buttonClickHandler)="addMovieToFavoriteList($event)"
      [buttonHandlerText]="buttonText"
    ></app-movie-view-excerpt>
  `,
})
export class MovieItemComponent implements OnInit, OnChanges, OnDestroy {
  public imageRoute = imgRoute;
  @Input() movieId!: Movie['id'];

  private removeFromFavoriteMovieText = 'remove from favorite';
  private addToFavoriteMovieText = 'add to favorite';

  public buttonText!: string;

  public movie$?: Observable<Movie | undefined>;
  public movie!: Movie;
  private movieSubscription!: Subscription;

  private firstChangeToSubscribeToSelectMovies = false;
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.buttonText =
      this.movie && this.movie.favorite
        ? this.removeFromFavoriteMovieText
        : this.addToFavoriteMovieText;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.firstChangeToSubscribeToSelectMovies) {
      this.selectMovie();
      this.firstChangeToSubscribeToSelectMovies = true;
    }
  }

  private selectMovie(): void {
    this.movie$ = this.store.select(selectMovieById({ movieId: this.movieId }));

    this.movieSubscription = this.movie$.subscribe((movie) => {
      this.movie = movie as Movie;
    });
  }

  addMovieToFavoriteList(movie: Movie): void {
    if (this.movie && !this.movie.favorite) {
      this.store.dispatch(addMovie({ movieId: movie.id }));
      this.buttonText = this.removeFromFavoriteMovieText;
    } else {
      this.store.dispatch(removeMovie({ movieId: movie.id }));
      this.buttonText = this.addToFavoriteMovieText;
    }
  }

  ngOnDestroy(): void {
    this.movieSubscription.unsubscribe();
  }
}
