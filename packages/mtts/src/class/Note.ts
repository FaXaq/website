import { Pitch } from './Pitch'
import { Accidental, ACCIDENTAL } from './Accidental'
import { DEFAULT_NOTE_VALUE, NOTE_VALUE } from './NoteValue'
import { ValuedBarContent } from '../super/ValuedBarContent'
import { SEMITONES_WITHIN_OCTAVE } from './Interval'

export const NOTES: string[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
export const BASE_FREQUENCY: number = 440

interface NoteParams {
  name?: string
  pitch?: Pitch
  accidental?: Accidental
  value?: NOTE_VALUE
  dots?: number
}

export class Note extends ValuedBarContent {
  private _name!: string;
  private _pitch!: Pitch;
  private _accidental?: Accidental;

  constructor (params: NoteParams = { name: 'C' }) {
    super(params)
    this.name = params.name ?? 'C'
    this.value = params.value ?? DEFAULT_NOTE_VALUE
    this.pitch = params.pitch ?? new Pitch()
    this.dots = params.dots ?? 0
    if (params.accidental !== undefined) this.accidental = params.accidental
  }

  /**
   * Adds a sharp accidental (if one is already there, adds a second one)
   */
  public addSharp (): Note {
    if (!this.hasAccidental()) {
      this.accidental = new Accidental({ semitones: ACCIDENTAL.SHARP })
    } else {
      this.accidental.addSharp()
    }

    return this
  }

  public sharpenTo (n: number): Note {
    while (n > 0) {
      this.addSharp()
      n--
    }

    return this
  }

  /**
   * Adds a flat to the current note (or flatten the accidental)
   */
  public addFlat (): Note {
    if (!this.hasAccidental()) {
      this.accidental = new Accidental({ semitones: ACCIDENTAL.FLAT })
    } else {
      this.accidental.addFlat()
    }

    return this
  }

  public flattenTo (n: number): Note {
    while (n < 0) {
      this.addFlat()
      n++
    }

    return this
  }

  public next (): Note {
    // if note was B, next one will be a pitch higher
    if (this.name === 'B') this.pitch.inc()
    this.name = NOTES[(this.index + 1) % NOTES.length]!

    return this
  }

  public previous (): Note {
    // if note was C, previous one will be a pitch lower
    if (this.name === 'C') this.pitch.dec()
    this.name = NOTES[(this.index - 1 + NOTES.length) % NOTES.length]!

    return this
  }

  public sharpenChromatically (semitones: number = 1): Note {
    for (let i = 0; i < semitones; i++) {
      if (!this.hasAccidental()) {
        if (this.isBorE()) {
          this.next()
        } else {
          this.addSharp()
        }
      } else {
        if (this.accidental.semitones === -1) {
          this.addSharp()
        } else if (this.isBorE()) {
          this.removeAccidental()
          this.next().addSharp()
        } else {
          this.removeAccidental()
          this.next()
        }
      }
    }

    return this
  }

  public flattenChromatically (semitones: number = 1): Note {
    for (let i = 0; i < semitones; i++) {
      if (!this.hasAccidental()) {
        if (this.isCorF()) {
          this.previous()
        } else {
          this.addFlat()
        }
      } else {
        if (this.accidental.semitones === 1) {
          this.addFlat()
        } else if (this.isCorF()) {
          this.removeAccidental()
          this.previous().addFlat()
        } else {
          this.removeAccidental()
          this.previous()
        }
      }
    }

    return this
  }

  // Get semitones between this note and the one passed as parameter
  public getSemitonesTo (note: Note): number {
    return Note.getSemitonesBetween(this, note)
  }

  public duplicate (): Note {
    return new Note({
      name: this.name,
      pitch: new Pitch({
        value: this.pitch.value
      }),
      accidental: this.accidental !== undefined
        ? new Accidental({ semitones: this.accidental.semitones })
        : undefined
    })
  }

  public removeAccidental (): Note {
    delete this._accidental
    return this
  }

  // checks
  public hasAccidental (): boolean {
    return this._accidental !== undefined
  }

  public isBorE (): boolean {
    return this.name === 'B' || this.name === 'E'
  }

  public isCorF (): boolean {
    return this.name === 'C' || this.name === 'F'
  }

  // getters & setters
  // name
  set name (name: string) {
    if (Note.validateName(name)) {
      this._name = name
    } else {
      throw new Error(
        `Trying to set a name that doesn't exist to a note : ${name}. Possible notes : ${NOTES.join(', ')}`
      )
    }
  }

  get name (): string {
    return this._name
  }

  // pitch
  set pitch (pitch: Pitch) {
    this._pitch = pitch
  }

  get pitch (): Pitch {
    return this._pitch
  }

  // note index
  get index (): number {
    return NOTES.indexOf(this.name)
  }

  // accidental
  set accidental (accidental: Accidental) {
    this._accidental = accidental
  }

  get accidental (): Accidental {
    return this._accidental ?? new Accidental()
  }

  // frequency
  // Base frequency times 2 pow (semitones to A440 / 12)
  get frequency (): number {
    const baseA: Note = new Note({ name: 'A', pitch: new Pitch({ value: 4 }) })
    return BASE_FREQUENCY * Math.pow(2, baseA.getSemitonesTo(this) / 12)
  }

  get SPN (): string {
    return Note.toSPN(this)
  }

  // static methods
  static validateName (name: string): boolean {
    return NOTES.indexOf(name) > -1
  }

  static getSemitonesBetween (note1: Note, note2: Note): number {
    let semitones = 0
    let noteIndex = note1.index

    /* get semitones between two notes (don't care about the pitch or the notes order) */
    while (NOTES[noteIndex] !== note2.name) {
      if (NOTES[noteIndex] === 'B' || NOTES[noteIndex] === 'E') semitones++
      else semitones += 2

      noteIndex = (noteIndex + 1) % NOTES.length
    }

    /* if note1 is previous to note2, substract 12 (octave semitones, since we counted up) to result  */
    if (note2.index < note1.index) semitones -= 12

    /* count octaves and ADD OR SUBSTRACT semitones of octaves difference (12 * octaveDifference) to the result */
    semitones += (note2.pitch.value - note1.pitch.value) * 12

    /* count semitones difference between accidentals */
    semitones +=
      (note2.hasAccidental() ? note2.accidental.semitones : 0) -
      (note1.hasAccidental() ? note1.accidental.semitones : 0)

    return semitones
  }

  /**
   * Get semitones between notes, ALWAYS considering destination note is ABOVE root and within one octave.
   * @param note1 The root from which you want to start counting semitones
   * @param note2 The destination note
   */
  static getNormalizedSemitonesBetween (note1: Note, note2: Note): number {
    let semitones = Note.getSemitonesBetween(note1, note2)
    if (semitones < 0) {
      semitones += SEMITONES_WITHIN_OCTAVE
    } if (semitones > SEMITONES_WITHIN_OCTAVE) {
      semitones = semitones % SEMITONES_WITHIN_OCTAVE
    }
    return semitones
  }

  static getIndexDifferenceBetween (note1: Note, note2: Note): number {
    return 1 + ((note2.index - note1.index + NOTES.length) % NOTES.length)
  }

  /**
   * To Scientific Pitch Notation
   */
  static toSPN (n: Note): string {
    try {
      return `${n.name}${n.hasAccidental() ? n.accidental.SPN : ''}${n.pitch.value}`
    } catch (err) {
      throw new Error(`The note you provided is incorrect. You provided : ${JSON.stringify(n)}.`)
    }
  }

  /**
   * From Scientific Pitch Notation
   */
  static fromSPN (s: string): Note {
    try {
      return new Note({
        name: s[0],
        accidental: s.length > 2 ? Accidental.fromSPN(s.slice(1, s.length - 1)) : undefined,
        pitch: new Pitch({
          value: parseInt(s[s.length - 1]!)
        })
      })
    } catch (err) {
      throw new Error(`The string you provided is not a Scientific Pitch Notation. You provided : ${s}.`)
    }
  }
}
