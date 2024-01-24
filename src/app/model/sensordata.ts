export class Sensordata {

  private _timestamp_ms: number;
  private _item_found: string;

  constructor(timestamp_ms: number, item_found: string) {
    this._timestamp_ms = timestamp_ms;
    this._item_found = item_found;
  }


  get timestamp_ms(): number {
    return this._timestamp_ms;
  }

  set timestamp_ms(value: number) {
    this._timestamp_ms = value;
  }

  get item_found(): string {
    return this._item_found;
  }

  set item_found(value: string) {
    this._item_found = value;
  }
}
