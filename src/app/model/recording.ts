export class Recording {
  private _id: number;
  private _name: string;
  private _duration_sec: number;

  constructor(id: number, name: string, duration_sec: number) {
    this._id = id;
    this._name = name;
    this._duration_sec = duration_sec;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get duration_sec(): number {
    return this._duration_sec;
  }

  set duration_sec(value: number) {
    this._duration_sec = value;
  }
}
