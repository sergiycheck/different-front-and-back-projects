import { environment } from 'src/environments/environment';

export const baseApiRoute = `${environment.BASE_URL}`;
export const imgRoute = `${environment.IMG_URL}`;

export const moviesRoute = `${baseApiRoute}/movie`;

export const movieDetailsRoute = `${moviesRoute}/:movieId`;

export const movieGetPopularRoute = `${moviesRoute}/popular`;
