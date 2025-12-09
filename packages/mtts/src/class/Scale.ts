import { Note } from './Note'
import { Interval } from './Interval'
import { Chord } from './Chord'

interface IScaleDefinition {
  name?: string
  mode?: string
  arpeggio?: boolean
  intervals: Interval[]
}

export const SCALES = {
  MAJOR: {
    name: 'major',
    mode: 'ionian',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('M3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('M6'),
      new Interval('M7')
    ]
  },
  ACOUSTIC: {
    name: 'acoustic',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('M3'),
      new Interval('A4'),
      new Interval('P5'),
      new Interval('M6'),
      new Interval('m7')
    ]
  },
  NATURAL_MINOR: {
    name: 'natural_minor',
    mode: 'aeolian',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('m3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('m6'),
      new Interval('m7')
    ]
  },
  ALGERIAN: {
    name: 'algerian',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('m3'),
      new Interval('A4'),
      new Interval('P5'),
      new Interval('m6'),
      new Interval('M7'),
      new Interval('P8'),
      new Interval('M9'),
      new Interval('m10'),
      new Interval('P11'),
      new Interval('P12'),
      new Interval('m13'),
      new Interval('M14')
    ]
  },
  ALTERED: {
    name: 'altered',
    mode: 'super_locrian',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('m3'),
      new Interval('d4'),
      new Interval('d5'),
      new Interval('m6'),
      new Interval('m7')
    ]
  },
  AUGMENTED: {
    name: 'augmented',
    intervals: [
      new Interval('P1'),
      new Interval('m3'),
      new Interval('M3'),
      new Interval('P5'),
      new Interval('A5'),
      new Interval('M7')
    ]
  },
  BEBOP_DOMINANT: {
    name: 'bebop_dominant',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('M3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('M6'),
      new Interval('m7'),
      new Interval('M7')
    ]
  },
  BLUES: {
    name: 'blues',
    intervals: [
      new Interval('P1'),
      new Interval('m3'),
      new Interval('M3'),
      new Interval('P4'),
      new Interval('d5'),
      new Interval('P5'),
      new Interval('m7')
    ]
  },
  ASCENDING_CHROMATIC: {
    name: 'ascending_chromatic',
    intervals: [
      new Interval('P1'),
      new Interval('A1'),
      new Interval('M2'),
      new Interval('A2'),
      new Interval('M3'),
      new Interval('P4'),
      new Interval('A4'),
      new Interval('P5'),
      new Interval('A5'),
      new Interval('M6'),
      new Interval('A6'),
      new Interval('M7')
    ]
  },
  DESCENDING_CHROMATIC: {
    name: 'decending_chromatic',
    intervals: [
      new Interval('M7'),
      new Interval('m7'),
      new Interval('M6'),
      new Interval('m6'),
      new Interval('P5'),
      new Interval('d5'),
      new Interval('P4'),
      new Interval('M3'),
      new Interval('m3'),
      new Interval('M2'),
      new Interval('m2'),
      new Interval('P1')
    ]
  },
  DORIAN: {
    mode: 'dorian',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('m3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('M6'),
      new Interval('m7')
    ]
  },
  DOUBLE_HARMONIC: {
    name: 'double_harmonic',
    mode: 'flamenco',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('M3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('m6'),
      new Interval('M7')
    ]
  },
  ENIGMATIC: {
    name: 'enigmatic',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('M3'),
      new Interval('A4'),
      new Interval('A5'),
      new Interval('A6'),
      new Interval('M7')
    ]
  },
  GYPSY: {
    name: 'gipsy',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('m3'),
      new Interval('A4'),
      new Interval('P5'),
      new Interval('m6'),
      new Interval('m7')
    ]
  },
  HALF_DIMINISHED: {
    name: 'half_diminished',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('m3'),
      new Interval('d4'),
      new Interval('d5'),
      new Interval('m6'),
      new Interval('m7')
    ]
  },
  HARMONIC_MAJOR: {
    name: 'harmonic_major',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('M3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('m6'),
      new Interval('M7')
    ]
  },
  HARMONIC_MINOR: {
    name: 'harmonic_minor',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('m3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('m6'),
      new Interval('M7')
    ]
  },
  HIRAJOSHI: {
    name: 'hirajoshi',
    intervals: [
      new Interval('P1'),
      new Interval('M3'),
      new Interval('A4'),
      new Interval('P5'),
      new Interval('M7')
    ]
  },
  HUNGRARIAN_GYPSY: {
    name: 'hungrarian_gypsy',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('m3'),
      new Interval('A4'),
      new Interval('P5'),
      new Interval('m6'),
      new Interval('M7')
    ]
  },
  HUNGRARIAN_MINOR: {
    name: 'hungrarian_minor',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('m3'),
      new Interval('A4'),
      new Interval('P5'),
      new Interval('m6'),
      new Interval('M7')
    ]
  },
  IN: {
    name: 'in',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('m6')
    ]
  },
  INSEN: {
    name: 'insen',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('m7')
    ]
  },
  ISTRIAN: {
    name: 'istrian',
    mode: 'istrian',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('m3'),
      new Interval('d4'),
      new Interval('d5'),
      new Interval('P5')
    ]
  },
  IWATO: {
    name: 'iwato',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('P4'),
      new Interval('d5'),
      new Interval('m7')
    ]
  },
  LOCRIAN: {
    mode: 'locrian',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('m3'),
      new Interval('P4'),
      new Interval('d5'),
      new Interval('m6'),
      new Interval('m7')
    ]
  },
  LYDIAN_AUGMENTED: {
    name: 'lydian_augmented',
    mode: 'lydian_augmented',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('M3'),
      new Interval('A4'),
      new Interval('A5'),
      new Interval('M6'),
      new Interval('M7')
    ]
  },
  LYDIAN: {
    mode: 'lydian',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('M3'),
      new Interval('A4'),
      new Interval('P5'),
      new Interval('M6'),
      new Interval('M7')
    ]
  },
  MAJOR_BEBOP: {
    name: 'major_bebop',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('M3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('A5'),
      new Interval('M6'),
      new Interval('M7')
    ]
  },
  MAJOR_LOCRIAN: {
    name: 'major_locrian',
    mode: 'major_locrian',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('M3'),
      new Interval('P4'),
      new Interval('d5'),
      new Interval('m6'),
      new Interval('m7')
    ]
  },
  MAJOR_PENTATONIC: {
    name: 'major_pentatonic',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('M3'),
      new Interval('P5'),
      new Interval('M6')
    ]
  },
  MELODIC_MINOR_ASCENDING: {
    name: 'melodic_minor_ascending',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('m3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('M6'),
      new Interval('M7')
    ]
  },
  MELODIC_MINOR_DESCENDING: {
    name: 'melodic_minor_descending',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('m3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('m6'),
      new Interval('m7')
    ]
  },
  MINOR_PENTATONIC: {
    name: 'minor_pentatonic',
    intervals: [
      new Interval('P1'),
      new Interval('m3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('m7')
    ]
  },
  MIXOLYDIAN: {
    mode: 'mixolydian',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('M3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('M6'),
      new Interval('m7')
    ]
  },
  NEOPOLITAN_MAJOR: {
    name: 'neopolitan_major',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('m3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('M6'),
      new Interval('M7')
    ]
  },
  NEOPOLITAN_MINOR: {
    name: 'neopolitan_minor',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('m3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('m6'),
      new Interval('M7')
    ]
  },
  PERSIAN: {
    name: 'persian',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('M3'),
      new Interval('P4'),
      new Interval('d5'),
      new Interval('m6'),
      new Interval('M7')
    ]
  },
  PHRYGIAN_DOMINANT: {
    name: 'phrygian_dominant',
    mode: 'phrygian_dominant',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('M3'),
      new Interval('P4'),
      new Interval('d5'),
      new Interval('m6'),
      new Interval('m7')
    ]
  },
  PHRYGIAN: {
    mode: 'phrygian',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('m3'),
      new Interval('P4'),
      new Interval('d5'),
      new Interval('m6'),
      new Interval('m7')
    ]
  },
  PROMETHEUS: {
    name: 'prometheus',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('M3'),
      new Interval('A4'),
      new Interval('M6'),
      new Interval('m7')
    ]
  },
  HARMONICS: {
    name: 'harmonics',
    intervals: [
      new Interval('P1'),
      new Interval('m3'),
      new Interval('M3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('M6')
    ]
  },
  TRITONE: {
    name: 'tritones',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('M3'),
      new Interval('d5'),
      new Interval('P5'),
      new Interval('m7')
    ]
  },
  TWO_SEMITONE_TRITONE: {
    name: 'two_semiton_tritone',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('M2'),
      new Interval('A4'),
      new Interval('P5'),
      new Interval('m6')
    ]
  },
  UKRANIAN_DORIAN: {
    name: 'ukrarian_dorian',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('m3'),
      new Interval('A4'),
      new Interval('P5'),
      new Interval('M6'),
      new Interval('m7')
    ]
  },
  WHOLE_TONE: {
    name: 'whole_tone',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('M3'),
      new Interval('A4'),
      new Interval('A5'),
      new Interval('A6')
    ]
  },
  YO: {
    name: 'yo',
    intervals: [
      new Interval('P1'),
      new Interval('m3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('m7')
    ]
  },
  MAJOR_7_ARPEGGIO: {
    arpeggio: true,
    name: 'major_seven_arpeggio',
    intervals: [
      new Interval('P1'),
      new Interval('M3'),
      new Interval('P5'),
      new Interval('M7')
    ]
  },
  DOMINANT_SEVEN_ARPEGGIO: {
    arpeggio: true,
    name: 'dominant_seven_arpeggio',
    intervals: [
      new Interval('P1'),
      new Interval('M3'),
      new Interval('P5'),
      new Interval('m7')
    ]
  },
  MINOR_SEVEN_ARPEGGIO: {
    arpeggio: true,
    name: 'minor_seven_arpeggio',
    intervals: [
      new Interval('P1'),
      new Interval('m3'),
      new Interval('P5'),
      new Interval('m7')
    ]
  },
  MINOR_SEVEN_FLAT_FIVE_ARPEGGIO: {
    arpeggio: true,
    name: 'minor_seven_flat_five_arpeggio',
    intervals: [
      new Interval('P1'),
      new Interval('m3'),
      new Interval('d5'),
      new Interval('m7')
    ]
  },
  DOMINANT_SEVEN_SUS_FOUR_ARPEGGIO: {
    arpeggio: true,
    name: 'dominant_seven_sus_four_arpeggio',
    intervals: [
      new Interval('P1'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('m7')
    ]
  },
  DIMINISHED_SEVENT_ARPEGGIO: {
    arpeggio: true,
    name: 'diminished_seven_arpeggio',
    intervals: [
      new Interval('P1'),
      new Interval('m3'),
      new Interval('d5'),
      new Interval('d7')
    ]
  },
  MINOR_MAJOR_SEVEN_ARPEGGIO: {
    arpeggio: true,
    name: 'minor_major_seven_arpeggio',
    intervals: [
      new Interval('P1'),
      new Interval('m3'),
      new Interval('P5'),
      new Interval('M7')
    ]
  },
  MAJOR_SIX_ARPEGGIO: {
    arpeggio: true,
    name: 'major_six_arpeggio',
    intervals: [
      new Interval('P1'),
      new Interval('M3'),
      new Interval('P5'),
      new Interval('M6')
    ]
  },
  MINOR_MAJOR_SIX_ARPEGGIO: {
    arpeggio: true,
    name: 'minor_major_six_arpeggio',
    intervals: [
      new Interval('P1'),
      new Interval('m3'),
      new Interval('P5'),
      new Interval('M6')
    ]
  }
}

interface IScaleParams {
  name?: string
  key?: Note
  intervals?: Interval[]
  mode?: string
}

export class Scale {
  private _key!: Note;
  private _notes: Note[] = [];
  private _intervals: Interval[] = [];

  constructor (params: IScaleParams = {}) {
    const key = params.key ?? new Note({ name: 'C' })
    const intervals = params.intervals ?? []
    const name = params.name ?? 'major'
    const mode = params.mode ?? ''

    this.key = key

    if (params.intervals !== undefined && Array.isArray(intervals) && intervals.length > 0) {
      this.intervals = intervals
    } else if (mode !== '') {
      this.mode = mode
    } else {
      this.name = name
    }
  }

  get intervals (): Interval[] {
    return this._intervals
  }

  set intervals (intervals: Interval[]) {
    if (!Array.isArray(intervals) || !intervals.every(i => i instanceof Interval)) {
      throw new Error(`Cannot assign ${JSON.stringify(intervals)} as scale intervals.`)
    }
    // sort intervals by semitones
    this._intervals = intervals.sort((ia, ib) => ia.semitones - ib.semitones)
  }

  get name (): string {
    const definitions = Scale.getDefintionsFromIntervals(this.intervals)

    return definitions.length > 0 ? definitions[0].name ?? '' : ''
  }

  set name (name: string) {
    const definitionName = Object.keys(SCALES).find(s => SCALES[s].name === name)

    if (definitionName !== undefined) {
      this.intervals = SCALES[definitionName].intervals
    } else {
      throw new Error(`Couldn't find a scale definition with that name : ${name}.`)
    }
  }

  get mode (): string {
    const definitions = Scale.getDefintionsFromIntervals(this.intervals)

    return definitions.length > 0 ? definitions[0].mode ?? '' : ''
  }

  set mode (mode: string) {
    const definitionName = Object.keys(SCALES).find(s => SCALES[s].mode === mode)

    if (definitionName !== undefined) {
      this.intervals = SCALES[definitionName].intervals
    } else {
      throw new Error(`Couldn't find a scale definition with that mode : ${mode}.`)
    }
  }

  get key (): Note {
    return this._key
  }

  set key (note: Note) {
    this._key = note
  }

  set notes (notes: Note[]) {
    this._notes = notes
  }

  get notes (): Note[] {
    return this._intervals.map(interval => Interval.apply(this._key, interval.name))
  }

  // Return all 7th chords from the scale if it is diatonic
  get scaleChords (): Chord[] {
    const chords: Chord[] = []
    if (this.intervals.length === 7) {
      for (let i = 0; i < this.notes.length; i++) {
        chords.push(
          new Chord({
            root: this.notes[i],
            notes: [
              this.notes[i],
              this.notes[(i + 2) % this.notes.length], // 3rd
              this.notes[(i + 4) % this.notes.length], // 5th
              this.notes[(i + 6) % this.notes.length] // 7th
            ]
          })
        )
      }
    } else {
      console.warn('Cannot compute scale chords yet.')
    }

    return chords
  }

  static getDefintionsFromIntervals (intervals: Interval[]): IScaleDefinition[] {
    return Object.keys(SCALES).filter(s => {
      const scale = SCALES[s]
      if (scale.intervals.length === intervals.length) {
        return scale.intervals.every((v, i) => v.name === intervals[i].name)
      } else {
        return false
      }
    }).map(n => SCALES[n])
  }
}
