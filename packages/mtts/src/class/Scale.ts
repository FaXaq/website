import { Note } from './Note'
import { Interval } from './Interval'
import { Chord } from './Chord'

type IScaleName = "MAJOR" | "ACOUSTIC" | "NATURAL_MINOR" | "ALGERIAN" | "ALTERED" | "AUGMENTED" | "BEBOP_DOMINANT" | "BLUES" | "ASCENDING_CHROMATIC" | "DESCENDING_CHROMATIC" | "DOUBLE_HARMONIC" | "ENIGMATIC" | "GYPSY" | "HALF_DIMINISHED" | "HARMONIC_MAJOR" | "HARMONIC_MINOR" | "HIRAJOSHI" | "HUNGRARIAN_GYPSY" | "HUNGRARIAN_MINOR" | "IN" | "INSEN" | "IWATO" | "MAJOR_BEBOP" | "MAJOR_PENTATONIC" | "MELODIC_MINOR_ASCENDING" | "MELODIC_MINOR_DESCENDING" | "MINOR_PENTATONIC" | "NEOPOLITAN_MAJOR" | "NEOPOLITAN_MINOR" | "PERSIAN" | "PROMETHEUS" | "HARMONICS" | "TRITONE" | "TWO_SEMITONE_TRITONE" | "UKRAINIAN_DORIAN" | "WHOLE_TONE" | "YO" | "MAJOR_SEVEN_ARPEGGIO" | "DOMINANT_SEVEN_ARPEGGIO" | "MINOR_SEVEN_ARPEGGIO" | "MINOR_SEVEN_FLAT_FIVE_ARPEGGIO" | "DOMINANT_SEVEN_SUS_FOUR_ARPEGGIO" | "MINOR_MAJOR_SEVEN_ARPEGGIO" | "MAJOR_SEVEN_ARPEGGIO" | "MAJOR_SIX_ARPEGGIO" | "MINOR_MAJOR_SIX_ARPEGGIO" | "DIMINISHED_SEVEN_ARPEGGIO"

type IScaleMode = "IONIAN" | "AEOLIAN" | "DORIAN" | "LOCRIAN" | "LYDIAN" | "MIXOLYDIAN" | "SUPER_LOCRIAN" | "LYDIAN_AUGMENTED" | "MAJOR_LOCRIAN" | "MELODIC_MINOR_DESCENDING" | "NEOPOLITAN_MAJOR" | "NEOPOLITAN_MINOR" | "PHRYGIAN_DOMINANT" | "PHRYGIAN" | "PROMETHEUS" | "HARMONICS" | "ISTRIAN" | "FLAMENCO" | "UKRAINIAN_DORIAN"

interface IScaleDefinition {
  name?: IScaleName
  mode?: IScaleMode
  arpeggio?: boolean
  intervals: Interval[]
}

export const SCALES: Record<IScaleName | IScaleMode, IScaleDefinition> = {
  MAJOR: {
    name: "MAJOR",
    mode: "IONIAN",
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
  IONIAN: {
    name: "MAJOR",
    mode: "IONIAN",
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
    name: 'ACOUSTIC',
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
    name: 'NATURAL_MINOR',
    mode: 'AEOLIAN',
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
  AEOLIAN: {
    name: 'NATURAL_MINOR',
    mode: 'AEOLIAN',
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
    name: 'ALGERIAN',
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
    name: 'ALTERED',
    mode: 'SUPER_LOCRIAN',
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
  SUPER_LOCRIAN: {
    name: 'ALTERED',
    mode: 'SUPER_LOCRIAN',
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
    name: 'AUGMENTED',
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
    name: 'BEBOP_DOMINANT',
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
    name: 'BLUES',
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
    name: 'ASCENDING_CHROMATIC',
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
    name: 'DESCENDING_CHROMATIC',
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
    mode: 'DORIAN',
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
    name: 'DOUBLE_HARMONIC',
    mode: 'FLAMENCO',
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
  FLAMENCO: {
    name: 'DOUBLE_HARMONIC',
    mode: 'FLAMENCO',
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
    name: 'ENIGMATIC',
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
    name: 'GYPSY',
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
    name: 'HALF_DIMINISHED',
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
    name: 'HARMONIC_MAJOR',
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
    name: 'HARMONIC_MINOR',
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
    name: 'HIRAJOSHI',
    intervals: [
      new Interval('P1'),
      new Interval('M3'),
      new Interval('A4'),
      new Interval('P5'),
      new Interval('M7')
    ]
  },
  HUNGRARIAN_GYPSY: {
    name: 'HUNGRARIAN_GYPSY',
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
    name: 'HUNGRARIAN_MINOR',
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
    name: 'IN',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('m6')
    ]
  },
  INSEN: {
    name: 'INSEN',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('m7')
    ]
  },
  ISTRIAN: {
    mode: 'ISTRIAN',
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
    name: 'IWATO',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('P4'),
      new Interval('d5'),
      new Interval('m7')
    ]
  },
  LOCRIAN: {
    mode: 'LOCRIAN',
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
    mode: 'LYDIAN_AUGMENTED',
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
    mode: 'LYDIAN',
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
    name: 'MAJOR_BEBOP',
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
    mode: 'MAJOR_LOCRIAN',
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
    name: 'MAJOR_PENTATONIC',
    intervals: [
      new Interval('P1'),
      new Interval('M2'),
      new Interval('M3'),
      new Interval('P5'),
      new Interval('M6')
    ]
  },
  MELODIC_MINOR_ASCENDING: {
    name: 'MELODIC_MINOR_ASCENDING',
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
    name: 'MELODIC_MINOR_DESCENDING',
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
    name: 'MINOR_PENTATONIC',
    intervals: [
      new Interval('P1'),
      new Interval('m3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('m7')
    ]
  },
  MIXOLYDIAN: {
    mode: 'MIXOLYDIAN',
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
    name: 'NEOPOLITAN_MAJOR',
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
    name: 'NEOPOLITAN_MINOR',
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
    name: 'PERSIAN',
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
    mode: 'PHRYGIAN_DOMINANT',
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
    mode: 'PHRYGIAN',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('m3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('m6'),
      new Interval('m7')
    ]
  },
  PROMETHEUS: {
    name: 'PROMETHEUS',
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
    name: 'HARMONICS',
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
    name: 'TRITONE',
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
    name: 'TWO_SEMITONE_TRITONE',
    intervals: [
      new Interval('P1'),
      new Interval('m2'),
      new Interval('M2'),
      new Interval('A4'),
      new Interval('P5'),
      new Interval('m6')
    ]
  },
  UKRAINIAN_DORIAN: {
    mode: "UKRAINIAN_DORIAN",
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
    name: 'WHOLE_TONE',
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
    name: 'YO',
    intervals: [
      new Interval('P1'),
      new Interval('m3'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('m7')
    ]
  },
  MAJOR_SEVEN_ARPEGGIO: {
    arpeggio: true,
    name: 'MAJOR_SEVEN_ARPEGGIO',
    intervals: [
      new Interval('P1'),
      new Interval('M3'),
      new Interval('P5'),
      new Interval('M7')
    ]
  },
  DOMINANT_SEVEN_ARPEGGIO: {
    arpeggio: true,
    name: 'DOMINANT_SEVEN_ARPEGGIO',
    intervals: [
      new Interval('P1'),
      new Interval('M3'),
      new Interval('P5'),
      new Interval('m7')
    ]
  },
  MINOR_SEVEN_ARPEGGIO: {
    arpeggio: true,
    name: 'MINOR_SEVEN_ARPEGGIO',
    intervals: [
      new Interval('P1'),
      new Interval('m3'),
      new Interval('P5'),
      new Interval('m7')
    ]
  },
  MINOR_SEVEN_FLAT_FIVE_ARPEGGIO: {
    arpeggio: true,
    name: 'MINOR_SEVEN_FLAT_FIVE_ARPEGGIO',
    intervals: [
      new Interval('P1'),
      new Interval('m3'),
      new Interval('d5'),
      new Interval('m7')
    ]
  },
  DOMINANT_SEVEN_SUS_FOUR_ARPEGGIO: {
    arpeggio: true,
    name: 'DOMINANT_SEVEN_SUS_FOUR_ARPEGGIO',
    intervals: [
      new Interval('P1'),
      new Interval('P4'),
      new Interval('P5'),
      new Interval('m7')
    ]
  },
  DIMINISHED_SEVEN_ARPEGGIO: {
    arpeggio: true,
    name: 'DIMINISHED_SEVEN_ARPEGGIO',
    intervals: [
      new Interval('P1'),
      new Interval('m3'),
      new Interval('d5'),
      new Interval('d7')
    ]
  },
  MINOR_MAJOR_SEVEN_ARPEGGIO: {
    arpeggio: true,
    name: 'MINOR_MAJOR_SEVEN_ARPEGGIO',
    intervals: [
      new Interval('P1'),
      new Interval('m3'),
      new Interval('P5'),
      new Interval('M7')
    ]
  },
  MAJOR_SIX_ARPEGGIO: {
    arpeggio: true,
    name: 'MAJOR_SIX_ARPEGGIO',
    intervals: [
      new Interval('P1'),
      new Interval('M3'),
      new Interval('P5'),
      new Interval('M6')
    ]
  },
  MINOR_MAJOR_SIX_ARPEGGIO: {
    arpeggio: true,
    name: 'MINOR_MAJOR_SIX_ARPEGGIO',
    intervals: [
      new Interval('P1'),
      new Interval('m3'),
      new Interval('P5'),
      new Interval('M6')
    ]
  }
}

interface IScaleParams {
  name?: IScaleName
  key?: Note
  intervals?: Interval[]
  mode?: IScaleMode
}

export class Scale {
  private _key!: Note;
  private _notes: Note[] = [];
  private _intervals: Interval[] = [];

  constructor(params: IScaleParams = {}) {
    const key = params.key ?? new Note({ name: 'C' })
    const intervals = params.intervals ?? []
    const name = params.name ?? 'MAJOR'
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

  get intervals(): Interval[] {
    return this._intervals
  }

  set intervals(intervals: Interval[]) {
    if (!Array.isArray(intervals) || !intervals.every(i => i instanceof Interval)) {
      throw new Error(`Cannot assign ${JSON.stringify(intervals)} as scale intervals.`)
    }
    // sort intervals by semitones
    this._intervals = intervals.sort((ia, ib) => ia.semitones - ib.semitones)
  }

  get name(): string {
    const definitions = Scale.getDefintionsFromIntervals(this.intervals)

    return definitions.length > 0 ? definitions[0]?.name ?? '' : ''
  }

  set name(name: IScaleName) {
    if (name !== undefined) {
      this.intervals = SCALES[name].intervals
    } else {
      throw new Error(`Couldn't find a scale definition with that name : ${name}.`)
    }
  }

  get mode(): string {
    const definitions = Scale.getDefintionsFromIntervals(this.intervals)

    return definitions.length > 0 ? definitions[0]?.mode ?? '' : ''
  }

  set mode(mode: string) {
    const definitionName = Object.keys(SCALES).find(s => SCALES[s as IScaleName].mode === mode)

    if (definitionName !== undefined) {
      this.intervals = SCALES[definitionName as IScaleName].intervals
    } else {
      throw new Error(`Couldn't find a scale definition with that mode : ${mode}.`)
    }
  }

  get key(): Note {
    return this._key
  }

  set key(note: Note) {
    this._key = note
  }

  set notes(notes: Note[]) {
    this._notes = notes
  }

  get notes(): Note[] {
    return this._intervals.map(interval => Interval.apply(this._key, interval.name))
  }

  // Return all 7th chords from the scale if it is diatonic
  get diatonicChords(): Chord[] {
    const chords: Chord[] = []
    if (this.intervals.length === 7) {
      this.notes.forEach((n, i) => {
        const third = this.notes[(i + 2) % this.notes.length]
        const fifth = this.notes[(i + 4) % this.notes.length]
        const seventh = this.notes[(i + 6) % this.notes.length]

        if (third && fifth && seventh) {
          const chord = new Chord({
            root: n,
            notes: [
              n,
              third,
              fifth,
              seventh
            ]
          })
          chords.push(
            chord
          )
        }
      })
    } else {
      console.warn('Cannot compute scale chords yet.')
    }

    return chords
  }

  static getDefintionsFromIntervals(intervals: Interval[]): IScaleDefinition[] {
    return Object.keys(SCALES).filter((s) => {
      const scale = SCALES[s as IScaleName]
      if (scale.intervals.length === intervals.length) {
        return scale.intervals.every((v, i) => v.name === intervals[i]?.name)
      } else {
        return false
      }
    }).map(n => SCALES[n as IScaleName])
  }
}
