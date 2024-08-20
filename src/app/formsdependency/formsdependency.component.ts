import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapBDService } from '../map-bd.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formsdependency',
  templateUrl: './formsdependency.component.html',
  styleUrls: ['./formsdependency.component.scss']
})
export class FormsdependencyComponent implements OnInit {
  dependencyForm: FormGroup;
  mapEntities: any[] = [];

  constructor(
    private fb: FormBuilder,
    private mapService: MapBDService,
    private router: Router
  ) {
    this.dependencyForm = this.fb.group({
      lng: ['', Validators.required],
      lat: ['', Validators.required],
      title: ['', Validators.required],
      type: ['', Validators.required],
      description: [''],
      cre: ['', Validators.required] 
    });
  }

  ngOnInit(): void {
    this.loadMapEntities();
  }

  loadMapEntities(): void {
    this.mapService.getMaps().subscribe(
      data => {
        this.mapEntities = data;
      },
      error => {
        console.error('Error fetching map entities', error);
      }
    );
  }

  onSubmit(): void {
    if (this.dependencyForm.valid) {
      
      this.mapService.addDependency(this.dependencyForm.value).subscribe(
        response => {
          console.log('Dependency added successfully', response);
          this.router.navigate(['/map']);
        },
        error => {
          console.error('Error adding dependency', error);
        }
      );
    }
  }
}
