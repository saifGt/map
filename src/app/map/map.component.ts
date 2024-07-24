import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';  // Import Router
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map: L.Map | undefined;
  private locations: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}  // Inject Router

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    if (!this.map) {
      this.map = L.map('map', {
        center: [36.8064948, 10.1815316],
        zoom: 6
      });
  
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);
  
      const customIcon = L.icon({
        iconUrl: '/assets/markericone.png',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24]
      });
  
      this.http.get<any[]>('assets/locations.json').subscribe(data => {
        this.locations = data;
        this.locations.forEach(location => {
          if (this.map) {
            const { lat, lng, type, ...otherProps } = location;
            const leafletMarker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
  
            const popupContent = Object.keys(otherProps).map(key =>
              `<p><strong>${key}:</strong> ${otherProps[key]}</p>`
            ).join('');
  
            leafletMarker.bindPopup(`
              <div class="popup-content">
                ${popupContent}
              </div>
            `);
  
            leafletMarker.on('mouseover', (e) => {
              const marker = e.target;
              marker.openPopup();
            });
  
            leafletMarker.on('mouseout', (e) => {
              const marker = e.target;
              marker.closePopup();
            });

            leafletMarker.on('click', () => {
              this.router.navigate(['/detailmap'], { queryParams: { lat, lng } });
            });
          }
        });
      });
    } else {
      console.error('La carte n\'est pas initialisée.');
    }
  }
}
