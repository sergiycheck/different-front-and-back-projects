import { createReducer, on } from '@ngrx/store';
import { addMyCustomMovie, removeMyCustomMovie } from './movies.actions';
import { Movie } from '../models/models.interface';

export const myCustomMoviesInitialState: ReadonlyArray<Movie> = [];

export const myCustomMoviesReducer = createReducer(
  myCustomMoviesInitialState,
  on(removeMyCustomMovie, (state, { movieId }) =>
    state.filter((movie) => movie.id !== movieId)
  ),
  on(addMyCustomMovie, (state, { movie }) => {
    const movieIsInMyCustomMovieList = Boolean(state.indexOf(movie) > -1);
    if (movieIsInMyCustomMovieList) {
      return state;
    }

    return [...state, movie];
  })
);
