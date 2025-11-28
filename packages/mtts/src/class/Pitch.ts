interface PitchParams {
  value: number
}

export class Pitch {
  private _value!: number;

  constructor (params: PitchParams = { value: 4 }) {
    this.value = params.value
  }

  public inc (): void {
    this.value++
  }

  public dec (): void {
    this.value--
  }

  // getters & setters
  get value (): number {
    return this._value
  }

  set value (value: number) {
    if (value > -1) {
      this._value = value
    } else {
      throw new Error(`Trying to set a negative pitch : ${value}`)
    }
  }
}
