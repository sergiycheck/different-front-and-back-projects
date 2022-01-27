import { createReducer, on } from '@ngrx/store';
import { retrievedMoviesList } from './movies.actions';
import { Movie } from '../models/models.interface';
import { addMovie, removeMovie } from './movies.actions';

export const initialState: ReadonlyArray<Movie> = [];

export const moviesReducer = createReducer(
  initialState,
  on(retrievedMoviesList, (state, { movies }) => movies)
);
