import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

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

  hiddenGroup(group): void {
    this.hiddenGroupEmitter.emit(group);
  }

  deleteCoordinates(coordinate, group): void {
    this.deleteCoordinateFromListEmitter.emit({...coordinate, group_id: group.id});
  }

  changeFilterValue(event): void {
    this.changeFilterValueEmitter.emit(this.filterValue);
  }

  changeSelectPoint(coord, group): void {
    this.selectPointEmitter.emit({...coord, group_id: group.id});
  }
}
