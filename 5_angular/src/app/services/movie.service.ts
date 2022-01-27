import { movieDetailsRoute, movieGetPopularRoute } from '../api/api-routes';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movie, ApiResponse } from '../models/models.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MovieService {
  constructor(private httpClient: HttpClient) {}

  private getParameterLessRequest<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(url);
  }

  public getMovie(movieId: number): Observable<Movie> {
    const url = `${movieDetailsRoute.replace(':movieId', `${movieId}`)}`;
    return this.httpClient.get<Movie>(url);
  }

  public getPopularMoviesFullResponse(): Observable<ApiResponse> {
    return this.getParameterLessRequest<ApiResponse>(movieGetPopularRoute);
  }

  public getPopularMoviesList(): Observable<Array<Movie>> {
    return this.getParameterLessRequest<ApiResponse>(movieGetPopularRoute).pipe(
      map((response) => (response.results as Movie[]) || [])
    );
  }
}
