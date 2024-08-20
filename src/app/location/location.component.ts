import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapBDService } from '../map-bd.service'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  markers: Array<{ lat: number, lng: number }> = [];
  myfrugalmap!: L.Map;
  currentMarker!: L.Marker;
  locationName: string = ''; 

  constructor(private mapBDService: MapBDService) {}

  ngOnInit() {
    this.myfrugalmap = L.map('frugalmap').setView([36.8064948, 10.1815316], 6);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Frugal Map'
    }).addTo(this.myfrugalmap);

    this.myfrugalmap.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (this.currentMarker) {
        this.myfrugalmap.removeLayer(this.currentMarker);
      }

      this.markers = [{ lat, lng }];

      this.currentMarker = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png',
          iconSize: [16, 26], 
          iconAnchor: [8, 26], 
          popupAnchor: [1, -20], 
          shadowSize: [26, 26] 
        })
      }).addTo(this.myfrugalmap);

      this.currentMarker.bindPopup(`Marker at ${lat}, ${lng}`).openPopup();

      this.currentMarker.on('dblclick', () => {
        this.myfrugalmap.removeLayer(this.currentMarker);
        this.markers = [];
      });
    });
  }

  saveMarkers() {
    if (this.markers.length > 0 && this.locationName.trim()) {
      const location = {
        lat: this.markers[0].lat,
        lng: this.markers[0].lng,
        name: this.locationName 
      };
      this.mapBDService.createLocation(location).subscribe(
        response => {
          alert('Location saved successfully!');
          this.markers = [];
          this.locationName = ''; 
          if (this.currentMarker) {
            this.myfrugalmap.removeLayer(this.currentMarker);
            this.currentMarker = null!;
          }
        },
        error => {
          alert('Failed to save location.');
          console.error('Error saving location:', error);
        }
      );
    } else {
      alert('Please provide a location name and select a marker to save!');
    }
  }

  retrieveMarkersFromLocalStorage() {
    const json = localStorage.getItem('markers');
    if (json) {
      this.markers = JSON.parse(json);
    }
  }
}
