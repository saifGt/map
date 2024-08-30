import { Injectable } from "@angular/core";
import { Class } from "leaflet";

import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoginResponseDto } from "./LoginResponseDto";



@Injectable({
    providedIn :'root',
})

export class AuthenticationService {

    readonly API_URL = 'http://localhost:8081';
    readonly API_AG = '/api/auth';

    constructor(private http: HttpClient) { }

  login(identifiant: string, motDePasse: string): Observable<LoginResponseDto> {
    const loginRequest = {
      identifiant: identifiant,
      motDePasse: motDePasse
    };

    return this.http.post<LoginResponseDto>(`${this.API_URL}${this.API_AG}/login`, loginRequest);
  }

}
    
