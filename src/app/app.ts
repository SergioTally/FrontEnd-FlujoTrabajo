import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  showNavbar = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !['/login'].includes(event.urlAfterRedirects);
      }
    });
  }
}
