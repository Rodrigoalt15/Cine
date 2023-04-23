import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';

import { Movie } from '../models/movie.model';
import { HttpDataService } from '../services/http-data.service';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent implements OnChanges {

  editField: string = '';
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
  @Input() cardStyle: string = 'default';
  @Output() onDelete = new EventEmitter<void>();

  constructor(private httpDataService: HttpDataService) {
    this.originalMovie = {
      id: '',
      movieTitle: '',
      imgUrl: '',
      duration: '',
      genre: ''
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movie']) {
      this.originalMovie = { ...this.movie };
    }
  }

  enableEditMode(field: string) {
    this.isEditMode = true;
    this.editField = field;
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

  deleteMovie() {
    if (confirm('¿Está seguro de que desea eliminar esta película?')) {
      console.log('Deleting movie with ID:', this.movie.id);
      this.httpDataService.deleteItem(this.movie.id).subscribe(
        () => {
          this.onDelete.emit();
        },
        (error) => {
          console.error('Error deleting movie:', error);
        }
      );
    }
  }
}
