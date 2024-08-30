import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { MapBDService } from '../map-bd.service';
import { Cre } from '../Cre.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private creData?: Cre;

  constructor(
    private mapService: MapBDService,
    private route: ActivatedRoute,
    private router: Router 
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    if (!this.map) {
      this.map = L.map('map', {
        center: [36.8064948, 10.1815316], 
        zoom: 6
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);

      this.route.queryParams.subscribe(params => {
        const codeCre = params['codeCre'];
        if (codeCre) {
          this.loadCreData(codeCre);
        }
      });
    } else {
      console.error('The map is already initialized.');
    }
  }

  private loadCreData(codeCre: string): void {
    this.mapService.getCodeCre(codeCre).subscribe(
      (cre: Cre) => {
        this.creData = cre;
        this.addCreMarker(cre);
      },
      (error) => {
        console.error('Erreur lors du chargement du CRE:', error);
      }
    );
  }

  private addCreMarker(cre: Cre): void {
    if (cre && cre.loc) {
      const { lat, lng } = cre.loc;

      const marker = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: 'assets/markericone.png',
          iconSize: [20, 20], 
          iconAnchor: [10, 20], 
          popupAnchor: [0, -20], 
        })
      }).addTo(this.map);

      const popupContent = `
        <strong>${cre.libelleCre}</strong><br>
      `;

      marker.bindPopup(popupContent).openPopup();

      marker.on('click', () => {
        this.router.navigate(['/detailmap'], {
          queryParams: {
            lat: lat.toFixed(4),
            lng: lng.toFixed(4),
            zoom: this.map?.getZoom(),
            cre: cre.CodeCre
          }
        });
      });
    } else {
      console.error('Invalid CRE data:', cre);
    }
  }
}
