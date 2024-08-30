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

          switch (response.roleUser) {
            case 'GESTIONNAIRE_MINISTERE':
            case 'SUPER_ADMIN':
              this.router.navigate(['/adminmap']);
              break;
            case 'GESTIONNAIRE_CRE':
              this.router.navigate(['/map'], { queryParams: { codeCre: response.codeCre } });
              break;
            case 'GESTIONNAIRE_ETABLISSEMENT':
              this.router.navigate(['/detailmap']);
              break;
            default:
              Swal.fire({
                icon: 'error',
                title: 'Accès refusé',
                text: 'Votre rôle ne vous permet pas d\'accéder à cette application.',
              });
              return;
          }

          Swal.fire({
            icon: 'success',
            title: 'Connexion réussie',
            text: response.message,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Échec de la connexion',
            text: response.message,
          });
        }
      },
      error: (err: any) => {
        console.error('Erreur lors de la connexion:', err); 
        Swal.fire({
          icon: 'error',
          title: 'Échec de la connexion',
          text: 'Une erreur est survenue. Veuillez réessayer.',
        });
      }
    });
  }
}
