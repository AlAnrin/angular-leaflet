import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Group} from '../../classes/group';
import {Coordinate} from '../../classes/coordinate';
import * as file from '../../assets/file.json';
import * as L from 'leaflet';
import {BehaviorSubject, fromEvent, merge, Observable, of, pipe, Subject} from 'rxjs';
import {map, mapTo, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-rxjs-app',
  templateUrl: './rxjs-app.component.html',
  styleUrls: ['./rxjs-app.component.css']
})
export class RxjsAppComponent implements OnInit, AfterViewInit, OnDestroy {
  private map;
  zoom = 11;
  markers: any = [];

  title = 'SPb for Xenomorphus';
  token = 'pk.eyJ1IjoiYWxhbnJpbiIsImEiOiJja2s1a3d6NDEwNmRnMm9uNGQ5czB6NGVkIn0.PefIA3KREZSJIF465ZYYFA';

  groups = [...file.data] as Group[];
  $groups = [...file.data];

  selectPoint = new Coordinate(-1);
  selectPoint$: Subject<{coord: Coordinate, group: Group}> = new Subject();

  defaultIcon = L.icon({iconUrl: 'assets/marker-icon.png'});
  selectRedIcon = L.icon({
    iconUrl: 'assets/red-marker.png',
    popupAnchor:  [-3, -30],
    iconSize: [25, 41]
  });

  isDialogShow = false;
  dialogType = 0;
  dialogTitle = '';
  dialogCoordinates = null;
  selectGroup = null;
  newPointName = '';

  constructor() { }

  changeDialogState(): void {
    this.isDialogShow = !this.isDialogShow;
  }

  ngOnInit(): void {
    this.initMap();
  }

  openPopup(marker): void {
    marker.setIcon(this.selectRedIcon);
    marker.openPopup();
    this.map.setView(marker.getLatLng(), this.zoom + 1);
  }

  closePopup(marker): void {
    marker.setIcon(this.defaultIcon);
    marker.closePopup();
  }

  uncheckPrevMarker(): void {
    const group = this.groups.find(x => x.id === this.selectPoint.groupId);
    const prevMarker = group.array.find(x => x.id === this.selectPoint.id);

    if (prevMarker != null) {
      this.closePopup(prevMarker.marker);
    }
  }

  ngAfterViewInit(): void {
    this.selectPoint$.subscribe((data: { coord: Coordinate, group: Group }) => {
      if (this.selectPoint.id === data.coord.id && this.selectPoint.groupId === data.group.id) {
        this.uncheckPrevMarker();
        this.selectPoint = new Coordinate(-1);
      } else {
        const group = this.groups.find(x => x.id === data.group.id);
        const currentMarker = group.array.find(x => x.id === data.coord.id);

        this.openPopup(currentMarker.marker);

        if (this.selectPoint.id !== -1) {
          this.uncheckPrevMarker();
        }

        this.selectPoint = data.coord;
        this.selectPoint.groupId = data.group.id;
      }
    });
  }

  ngOnDestroy(): void {
    this.selectPoint$.unsubscribe();
  }

  getDefaultDatasForDialog(): void {
    this.dialogTitle = '';
    this.dialogCoordinates = null;
    this.selectGroup = null;
    this.newPointName = '';
  }

  openDialogToAddNewPoint(e): void {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    this.dialogType = 0;
    this.getDefaultDatasForDialog();
    this.dialogTitle = 'Добавление новой точки на карту';
    this.dialogCoordinates = [lat, lon];
    this.changeDialogState();
  }

  addNewPoint(): void {
    const newId = this.selectGroup.array[this.selectGroup.array.length - 1].id + 1;
    const newPoint = {
      id: newId,
      groupId: this.selectGroup.id,
      name: this.newPointName,
      coordinates: this.dialogCoordinates
    } as Coordinate;
    this.paintMarker(newPoint, this.selectGroup);
    this.selectGroup.array.push(newPoint);
    this.selectPoint$.next({coord: newPoint, group: this.selectGroup});
    this.changeDialogState();
  }

  paintMarker(coord: Coordinate, group: Group): void {
    const marker = L.marker(coord.coordinates)
      .bindPopup(`Here is: ${coord.name}`)
      .on('click', () => {
        this.selectPoint$.next({coord, group});
      })
      .setIcon(this.defaultIcon)
      .addTo(this.map);
    coord.marker = marker;
  }

  openDialogToDeletePoint(coord, group): void {
    this.dialogType = 1;
    this.getDefaultDatasForDialog();
    this.dialogTitle = 'Вы действительно хотите удалить точку?';
    this.dialogCoordinates = coord;
    this.selectGroup = group;
    this.changeDialogState();
  }

  removePoint(marker, group): void {
    this.deleteMarker(marker);
    group.array.splice(group.array.indexOf(marker), 1);
    this.changeDialogState();
  }

  deleteMarker(marker): void {
    this.map.removeLayer(marker.marker);
    marker.marker = null;
  }

  hiddenGroup(group: Group): void {
    group.hidden = !group.hidden;
    for (const marker of group.array) {
      if (this.selectPoint.id === marker.id && this.selectPoint.groupId === marker.groupId) {
        this.selectPoint$.next({coord: this.selectPoint, group});
      }
      group.hidden ? this.deleteMarker(marker) : this.paintMarker(marker, group);
    }
  }

  paintMarkers(): void {
    for (const group of this.groups) {
      if (!group.hidden) {
        for (const coord of group.array) {
          this.paintMarker(coord, group);
        }
      }
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [59.9398, 30.33],
      zoom: this.zoom
    });

    this.map.on('click', (event) => this.openDialogToAddNewPoint(event));

    const tiles =
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        accessToken: this.token
      });

    tiles.addTo(this.map);

    this.paintMarkers();
  }
}
