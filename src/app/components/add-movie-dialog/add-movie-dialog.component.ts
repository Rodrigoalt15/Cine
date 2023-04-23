import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-add-movie-dialog',
  templateUrl: './add-movie-dialog.component.html',
})
export class AddMovieDialogComponent {
  movie: Movie = {
    id: '',
    movieTitle: '',
    imgUrl: '',
    duration: '',
    genre: '',
  };

  constructor(
    public dialogRef: MatDialogRef<AddMovieDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.movie);
  }
}