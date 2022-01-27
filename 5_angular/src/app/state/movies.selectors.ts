import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Movie } from '../models/models.interface';

export const selectMovies =
  createFeatureSelector<ReadonlyArray<Movie>>('movies');

export const selectCollectionState =
  createFeatureSelector<ReadonlyArray<string>>('collection');

export const selectMovieCollection = createSelector(
  selectMovies,
  selectCollectionState,
  (movies, collection) => {
    return collection.map((id) => movies.find((movie) => movie.id === id));
  }
);

export const selectMovieIds = createSelector(selectMovies, (movies) => {
  const movieIds = movies.map((movie) => movie.id);
  return movieIds;
});

export const selectMovieById = (props: { movieId: string }) => {
  const movieSelector = createSelector(
    selectMovies,
    selectCollectionState,
    (movies, collection) => {
      const foundMovie = movies.find(
        (movie) => movie.id === props.movieId
      ) as Movie;
      const isFavorite = collection.includes(foundMovie.id);

      return {
        ...foundMovie,
        favorite: isFavorite,
      };
    }
  );
  return movieSelector;
};
