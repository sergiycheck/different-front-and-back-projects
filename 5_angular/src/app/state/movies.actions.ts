import { createAction, props } from '@ngrx/store';
import { Movie } from '../models/models.interface';

export const addMovie = createAction(
  '[Movie List] Add Movie',
  props<{ movieId: string }>()
);

export const removeMovie = createAction(
  '[Movie Collection] Remove Movie',
  props<{ movieId: string }>()
);

export const retrievedMoviesList = createAction(
  '[Movie List/API] Retrive Movie Success',
  props<{ movies: ReadonlyArray<Movie> }>()
);

export const addMyCustomMovie = createAction(
  '[MyCustomMovie List] Add Movie',
  props<{ movie: Movie }>()
);

export const removeMyCustomMovie = createAction(
  '[MyCustomMovie List] Remove Movie',
  props<{ movieId: string }>()
);
