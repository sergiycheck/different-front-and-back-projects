import { createReducer, on } from '@ngrx/store';
import {
  addMovie,
  removeMovie,
  addMyCustomMovie,
  removeMyCustomMovie,
} from './movies.actions';

export const collectionInitialState: ReadonlyArray<string> = [];

export const collectionReducer = createReducer(
  collectionInitialState,
  on(removeMovie, (state, { movieId }) => state.filter((id) => id !== movieId)),
  on(removeMyCustomMovie, (state, { movieId }) =>
    state.filter((id) => id !== movieId)
  ),
  on(addMovie, (state, { movieId }) => {
    const movieIsInFavoriteList = Boolean(state.indexOf(movieId) > -1);

    if (movieIsInFavoriteList) {
      return state;
    }

    return [...state, movieId];
  }),
  on(addMyCustomMovie, (state, { movie }) => {
    const movieIsInFavoriteList = Boolean(state.indexOf(movie.id) > -1);

    if (movieIsInFavoriteList) {
      return state;
    }

    return [...state, movie.id];
  })
);
