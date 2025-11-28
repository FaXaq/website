import { DEFAULT_NOTE_VALUE, NOTE_VALUE } from '../class/NoteValue'

export interface IValuedBarContentParams {
  value?: NOTE_VALUE
  dots?: number
}

export class ValuedBarContent {
  private _value!: NOTE_VALUE;
  private _dots!: number;

  constructor (params: IValuedBarContentParams = {}) {
    this.value = params.value ?? DEFAULT_NOTE_VALUE
    this.dots = params.dots ?? 0
  }

  // getters & setters
  set value (value: NOTE_VALUE) {
    this._value = value
  }

  get value (): NOTE_VALUE {
    return this._value
  }

  set dots (dots: number) {
    this._dots = dots
  }

  get dots (): number {
    return this._dots
  }

  get dottedValue (): number {
    return this.value + (this.value / 2) * this.dots
  }
}
