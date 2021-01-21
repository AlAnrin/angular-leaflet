import { Component } from '@angular/core';
import * as file from '../assets/file.json';
import {DialogService} from './dialog/dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'proteus-test';
  groups = [...file.data];
  $groups = [...file.data];

  selectPoint = {id: -1};

  filterValue = '';

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
  }

  getDefaultDatasForDialog(): void {
    this.dialogTitle = '';
    this.dialogCoordinates = null;
    this.selectGroupForCreate = null;
    this.newPointName = '';
  }

  // Сделать пагинацию для списка объектов.
  // Написать тесты.

  hiddenGroup(group): void {
    group.hidden = !group.hidden;
    this.changeFilterValue(this.filterValue);
  }

  addNewPoint(coordinate): void {
    this.dialogTitle = 'Добавление новой точки на карту';
    this.dialogCoordinates = coordinate;
    this.openModal('custom-modal-1');
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
    this.closeModal('custom-modal-1');
    this.getDefaultDatasForDialog();
  }

  deleteCoordinate(coordinate): void {
    this.dialogTitle = 'Вы действительно хотите удалить точку';
    this.dialogCoordinates = coordinate;
    this.openModal('custom-modal-2');
  }

  deletePoint(): void {
    const group = this.$groups.find(gr => gr.id === this.dialogCoordinates.group_id);
    group.array.splice(group.array.findIndex(x => x.id === this.dialogCoordinates.id), 1);
    this.changeFilterValue(this.filterValue);
    this.closeModal('custom-modal-2');
    this.getDefaultDatasForDialog();
  }

  changeSelectPoint(newPoint): void {
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
