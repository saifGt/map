import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { MapBDService } from '../map-bd.service';
import { Etablissement } from '../etablissement.model';

@Component({
  selector: 'app-detailmap',
  templateUrl: './detailmap.component.html',
  styleUrls: ['./detailmap.component.scss'],
})
export class DetailmapComponent implements OnInit {
  private map!: L.Map;
  etablissements: Etablissement[] = [];
  locationName: string = ''; // Variable pour le nom de la localisation
  currentMarker?: L.Marker;

  constructor(
    private route: ActivatedRoute,
    private mapService: MapBDService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const lat = parseFloat(params['lat']);
      const lng = parseFloat(params['lng']);
      const zoom = parseInt(params['zoom'], 10);
      const creId = params['cre'];
      this.initMap(lat, lng, zoom);
      this.loadEtablissements(creId.toString());
    });
  }

  private initMap(lat: number, lng: number, zoom: number): void {
    if (!this.map) {
      this.map = L.map('detailmap', {
        center: [lat, lng],
        zoom: zoom,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.map);

      this.map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        if (this.currentMarker) {
          this.map.removeLayer(this.currentMarker);
        }

        this.currentMarker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -41],
          })
        }).addTo(this.map);

        this.currentMarker.bindPopup(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`).openPopup();

        this.currentMarker.on('dblclick', () => {
          if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker);
            this.currentMarker = undefined; 
          }
        });
      });
    }
  }

  private loadEtablissements(creId: string): void {
    this.mapService.getEtablissementByCre(creId).subscribe(
      (etablissements: Etablissement[]) => {
        this.etablissements = etablissements;
        this.addEtablissementMarkers(etablissements);
      },
      (error) => {
        console.error('Erreur lors du chargement des établissements:', error);
      }
    );
  }

  private addEtablissementMarkers(etablissements: Etablissement[]): void {
    etablissements.forEach((etablissement) => {
      const { lat, lng } = etablissement.loc;
      let iconUrl: string;

      switch (etablissement.typeFoyer) {
        case 'lycee':
          iconUrl = 'assets/lycee.png';
          break;
        case 'ecole':
          iconUrl = 'assets/ecole.png';
          break;
        default:
          iconUrl = 'assets/default.png';
      }

      const icon = L.icon({
        iconUrl: iconUrl,
        iconSize: [27, 27],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([lat, lng], { icon: icon }).addTo(this.map);
      const popupContent = `
        <strong>${etablissement.libelleEtablissement}</strong><br>
        <b>Code Etablissement:</b> ${etablissement.codeEtablissement}<br>
        <b>Type:</b> ${etablissement.typeFoyer}<br>
        <b>Actif:</b> ${etablissement.actif}<br>
        <b>Flag Pédagogique:</b> ${etablissement.flgPedagogique}
      `;

      marker.bindPopup(popupContent).openPopup();
    });
  }

  saveLocation(): void {
    if (this.currentMarker && this.locationName.trim()) {
      const { lat, lng } = this.currentMarker.getLatLng();

      const location = {
        lat: lat,
        lng: lng,
        name: this.locationName,
      };

      this.mapService.createLocation(location).subscribe(
        response => {
          alert('Location saved successfully!');
          this.locationName = ''; 
          this.map.removeLayer(this.currentMarker!);
          this.currentMarker = undefined;
        },
        error => {
          alert('Failed to save location.');
          console.error('Error saving location:', error);
        }
      );
    } else {
      alert('Please provide a location name and click on the map to select a location!');
    }
  }
}
