import {
  Component, Input, OnChanges, OnDestroy, AfterViewInit,
  SimpleChanges, ElementRef, ViewChild
} from '@angular/core';
import * as L from 'leaflet';

// Fix missing marker icons in Leaflet when bundled by Angular
const iconDefault = L.icon({
  iconUrl:       'assets/leaflet/marker-icon.png',
  shadowUrl:     'assets/leaflet/marker-shadow.png',
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconSize:    [25, 41],
  iconAnchor:  [12, 41],
  popupAnchor: [1, -34],
  shadowSize:  [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  template: `<div #mapContainer class="leaflet-map-container"></div>`,
  styles: [`
    .leaflet-map-container {
      width: 100%;
      height: 220px;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #E2E8F0;
    }
  `]
})
export class LeafletMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  @Input() endereco?: {
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };

  private map?: L.Map;
  private marker?: L.Marker;

  ngAfterViewInit(): void {
    this.initMap();
    if (this.endereco) this.geocodeEndereco();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['endereco'] && this.map) this.geocodeEndereco();
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = undefined;
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, { zoomControl: true }).setView([-23.4275, -51.9371], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private geocodeEndereco(): void {
    if (!this.endereco) return;
    const { logradouro, numero, bairro, cidade, estado } = this.endereco;
    const query = [logradouro, numero, bairro, cidade, estado].filter(Boolean).join(', ');
    if (!query) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
      .then(r => r.json())
      .then((results: { lat: string; lon: string }[]) => {
        if (!results.length || !this.map) return;
        const lat = parseFloat(results[0].lat);
        const lon = parseFloat(results[0].lon);
        this.map.setView([lat, lon], 16);
        this.marker?.remove();
        this.marker = L.marker([lat, lon]).addTo(this.map).bindPopup(query).openPopup();
      })
      .catch(() => {});
  }
}
