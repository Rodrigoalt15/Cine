import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-dialog',
  templateUrl: './movie-dialog.component.html',
  styleUrls: ['./movie-dialog.component.css']
})
export class MovieDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MovieDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { movie: Movie; mode: 'add' | 'edit' },
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: [this.data.movie.id],
      title: [this.data.movie.title, Validators.required],
      imgUrl: [this.data.movie.imgUrl, Validators.required],
      duration: [this.data.movie.duration, Validators.required],
      genre: [this.data.movie.genre, Validators.required],
    });
  }

  onSubmit(formData: Movie) {
    this.dialogRef.close(formData);
  }

  onCancel() {
    this.dialogRef.close();
  }
}