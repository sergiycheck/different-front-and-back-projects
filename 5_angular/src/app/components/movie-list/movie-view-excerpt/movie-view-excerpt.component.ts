import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Movie } from 'src/app/models/models.interface';
import { imgRoute } from 'src/app/api/api-routes';

@Component({
  selector: 'app-movie-view-excerpt',
  template: `
    <li [appHighlight]="scaleValue" class="movie-item">
      <div class="movie-content">
        <div class="movie-info">
          <h3>{{ movie.title | uppercase }}</h3>
          <p>released {{ movie.release_date | customdate }}</p>
          <p>popularity {{ movie.popularity }}</p>

          <div class="movie-bottom-side">
            <div class="img-container">
              <img [src]="imageRoute + movie.poster_path" [alt]="movie.title" />
            </div>
            <div class="movie-actions">
              <button (click)="buttonClickHandler.emit(movie)">
                {{ buttonHandlerText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  `,
  styleUrls: ['./movie-view-excerpt.component.scss'],
})
export class MovieViewExcerptComponent implements OnInit {
  @Input() movie!: Movie;
  public imageRoute = imgRoute;
  @Output() buttonClickHandler = new EventEmitter<Movie>();
  @Input() buttonHandlerText = '';
  public scaleValue = 1.05;

  constructor() {}

  ngOnInit(): void {}
}
