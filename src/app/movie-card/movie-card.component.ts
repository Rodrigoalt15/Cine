import { Component, Input } from '@angular/core';
import { Movie } from '../models/movie.model';
import { HttpDataService } from '../services/http-data.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {

  @Input() movie: Movie = {
    id: "",
    movieTitle: "",
    imgUrl: "",
    duration: "",
    genre: "",
  };

  isEditMode = false;
  originalMovie: Movie;

  @Input() showButtons: boolean = true;
  constructor(private httpDataService: HttpDataService) {
    this.originalMovie = {
      id: '',
      movieTitle: '',
      imgUrl: '',
      duration: '',
      genre: ''
    };
  }

  enableEditMode(): void {
    this.isEditMode = true;
    this.originalMovie = { ...this.movie };
  }

  disableEditMode(): void {
    this.isEditMode = false;
    this.movie = { ...this.originalMovie };
  }

  onSubmit(): void {
    // Llamar al servicio para actualizar la película
    if (this.movie) {
      this.httpDataService.updateItem(this.movie.id, this.movie).subscribe(
        (updatedMovie) => {
          // Reemplaza la película con los datos actualizados
          this.movie = updatedMovie;
          // Salir del modo de edición
          this.isEditMode = false
        },
        (error) => {
          // Manejar el error según sea necesario
          console.error('Error updating movie:', error);
        }
      );
    }
  }
}