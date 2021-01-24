export class Coordinate {
  id: number;
  name: string;
  coordinates: [number, number];
  group_id: number;

  constructor(id) {
    this.id = id;
  }
}
