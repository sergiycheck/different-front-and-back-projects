import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Movie } from '../models/models.interface';

export const selectMovies =
  createFeatureSelector<ReadonlyArray<Movie>>('movies');

export const selectCollectionState =
  createFeatureSelector<ReadonlyArray<string>>('collection');

export const selectMyCustomMoviesState =
  createFeatureSelector<ReadonlyArray<Movie>>('myCustomMovies');

export const selectMovieCollection = createSelector(
  selectMovies,
  selectCollectionState,
  selectMyCustomMoviesState,
  (movies, collection, myCustomMovies) => {
    const favoriteMoviesFromFetchedMovies = collection.map((id) =>
      movies.find((movie) => movie.id === id)
    );

    const favoriteMoviesFromMyCustomMovies = collection.map((id) =>
      myCustomMovies.find((movie) => movie.id === id)
    );

    const resultArr = [
      ...favoriteMoviesFromFetchedMovies,
      ...favoriteMoviesFromMyCustomMovies,
    ].filter((item) => item);
    return resultArr;
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
