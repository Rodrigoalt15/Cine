import { Component } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { HttpDataService } from '../../services/http-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddMovieDialogComponent } from '../add-movie-dialog/add-movie-dialog.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent {
  movies: Movie[] = [];
  editMode = false;
  searchText = '';
  pageSize = 12;
  pageIndex = 0;
  filteredMovies: Movie[] = [];

  constructor(private httpDataService: HttpDataService, private snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit() {
    this.getMovies();
  }

  getMovies() {
    this.httpDataService.getList().subscribe((data: any) => {
      this.movies = data.sort((a: Movie, b: Movie) => b.id - a.id);
    });
  }

  deleteMovie(index: number) {
    this.movies.splice(index, 1);
    this.snackBar.open('Película eliminada con exito', '', {
      duration: 3000,
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  addNewMovie() {
    const dialogRef = this.dialog.open(AddMovieDialogComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.httpDataService.createItem(result).subscribe(
          (newMovie: Movie) => {
            this.movies.unshift(newMovie);
            this.snackBar.open('Película agregada', '', {
              duration: 3000,
            });
          },
          (error) => {
            console.error('Error al agregar película:', error);
          }
        );
      }
    });
  }

  getFilteredMovies(): Movie[] {
    if (!this.searchText) {
      return this.movies.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
    }
    this.filteredMovies = this.movies.filter((movie) => movie.movieTitle.toLowerCase().includes(this.searchText.toLowerCase()));
    return this.filteredMovies.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }

  pageChanged(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getPaginatorLength(): number {
    return this.searchText ? this.filteredMovies.length : this.movies.length;
  }
}
