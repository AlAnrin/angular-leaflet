import { Component } from '@angular/core';
import * as file from '../assets/file.json';
import {DialogService} from './dialog/dialog.service';
import {Group} from './classes/group';
import {Coordinate} from './classes/coordinate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  groups = [...file.data];
  $groups = [...file.data];

  selectPoint = new Coordinate(-1);

  filterValue = '';

  addingNewPointDialogId = 'addingNewPointDialogId';
  deletePointDialogId = 'deletePointDialogId';
  dialogTitle = '';
  dialogCoordinates = null;
  selectGroupForCreate = null;
  newPointName = '';

  constructor(private dialogService: DialogService) { }

  openModal(id: string): void {
    this.dialogService.open(id);
  }

  closeModal(id: string): void {
    this.dialogService.close(id);
    this.getDefaultDatasForDialog();
  }

  getDefaultDatasForDialog(): void {
    this.dialogTitle = '';
    this.dialogCoordinates = null;
    this.selectGroupForCreate = null;
    this.newPointName = '';
  }

  hiddenGroup(group: Group): void {
    group.hidden = !group.hidden;
    const $find = this.$groups.find(x => x.id === group.id);
    $find.hidden = group.hidden;
    this.changeFilterValue(this.filterValue);
  }

  addNewPoint(coordinate: [number, number]): void {
    this.dialogTitle = 'Добавление новой точки на карту';
    this.dialogCoordinates = coordinate;
    this.openModal(this.addingNewPointDialogId);
  }

  createNewPoint(): void {
    const newPoint = {
      id: this.selectGroupForCreate.array[this.selectGroupForCreate.array.length - 1].id + 1,
      name: this.newPointName,
      coordinates: this.dialogCoordinates,
      group_id: this.selectGroupForCreate.id
    };
    this.selectGroupForCreate.array.push(newPoint);
    this.changeFilterValue(this.filterValue);
    this.changeSelectPoint(newPoint);
    this.closeModal(this.addingNewPointDialogId);
  }

  deleteCoordinate(coordinate: [number, number]): void {
    this.dialogTitle = 'Вы действительно хотите удалить точку';
    this.dialogCoordinates = coordinate;
    this.openModal(this.deletePointDialogId);
  }

  deletePoint(): void {
    const group = this.$groups.find(gr => gr.id === this.dialogCoordinates.group_id);
    group.array.splice(group.array.findIndex(x => x.id === this.dialogCoordinates.id), 1);
    this.changeFilterValue(this.filterValue);
    this.closeModal(this.deletePointDialogId);
  }

  changeSelectPoint(newPoint: Coordinate): void {
    this.selectPoint = newPoint;
  }

  changeFilterValue(newFilter): void {
    this.filterValue = newFilter;
    if (newFilter === '') {
      this.groups = [...this.$groups];
    }
    else {
      const newGroups = [];
      for (const group of this.$groups) {
        const filtered = group.array.filter(point =>
          point.name.toLowerCase().indexOf(newFilter.toLowerCase()) != -1);
        if (filtered.length > 0) {
          newGroups.push({...group, array: [...filtered]});
        }
      }
      this.groups = newGroups;
    }
  }
}
