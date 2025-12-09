export enum ACCIDENTAL {
  DOUBLE_FLAT = -2,
  FLAT = -1,
  NATURAL = 0,
  SHARP = 1,
  DOUBLE_SHARP = 2
}

interface AccidentalParams {
  semitones: number
}

export const ACCIDENTALS_NOTATION = ['b', 's']

export const ACCIDENTALS = Object.keys(ACCIDENTAL).filter(p =>
  isNaN(parseInt(p))
)

export class Accidental {
  private _semitones!: ACCIDENTAL;

  constructor (params: AccidentalParams = { semitones: 0 }) {
    this.semitones = params.semitones
  }

  public addSharp (): Accidental {
    switch (this.semitones) {
      case 2:
        throw new Error('Cannot add sharp to a DOUBLE_SHARP.')
      default:
        this.semitones++
    }

    return this
  }

  public addFlat (): Accidental {
    switch (this.semitones) {
      case -2:
        throw new Error('Cannot add flat to a DOUBLE_FLAT.')
      default:
        this.semitones--
    }

    return this
  }

  // getters & setters
  // semitones
  get semitones (): number {
    return this._semitones
  }

  set semitones (semitones: number) {
    if (ACCIDENTAL[semitones] !== undefined) {
      this._semitones = semitones
    } else {
      throw new Error(
        `Couldn't find a semitone with the value ${semitones}. Semitones available : ${Object.keys(ACCIDENTAL).join(', ')}`
      )
    }
  }

  // name
  get name (): string {
    return ACCIDENTAL[this._semitones]
  }

  get SPN (): string {
    return Accidental.toSPN(this)
  }

  static fromString (s: string): Accidental {
    switch (s) {
      case 'b':
      case '♭':
        return new Accidental({
          semitones: -1
        })

      case 'bb':
      case '𝄫':
        return new Accidental({
          semitones: -2
        })

      case 's':
      case '#':
      case '♯':
        return new Accidental({
          semitones: 1
        })

      case '𝄪':
        return new Accidental({
          semitones: 2
        })

      case 'n':
      case '♮':
        return new Accidental({
          semitones: 0
        })

      default:
        throw new Error(`Couldn't find an accidental for this string : ${JSON.stringify(s)}.`)
    }
  }

  /**
   * To Scientific Pitch Notation
   */
  static toSPN (accidental: Accidental): string {
    switch (accidental.name) {
      case 'SHARP':
        return '#'
      case 'FLAT':
        return 'b'
      case 'DOUBLE_SHARP':
        return 'x'
      case 'DOUBLE_FLAT':
        return 'bb'
      case 'NATURAL':
        return ''
      default:
        throw new Error(`Couldn't find SPN for this accidental : ${JSON.stringify(accidental)}.`)
    }
  }

  /**
   * To Scientific Pitch Notation
   */
  static fromSPN (s: string): Accidental {
    return Accidental.fromString(s)
  }
}
