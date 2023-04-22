import { Component } from '@angular/core';
import { HttpDataService } from '../services/http-data.service';
import { Movie } from '../models/movie.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  movies: Movie[] = [];

  constructor(private httpDataService: HttpDataService) { }

  ngOnInit() {
    this.getMovies();
  }

  getMovies() {
    this.httpDataService.getList().subscribe((data: any) => {
      this.movies = data.sort((a: Movie, b: Movie) => b.id - a.id).slice(0, 4);
    });
  }
}
