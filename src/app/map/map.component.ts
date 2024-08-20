import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { MapBDService } from '../map-bd.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map ;
  private creData: any[] = [];
  private bounds: L.LatLngBounds;

  constructor(private mapService: MapBDService, private router: Router) {
    this.bounds = L.latLngBounds(
      L.latLng(30, 7.5),
      L.latLng(37.5, 12)
    );
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    if (!this.map) {
      this.map = L.map('map', {
        center: [36.8064948, 10.1815316],
        zoom: 6,
        maxBounds: this.bounds,
        maxBoundsViscosity: 1.0
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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

      this.mapService.getCre().subscribe(data => {
        this.creData = data;
        this.creData.forEach(cre => {
          const { codeCre, libelleCre, loc } = cre;
          const { lat, lng } = loc;

          if (lat && lng) {
            const leafletMarker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);

            const popupContent = `
              <div class="popup-content">
                <p><strong>${libelleCre}</strong></p>
              </div>
            `;

            const popup = L.popup({
              closeButton: false,
              closeOnClick: false
            }).setContent(popupContent);

            leafletMarker.on('mouseover', () => {
              leafletMarker.bindPopup(popup).openPopup();
            });

            leafletMarker.on('mouseout', () => {
              leafletMarker.closePopup();
            });

            leafletMarker.on('click', () => {
              const markerLatLng = leafletMarker.getLatLng();
              this.map.setView(markerLatLng, 14);

              this.router.navigate(['/detailmap'], {
                queryParams: {
                  lat: markerLatLng.lat.toFixed(4),
                  lng: markerLatLng.lng.toFixed(4),
                  zoom: this.map?.getZoom(),
                  cre: codeCre
                }
              });
            });
          } else {
            console.error('Invalid coordinates for CRE:', cre);
          }
        });
      }, error => {
        console.error('Error loading CRE data:', error);
      });

      this.map.on('moveend', () => this.updateMapState());
      this.map.on('zoomend', () => this.updateMapState());
    } else {
      console.error('The map is already initialized.');
    }
  }

  private updateMapState(): void {
    if (this.map) {
      const center = this.map.getCenter();
      const zoom = this.map.getZoom();
      this.router.navigate([], {
        queryParams: {
          lat: center.lat.toFixed(4),
          lng: center.lng.toFixed(4),
          zoom: zoom
        },
        queryParamsHandling: 'merge'
      });
    }
  }
}
