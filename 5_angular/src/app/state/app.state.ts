import { Movie } from '../models/models.interface';

export interface AppState {
  movies: ReadonlyArray<Movie>;
  collection: ReadonlyArray<string>;
}
