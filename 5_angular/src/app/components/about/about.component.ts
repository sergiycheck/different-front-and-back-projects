import { Component, OnInit } from '@angular/core';
import { baseApiRoute } from 'src/app/api/api-routes';

@Component({
  selector: 'app-about',
  template: `
    <div>
      <h1>This app uses <a [href]="baseApiRoute">api</a></h1>
      <p>The app makes request to the api and gets response</p>
      <p>
        On the popular movies tab we have a list of the current popular movies
        on <a href="https://www.themoviedb.org/movie">TMDB</a> page
      </p>
    </div>
  `,
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  public baseApiRoute = baseApiRoute;

  constructor() {}

  ngOnInit(): void {}
}
