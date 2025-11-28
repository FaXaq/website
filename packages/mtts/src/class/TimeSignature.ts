export enum BEATS_TYPE {
  WHOLE_NOTE = 1,
  HALF_NOTE = 2,
  QUARTER_NOTE = 4,
  EIGHT_NOTE = 8
}

export interface TimeSignatureParams {
  beats?: number
  beatsType?: number
}

export class TimeSignature {
  private _beats!: number;
  private _beatsType!: BEATS_TYPE;

  constructor (params: TimeSignatureParams = {}) {
    this.beats = params.beats ?? 4
    this.beatsType = params.beatsType ?? BEATS_TYPE.QUARTER_NOTE
  }

  // getters & setters
  set beats (beats: number) {
    this._beats = beats
  }

  get beats (): number {
    return this._beats
  }

  set beatsType (beatsType: number) {
    this._beatsType = beatsType
  }

  get beatsType (): number {
    return this._beatsType
  }
}
