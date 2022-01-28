import { createReducer, on } from '@ngrx/store';
import { retrievedMoviesList } from './movies.actions';
import { Movie } from '../models/models.interface';

export const moviesInitialState: ReadonlyArray<Movie> = [];

export const moviesReducer = createReducer(
  moviesInitialState,
  on(retrievedMoviesList, (state, { movies }) => movies)
);
