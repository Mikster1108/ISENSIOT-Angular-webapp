import {Sensordata} from "./sensordata";

export class Recording {
  private _name: string;
  private _duration_sec: number;
  private _items_found: Sensordata[];
  private _url: string[];

  constructor(name: string, duration_sec: number, items_found: Sensordata[], url: string[]) {
    this._name = name;
    this._duration_sec = duration_sec;
    this._items_found = items_found;
    this._url = url;
  }

  get duration_sec(): number {
    return this._duration_sec;
  }

  set duration_sec(value: number) {
    this._duration_sec = value;
  }

  get items_found(): Sensordata[] {
    return this._items_found;
  }

  set items_found(value: Sensordata[]) {
    this._items_found = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get url(): string[] {
    return this._url;
  }

  set url(value: string[]) {
    this._url = value;
  }
}
