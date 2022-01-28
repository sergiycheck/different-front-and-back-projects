import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovieService } from './services/movie.service';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { HeaderComponent } from './components/header/header.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { AboutComponent } from './components/about/about.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FavoriteMovieListComponent } from './components/movie-list/favorite-movie-list/favorite-movie-list.component';
import { MovieItemComponent } from './components/movie-list/movie-item/movie-item.component';
import { StoreModule } from '@ngrx/store';
import { moviesReducer } from './state/movies.reducer';
import { collectionReducer } from './state/collection.reducer';
import { MovieViewExcerptComponent } from './components/movie-list/movie-view-excerpt/movie-view-excerpt.component';
import { CustomdatePipe } from './pipes/customdate.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { AddMyFavoriteMovieComponent } from './components/add-my-favorite-movie/add-my-favorite-movie.component';
import { myCustomMoviesReducer } from './state/myCustomMovie.reducer';
import { metaReducers } from './state/middleware-meta.reducer';
import { ForbiddenPopularityValidatorDirective } from './directives/forbidden-popularity-validator.directive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    MovieListComponent,
    AboutComponent,
    NotFoundComponent,
    FavoriteMovieListComponent,
    MovieItemComponent,
    MovieViewExcerptComponent,
    CustomdatePipe,
    HighlightDirective,
    AddMyFavoriteMovieComponent,
    ForbiddenPopularityValidatorDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot(
      {
        movies: moviesReducer,
        collection: collectionReducer,
        myCustomMovies: myCustomMoviesReducer,
      },
      { metaReducers }
    ),
  ],
  providers: [
    MovieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
