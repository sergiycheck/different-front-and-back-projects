import { moviesInitialState } from './movies.reducer';
import { collectionInitialState } from './collection.reducer';
import { myCustomMoviesInitialState } from './myCustomMovie.reducer';

export interface AppState {
  movies: typeof moviesInitialState;
  collection: typeof collectionInitialState;
  myCustomMovies: typeof myCustomMoviesInitialState;
}
