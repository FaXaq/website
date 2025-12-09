import { TimeSignature } from './TimeSignature'
import { Bar, BAR_TYPE_START, BAR_TYPE_END, BAR_CONTENT } from './Bar'
import { Note } from './Note'
import { NOTE_VALUE } from './NoteValue'
import { Scale } from './Scale'

export enum SCORE_STAFF {
  TREBLE = 'TREBLE',
  FRENCH_VIOLIN = 'FRENCH_VIOLIN',
  BASS = 'BASS',
  BARITONE_F = 'BARITONE_F',
  BARITONE_C = 'BARITONE_C',
  SUB_BASS = 'SUB_BASS',
  ALTO = 'ALTO',
  TABLATURE = 'TABLATURE',
  MEZZO_SOPRANO = 'MEZZO_SOPRANO',
  SOPRANO = 'SOPRANO',
  NEUTRAL = 'NEUTRAL'
}

export interface ScoreParams {
  timeSignature?: TimeSignature
  staff?: SCORE_STAFF
  measures?: Bar[]
  keySignature?: Scale
  bars?: Bar[]
}

export class Score {
  private _ts!: TimeSignature;
  private _staff!: SCORE_STAFF;
  private _bars!: Bar[];
  // key signature
  private _ks!: Scale;

  constructor (params: ScoreParams = {}) {
    this.timeSignature = params.timeSignature ?? new TimeSignature({})
    this.staff = params.staff ?? SCORE_STAFF.TREBLE
    this.bars = (params.measures ?? params.bars) ?? []
    this.keySignature = params.keySignature ?? new Scale({
      key: new Note()
    })
  }

  // getters & setters
  get timeSignature (): TimeSignature {
    return this._ts
  }

  set timeSignature (ts: TimeSignature) {
    this._ts = ts
  }

  get staff (): SCORE_STAFF {
    return this._staff
  }

  set staff (staff: SCORE_STAFF) {
    if (Object.keys(SCORE_STAFF).indexOf(staff) > -1) {
      this._staff = staff
    } else {
      throw new Error(`Clef on new score can only be one of ${Object.keys(SCORE_STAFF).join(', ')}, you tried to set it to : ${staff}`)
    }
  }

  get bars (): Bar[] {
    return this._bars
  }

  set bars (bars: Bar[]) {
    this._bars = bars
  }

  get measures (): Bar[] {
    return this._bars
  }

  set measures (measures: Bar[]) {
    this._bars = measures
  }

  get keySignature (): Scale {
    return this._ks
  }

  set keySignature (scale: Scale) {
    this._ks = scale
  }

  get defaultNoteValue (): NOTE_VALUE {
    return this.timeSignature.beatsType
  }

  get lastBar (): Bar {
    if (this.bars.length === 0) {
      throw new Error('Score has no bar.')
    }

    return this.bars[this.bars.length - 1]
  }

  /**
   * Add bar to the current score.
   * @param - No field is mandatory
   */
  addBar ({
    typeStart = BAR_TYPE_START.STANDARD,
    typeEnd = BAR_TYPE_END.STANDARD,
    content = []
  }: { typeStart?: BAR_TYPE_START, typeEnd?: BAR_TYPE_END, content?: BAR_CONTENT[] } = {}): Bar {
    this.bars.push(new Bar({
      timeSignature: this.timeSignature,
      content: content,
      typeStart: typeStart ?? BAR_TYPE_START.STANDARD,
      typeEnd: typeEnd ?? BAR_TYPE_END.STANDARD,
      staff: this.staff
    }))

    return this.lastBar
  }

  addContent (content: BAR_CONTENT): void {
    try {
      this.lastBar.addContent(content, true)
    } catch (err) {
      // if error, it means that the bar is full, add a bar with content to it
      try {
        this.addBar({
          typeStart: BAR_TYPE_START.STANDARD,
          typeEnd: BAR_TYPE_END.STANDARD,
          content: [content]
        })
      } catch (err) {
        throw new Error(`Trying to add content ${JSON.stringify(content)} to Score. ${JSON.stringify(err)}`)
      }
    }
  }

  modifyContent (bar: number, contentIndex: number, newContent: BAR_CONTENT): void {
    try {
      if (this.bars[bar] !== undefined) {
        this.bars[bar].modifyContent(contentIndex, newContent)
      } else {
        throw new Error(`Trying to modify bar number ${bar} in the score. There is no bar at this index.`)
      }
    } catch (err) {
      console.log(err)
    }
  }
}
