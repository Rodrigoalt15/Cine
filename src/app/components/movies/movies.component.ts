import { Component } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { HttpDataService } from '../../services/http-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component';


@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent {
  movies: Movie[] = []; // lista de películas
  searchText = ''; // texto de búsqueda
  pageSize = 12; // número de elementos por página
  pageIndex = 0; // índice de la página actual
  filteredMovies: Movie[] = []; // lista de películas filtradas
  isCardView = false;

  constructor(
    private httpDataService: HttpDataService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  // se llama una vez que se ha inicializado el componente
  ngOnInit() {
    this.getMovies(); // obtiene la lista de películas desde el servidor
  }

  toggleView() {
    this.isCardView = !this.isCardView;
  }

  // obtiene la lista de películas desde el servidor y las ordena por su ID de manera descendente
  getMovies() {
    this.httpDataService.getList().subscribe((data: any) => {
      this.movies = data.sort((a: Movie, b: Movie) => b.id - a.id);
    });
  }

  // elimina una película de la lista en base a su índice
  deleteMovie(movie: Movie) {
    if (confirm('¿Está seguro de que desea eliminar esta película?')) {
      const index = this.movies.indexOf(movie);
      this.movies.splice(index, 1);
      this.httpDataService.deleteItem(movie.id).subscribe(() => {
        this.snackBar.open('Película eliminada con éxito', '', {
          duration: 3000,
        });
      });
    }
  }


  // abre un cuadro de diálogo para agregar una nueva película
  addNewMovie() {
    const newMovie: Movie = {
      id: '',
      title: '',
      imgUrl: '',
      duration: '',
      genre: '',
    };

    const dialogRef = this.dialog.open(MovieDialogComponent, {
      width: '450px',
      data: { movie: newMovie, mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result: Movie) => {
      if (result) {
        // envía la nueva película al servidor para ser agregada
        this.httpDataService.createItem(result).subscribe(
          (newMovie: Movie) => {
            // agrega la nueva película al inicio de la lista
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

  // filtra la lista de películas en base al texto de búsqueda y devuelve una lista paginada
  getFilteredMovies(): Movie[] {
    if (!this.searchText) {
      // si no hay texto de búsqueda, devuelve la lista completa paginada
      return this.movies.slice(
        this.pageIndex * this.pageSize,
        (this.pageIndex + 1) * this.pageSize
      );
    } else {
      // si hay texto de búsqueda, filtra la lista de películas por su título y luego devuelve una lista paginada
      this.filteredMovies = this.movies.filter((movie) =>
        movie.title.toLowerCase().includes(this.searchText.toLowerCase())
      );
      const start = this.pageIndex * this.pageSize;
      const end = (this.pageIndex + 1) * this.pageSize;
      return this.filteredMovies.slice(
        start > this.filteredMovies.length ? 0 : start,
        end > this.filteredMovies.length ? this.filteredMovies.length : end);
    }
  }

  pageChanged(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getPaginatorLength(): number {
    return this.searchText ? this.filteredMovies.length : this.movies.length;
  }

  editMovie(movie: Movie) {
    const dialogRef = this.dialog.open(MovieDialogComponent, {
      width: '450px',
      data: { movie: movie, mode: 'edit' },
    });

    dialogRef.afterClosed().subscribe((result: Movie) => {
      if (result) {
        // actualiza la película en la lista y en el servidor
        this.httpDataService.updateItem(result.id, result).subscribe(
          (updatedMovie: Movie) => {
            const index = this.movies.findIndex(m => m.id === updatedMovie.id);
            this.movies[index] = updatedMovie;
            this.snackBar.open('Película actualizada', '', {
              duration: 3000,
            });
          },
          (error) => {
            console.error('Error al actualizar película:', error);
          }
        );
      }
    });
  }
}
