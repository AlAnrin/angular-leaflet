export class Coordinate {
  id: number;
  name: string;
  coordinates: [number, number];
  groupId: number;
  marker: any;

  constructor(id) {
    this.id = id;
  }
}
