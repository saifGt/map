import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Etablissement } from './etablissement.model';




@Injectable({
  providedIn: 'root',
})
export class MapBDService {
  readonly API_URL = 'http://localhost:8081';
  private apiUrl = 'http://localhost:3000/save-markers';

  readonly ENDPOINT_MAP = '/api/maps';
  readonly ENDPOINT_DEPENDENCIES = '/api/dependencies';
  readonly ENDPOINT_LOCATION = '/api/location';
  readonly ENDPOINT_CRE = '/api/cre';
  readonly ENDPOINT_ETAB = '/api/etablissement';

  constructor(private httpClient: HttpClient) {}
  getEtablissement(cre: any) : Observable<any> {
    return this.httpClient.get(this.API_URL + this.ENDPOINT_ETAB + `/byCre/${cre}`);
  }

  getMaps(): Observable<any> {
    return this.httpClient.get(this.API_URL + this.ENDPOINT_MAP);
  }

  getDependencies(cre: number): Observable<any> {
    return this.httpClient.get(
      `${this.API_URL}${this.ENDPOINT_DEPENDENCIES}?cre=${cre}`
    );
  }

  addDependency(dependency: any): Observable<any> {
    return this.httpClient.post(
      `${this.API_URL}${this.ENDPOINT_DEPENDENCIES}/new`,
      dependency
    );
  }

  createLocation(location: { lat: number; lng: number }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<any>(
      `${this.API_URL}${this.ENDPOINT_LOCATION}`,
      location,
      { headers }
    );
  }

  getCre(): Observable<any> {
    return this.httpClient.get<any>(`${this.API_URL}${this.ENDPOINT_CRE}`);
  }

  getEtablissementByCre(cre: string): Observable<Etablissement[]> {
    return this.httpClient.get<Etablissement[]>(`${this.API_URL}${this.ENDPOINT_ETAB}/byCre/${cre}`);
  }

  
}
