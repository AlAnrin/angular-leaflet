import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Group} from '../classes/group';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() groups;
  @Input() selectPoint;
  @Output() selectPointEmitter = new EventEmitter();

  filterValue: string;
  @Output() changeFilterValueEmitter = new EventEmitter();

  @Output() deleteCoordinateFromListEmitter = new EventEmitter();

  @Output() hiddenGroupEmitter = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  hiddenGroup(group: Group): void {
    this.hiddenGroupEmitter.emit(group);
  }

  deleteCoordinates(coordinate: Coordinates, group: Group): void {
    this.deleteCoordinateFromListEmitter.emit({...coordinate, group_id: group.id});
  }

  changeFilterValue(event): void {
    this.changeFilterValueEmitter.emit(this.filterValue);
  }

  changeSelectPoint(coordinate: Coordinates, group: Group): void {
    this.selectPointEmitter.emit({...coordinate, group_id: group.id});
  }
}
