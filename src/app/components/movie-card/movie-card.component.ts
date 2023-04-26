import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component';
import { Movie } from '../../models/movie.model';
import { HttpDataService } from '../../services/http-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent implements OnChanges {
  movies: Movie[] = [];
  @Input() movie!: Movie;
  originalMovie: Movie;
  showButtons = false;
  @Output() onUpdate = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Movie>();
  @Output() delete = new EventEmitter<Movie>();

  constructor(private httpDataService: HttpDataService, private snackBar: MatSnackBar, public dialog: MatDialog) {
    this.originalMovie = {
      id: '',
      title: '',
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

  isEditMode = false;
  @Output() onDelete = new EventEmitter<void>();

  showForm() {
    this.isEditMode = true;
  }


  deleteForm() {
    if (confirm('¿Está seguro de que desea eliminar esta película?')) {
      this.httpDataService.deleteItem(this.movie.id).subscribe(
        () => {
          this.onDelete.emit();
        },
        (err) => {
          console.error('Error deleting the movie', err);
        }
      );
    }
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