import { Component, OnInit } from '@angular/core';
import { MapBDService } from '../map-bd.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginResponseDto } from '../LoginResponseDto';

@Component({
  selector: 'app-user-log',
  templateUrl: './user-log.component.html',
  styleUrls: ['./user-log.component.scss'],
  providers: [MapBDService]
})
export class UserLogComponent implements OnInit {
  userForm!: FormGroup;

  constructor(
    private authService: MapBDService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      identifiant: [''],
      password: ['']
    });
  }

  onSubmit(): void {
    this.authService.login(this.userForm.get('identifiant')?.value, this.userForm.get('password')?.value).subscribe({
      next: (response: LoginResponseDto) => {
        if (response.connected) {
          localStorage.setItem('token', 'your-token'); 

          this.router.navigate(['/map'], { queryParams: { codeCre: response.codeCre } });

          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: response.message,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: response.message,
          });
        }
      },
      error: (err: any) => {
        console.error('Login error:', err); 
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'An error occurred. Please try again.',
        });
      }
    });
  }
}
