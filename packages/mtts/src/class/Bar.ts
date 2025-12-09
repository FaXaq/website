import { Rest } from './Rest'
import { Note } from './Note'
import { Chord } from './Chord'
import { SCORE_STAFF } from './Score'
import { TimeSignature } from './TimeSignature'

export declare type BAR_CONTENT = Note | Chord | Rest;

export enum BAR_TYPE_START {
  STANDARD = 'STANDARD',
  DOUBLE = 'DOUBLE',
  REPEAT = 'REPEAT',
  NONE = 'NONE'
}

export enum BAR_TYPE_END {
  STANDARD = 'STANDARD',
  DOUBLE = 'DOUBLE',
  END = 'END',
  REPEAT = 'REPEAT'
}

export interface IBarParams {
  timeSignature?: TimeSignature
  content?: Array<Note | Rest | Chord>
  staff?: SCORE_STAFF
  typeStart?: BAR_TYPE_START
  typeEnd?: BAR_TYPE_END
  autoFill?: boolean
}

export class Bar {
  private _ts!: TimeSignature;
  private _content: BAR_CONTENT[] = [];
  private _staff!: SCORE_STAFF;
  private _typeStart!: BAR_TYPE_START;
  private _typeEnd!: BAR_TYPE_END;
  private _autoFill: boolean = true;

  constructor (params: IBarParams = {}) {
    // setup autofill parameter before content assignation to prevent first autofill
    if (params.autoFill !== undefined) this.autoFill = params.autoFill

    this.timeSignature = params.timeSignature ?? new TimeSignature()
    this.content = params.content ?? []
    this.staff = params.staff ?? SCORE_STAFF.TREBLE
    this.typeStart = params.typeStart ?? BAR_TYPE_START.STANDARD
    this.typeEnd = params.typeEnd ?? BAR_TYPE_END.STANDARD

    if (this.autoFill) this.fillEmptySpace()
  }

  // getters & setters
  get timeSignature (): TimeSignature {
    return this._ts
  }

  set timeSignature (timeSignature: TimeSignature) {
    if (!(timeSignature instanceof TimeSignature)) {
      throw new Error(`Trying to set a bar Time signature with something other than a Time Signature : ${JSON.stringify(timeSignature)}`)
    } else {
      this._ts = timeSignature
    }
  }

  get content (): BAR_CONTENT[] {
    return this._content
  }

  set content (content: BAR_CONTENT[]) {
    if (!Array.isArray(content)) {
      throw new Error(`Tying to set the content of a bar with something else than an array : ${JSON.stringify(content)}`)
    }

    // reset content
    this._content = []

    for (let i = 0; i < content.length; i++) {
      this.addContent(content[i], false)
    }

    if (this.autoFill) {
      this.fillEmptySpace()
    }
  }

  get staff (): SCORE_STAFF {
    return this._staff
  }

  set staff (staff: SCORE_STAFF) {
    this._staff = staff
  }

  get typeStart (): BAR_TYPE_START {
    return this._typeStart
  }

  set typeStart (typeStart: BAR_TYPE_START) {
    this._typeStart = typeStart
  }

  get typeEnd (): BAR_TYPE_END {
    return this._typeEnd
  }

  set typeEnd (typeEnd: BAR_TYPE_END) {
    this._typeEnd = typeEnd
  }

  get autoFill (): boolean {
    return this._autoFill
  }

  set autoFill (autoFill: boolean) {
    this._autoFill = autoFill
  }

  // get the current value of bar
  get value (): number {
    let barValue = 0
    for (let i = 0; i < this.content.length; i++) {
      barValue += this.content[i].dottedValue
    }
    return barValue
  }

  // get expected bar value
  get expectedValue (): number {
    return this.timeSignature.beatsType / this.timeSignature.beats
  }

  // get remaining empty space in bar
  get emptySpace (): number {
    return this.expectedValue - this.value
  }

  addContent (content: BAR_CONTENT, fillEmptySpace: boolean = false): Bar {
    if (this.isFull()) {
      throw new Error('Trying to add content to a bar that is already full. Try modifyContent instead.')
    }

    if (Bar.isBarContent(content)) {
      if (content.value <= this.emptySpace) {
        this._content.push(content)
      } else {
        throw new Error(`Trying to add a content with a note value greater than the remaining space in bar. ${JSON.stringify(content)}`)
      }
    } else {
      throw new Error(`Trying to add a content to a bar that either is not a Note, Chord or Rest or : ${JSON.stringify(content)}`)
    }

    // auto fill empty space in bar
    if (fillEmptySpace) {
      this.fillEmptySpace()
    }

    return this
  }

  // return old content
  modifyContent (contentIndex: number, newContent: BAR_CONTENT): BAR_CONTENT | null {
    if (this.content[contentIndex] !== undefined) {
      // modify it
      this.content[contentIndex] = newContent
      this.content.splice(contentIndex + 1)

      // auto fill empty space in bar
      if (this.autoFill) {
        this.fillEmptySpace()
      }

      return this.content[contentIndex]
    } else {
      throw new Error(`Trying to modify content at index : ${contentIndex} in Bar ${JSON.stringify(this)} with content ${JSON.stringify(this.content)}.`)
    }
  }

  fillEmptySpace (): Bar {
    return Bar.fillEmptySpace(this)
  }

  isFull (): boolean {
    return Bar.isFull(this)
  }

  // fill empty space with rests
  static fillEmptySpace (bar: Bar): Bar {
    if (bar.isFull()) return bar
    // when the bar is not full, fill it with the greater rests starting from the end
    const rests: Rest[] = []
    // calculate sum of rests note_values
    let restsValue = 0
    // while there is remaining space in bar + rests
    while (restsValue < bar.emptySpace) {
      // add largest possible rest
      rests.unshift(Rest.findLargest(bar.emptySpace - restsValue))
      restsValue = rests.map(r => r.value).reduce((p, r) => p + r, 0)
    }

    for (let i = 0; i < rests.length; i++) {
      // add each rest without triggering autoFill
      bar.addContent(rests[i], false)
    }

    return bar
  }

  static isFull (bar: Bar): boolean {
    return bar.value === bar.expectedValue
  }

  static isBarContent (content: any): boolean {
    return content instanceof Note ||
    content instanceof Rest ||
    content instanceof Chord
  }
}
