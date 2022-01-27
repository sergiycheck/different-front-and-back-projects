import { createReducer, on } from '@ngrx/store';
import { addMovie, removeMovie } from './movies.actions';

export const initialState: ReadonlyArray<string> = [];

export const collectionReducer = createReducer(
  initialState,
  on(removeMovie, (state, { movieId }) => state.filter((id) => id !== movieId)),
  on(addMovie, (state, { movieId }) => {
    const movieIsInFavoriteList = Boolean(state.indexOf(movieId) > -1);

    if (movieIsInFavoriteList) {
      return state;
    }

    return [...state, movieId];
  })
);
