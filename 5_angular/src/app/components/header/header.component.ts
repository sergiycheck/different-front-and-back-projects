import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <nav>
      <ul>
        <li>
          <a routerLink="/home" routerLinkActive="active">Home</a>
        </li>
        <li>
          <a routerLink="/popular-movies" routerLinkActive="active"
            >Popular movies</a
          >
        </li>
        <li>
          <a routerLink="/about" routerLinkActive="active">About</a>
        </li>
      </ul>
    </nav>
  `,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
