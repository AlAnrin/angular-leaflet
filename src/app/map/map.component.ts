import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {
  private map;
  zoom = 11;
  markers: any;

  @Input() groups;
  @Input() selectPoint;

  @Output() selectPointEmitter = new EventEmitter();

  @Output() addPointEmitter = new EventEmitter();

  token = 'pk.eyJ1IjoiYWxhbnJpbiIsImEiOiJja2s1a3d6NDEwNmRnMm9uNGQ5czB6NGVkIn0.PefIA3KREZSJIF465ZYYFA';

  defaultIcon = L.icon({iconUrl: 'assets/marker-icon.png'});
  greenIcon = L.icon({
    iconUrl: 'assets/red-marker.png',
    popupAnchor:  [-3, -41] // point from which the popup should open relative to the iconAnchor
  });

  constructor() {
    this.markers = [];
  }

  changeSelectPoint(coord, group): void {
    this.selectPointEmitter.emit({...coord, group_id: group.id});
  }

  addNewPoint(e): void {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    this.addPointEmitter.emit([lat, lon]);
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [59.9398, 30.33],
      zoom: this.zoom
    });

    this.map.on('click', (event) => this.addNewPoint(event));

    const tiles =
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        accessToken: this.token
      });

    tiles.addTo(this.map);

    this.paintMarkers(this.groups);
  }

  private deleteMarkers(markers): void {
    for (const marker of markers) {
      this.map.removeLayer(marker.marker);
    }
  }

  private paintMarkers(groups): void {
    for (const group of groups) {
      if (!group.hidden) {
        for (const coord of group.array) {
          if (this.markers.find(x => x.id === coord.id && x.group_id == group.id) == null) {
            const marker = L.marker(coord.coordinates).addTo(this.map)
              .on('click', () => this.changeSelectPoint(coord, group));
            marker.setIcon(this.defaultIcon);
            marker.bindPopup(`Here is: ${coord.name}`);
            this.markers.push({id: coord.id, group_id: group.id, marker});
          }
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groups != null) {
      if (this.map != null) {
        const checkedMarkers = [];
        const deleteMarkers = [];
        for (const marker of this.markers) {
          const group = this.groups.find(gr => gr.id === marker.group_id);
          if (group != null) {
            const check = group.array.find(coord => coord.id === marker.id);
            if (check == null || group.hidden) {
              deleteMarkers.push(marker);
            }
            else {
              checkedMarkers.push(marker);
            }
          }
          else deleteMarkers.push(marker);
        }
        this.deleteMarkers(deleteMarkers);
        this.markers = [...checkedMarkers];

        const newCoordinates = this.groups.filter(group => {
          const filtered = group.array.filter(coord => {
            const findInMarkers = checkedMarkers.find(x =>
              x.id === coord.id && x.group_id === group.id);
            return findInMarkers != null;
          });
          return filtered.length != group.array.length;
        });

        this.paintMarkers(newCoordinates);

        if (this.selectPoint.id != -1) {
          const findingSelectMarker = this.markers.find(x =>
            x.id === this.selectPoint.id && x.group_id === this.selectPoint.group_id);
          if (findingSelectMarker == null) {
            this.selectPointEmitter.emit({id: -1});
          }
        }
      }
    }

    if (changes.selectPoint != null) {
      const currentMarker = this.markers.find(x =>
        x.id === changes.selectPoint.currentValue.id && x.group_id === changes.selectPoint.currentValue.group_id);
      const prevMarker = this.markers.find(x =>
        x.id === changes.selectPoint.previousValue.id && x.group_id === changes.selectPoint.previousValue.group_id);
      if (currentMarker != null) {
        currentMarker.marker.setIcon(this.greenIcon);
        currentMarker.marker.openPopup();
        this.map.setView(currentMarker.marker.getLatLng(), this.zoom + 1);
      }
      if (prevMarker != null) {
        prevMarker.marker.setIcon(this.defaultIcon);
        prevMarker.marker.closePopup();
      }
    }
  }

  public ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
