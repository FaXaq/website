import { Note } from './Note'
import { Interval, SEMITONES_WITHIN_OCTAVE } from './Interval'
import { DEFAULT_NOTE_VALUE, NOTE_VALUE } from './NoteValue'
import { ValuedBarContent } from '../super/ValuedBarContent'
import { cloneInstanceObjectArray } from '../misc/utils'
import { Scale } from './Scale'

// TODO :
// Investigate chord semitones notation
// A major 7 could be written :
// 047N
// 0 for the root
// 4 for the major third because it's 4 semitones above the root
// 7 for the fifth because it's 7 semitones from the root
// N for the major 7 because it's 11 semitones from the root
// A minor 7 could be written :
// 047X
// X for the minor 7 because it's 10 semitones from the root
// With this notation, a half diminish 13th could be written 036X259 which is easily computable.

interface ITriadDefinition {
  key: string
  name: string
  intervals: Interval[]
  notation: string
}

interface IExtendedChordDefinition {
  key: string
  name: string
  notation: string
  extends: ITriadDefinition
  addedTones: Interval[]
}

type TRIAD_NAME = "maj" | "min" | "aug" | "dim" | "sus2" | "sus4" | "power"

export const TRIADS: Record<TRIAD_NAME, ITriadDefinition> = {
  'maj': {
    key: 'maj',
    name: 'major',
    intervals: [new Interval('P1'), new Interval('M3'), new Interval('P5')],
    notation: ''
  },'min': {
    key: 'min',
    name: 'minor',
    intervals: [new Interval('P1'), new Interval('m3'), new Interval('P5')],
    notation: '-'
  },'aug': {
    key: 'aug',
    name: 'augmented',
    intervals: [new Interval('P1'), new Interval('M3'), new Interval('A5')],
    notation: '+'
  },'dim': {
    key: 'dim',
    name: 'diminished',
    intervals: [new Interval('P1'), new Interval('m3'), new Interval('d5')],
    notation: '°'
  },'sus2': {
    key: 'sus2',
    name: 'suspended2',
    intervals: [new Interval('P1'), new Interval('M2'), new Interval('P5')],
    notation: 'sus2'
  },'sus4': {
    key: 'sus4',
    name: 'suspended4',
    intervals: [new Interval('P1'), new Interval('P4'), new Interval('P5')],
    notation: 'sus4'
  },'power': {
    key: 'power',
    name: 'power',
    intervals: [new Interval('P1'), new Interval('P5')],
    notation: '5'
  }
}


export const EXTENDED_CHORDS = {
  M7: {
    key: 'M7',
    addedTones: [new Interval('M7')],
    name: 'major 7',
    notation: 'M7',
    extends: TRIADS.maj
  },
  7: {
    key: '7',
    addedTones: [new Interval('m7')],
    name: 'dominant 7',
    notation: '7',
    extends: TRIADS.maj
  },
  '-7/5b': {
    key: '-7/5b',
    addedTones: [new Interval('m7')],
    name: 'minor 7 flat 5',
    notation: '-7/5b',
    extends: TRIADS.dim
  },
  m7: {
    key: 'm7',
    addedTones: [new Interval('m7')],
    name: 'minor 7',
    notation: '-7',
    extends: TRIADS.min
  },
  '7sus4': {
    key: '7sus4',
    addedTones: [new Interval('m7')],
    name: 'dominant 7 sus 4',
    notation: '7sus4',
    extends: TRIADS.sus4
  },
  d7: {
    key: 'd7',
    addedTones: [new Interval('d7')],
    name: 'diminished 7',
    notation: '°7',
    extends: TRIADS.dim
  },
  mM7: {
    key: 'mM7',
    addedTones: [new Interval('M7')],
    name: 'minor major 7',
    notation: 'mM7',
    extends: TRIADS.min
  },
  9: {
    key: '9',
    addedTones: [new Interval('m7'), new Interval('M9')],
    name: '7(9)',
    notation: '9',
    extends: TRIADS.maj
  },
  M9: {
    key: 'M9',
    addedTones: [new Interval('M7'), new Interval('M9')],
    name: 'M7(9)',
    notation: 'M9',
    extends: TRIADS.maj
  },
  min9: {
    key: 'min9',
    addedTones: [new Interval('m7'), new Interval('M9')],
    name: '-7(9)',
    notation: '-9',
    extends: TRIADS.min
  },
  11: {
    key: '11',
    addedTones: [new Interval('m7'), new Interval('M9'), new Interval('P11')],
    name: '7(11)',
    notation: '11',
    extends: TRIADS.maj
  },
  M11: {
    key: 'M11',
    addedTones: [new Interval('M7'), new Interval('M9'), new Interval('P11')],
    name: 'M7(11)',
    notation: 'M11',
    extends: TRIADS.maj
  },
  m11: {
    key: 'm11',
    addedTones: [new Interval('m7'), new Interval('M9'), new Interval('P11')],
    name: '-7(11)',
    notation: '-11',
    extends: TRIADS.min
  },
  13: {
    key: '13',
    addedTones: [new Interval('m7'), new Interval('M9'), new Interval('P11'), new Interval('M13')],
    name: '7(13)',
    notation: '13',
    extends: TRIADS.maj
  },
  M13: {
    key: 'M13',
    addedTones: [new Interval('M7'), new Interval('M9'), new Interval('P11'), new Interval('M13')],
    name: 'M7(13)',
    notation: 'M13',
    extends: TRIADS.maj
  },
  m13: {
    key: 'm13',
    addedTones: [new Interval('m7'), new Interval('M9'), new Interval('P11'), new Interval('M13')],
    name: '-7(13)',
    notation: '-13',
    extends: TRIADS.min
  },
  6: {
    key: '6',
    addedTones: [new Interval('M6')],
    name: 'major 6',
    notation: '6',
    extends: TRIADS.maj
  },
  min6: {
    key: 'min6',
    addedTones: [new Interval('M6')],
    name: 'minor major 6',
    notation: '-6',
    extends: TRIADS.min
  }
};

function _recursiveExtendedChordCompute (
  chord: ITriadDefinition | IExtendedChordDefinition,
  addedTones: Interval[] = []
): {
    intervals: Interval[]
    addedTones: Interval[]
  } {
  if ((chord as ITriadDefinition).intervals !== undefined) {
    return {
      intervals: (chord as ITriadDefinition).intervals,
      addedTones
    }
  }

  return _recursiveExtendedChordCompute((chord as IExtendedChordDefinition).extends, [
    ...(chord as IExtendedChordDefinition).addedTones,
    ...addedTones
  ])
}

type IChordDefinition = ITriadDefinition | IComputedExtendedChord

interface IComputedExtendedChord {
  key: string
  intervals: Interval[]
  name: string
  notation: string
  extends: ITriadDefinition
}

// flatten extended chords
export const COMPUTED_EXTENDED_CHORDS: IComputedExtendedChord[] = Object.values(EXTENDED_CHORDS).map(EXTENDED_CHORD => {
  // recursively compute chord, to flatten added tones & initial intervals of chord
  const { intervals, addedTones } = _recursiveExtendedChordCompute(
    EXTENDED_CHORD
  )
  return {
    ...EXTENDED_CHORD,
    intervals: [...intervals, ...addedTones]
  }
})

const ALL_POSSIBLE_CHORDS: IChordDefinition[] = [];
Object.keys(TRIADS).forEach(key => ALL_POSSIBLE_CHORDS.push(TRIADS[key as TRIAD_NAME]))
ALL_POSSIBLE_CHORDS.push(...COMPUTED_EXTENDED_CHORDS)


interface ChordParams {
  root: Note
  intervals?: Interval[]
  value?: NOTE_VALUE
  notes?: Note[]
}

export class Chord extends ValuedBarContent {
  private _root!: Note;
  private _intervals!: Interval[];
  private _notes: Note[] = [];
  private readonly _definitions: ITriadDefinition[] = [];

  constructor (
    params: ChordParams = {
      root: new Note({ name: 'C' }),
      value: DEFAULT_NOTE_VALUE
    }
  ) {
    super()
    this.root = params.root
    if (params.notes !== undefined && params.notes.length > 0) {
      this.notes = params.notes
      this.value = params.value ?? DEFAULT_NOTE_VALUE
    } else {
      this.intervals =
        params.intervals ?? cloneInstanceObjectArray(TRIADS.maj.intervals)
      this.value = params.value ?? DEFAULT_NOTE_VALUE
    }
  }

  get root (): Note {
    return this._root
  }

  set root (root: Note) {
    if (root instanceof Note) {
      this._root = root
    } else {
      throw new Error(
        'Trying to set a root for a chord, with something that is note a Note'
      )
    }
  }

  get intervals (): Interval[] {
    return this._intervals
  }

  set intervals (intervals: Interval[]) {
    const notes: Note[] = []
    intervals.forEach(i => {
      if (!(i instanceof Interval)) {
        throw new Error(
          `Trying to set interval for chords, but ${JSON.stringify(
            i
          )} is not an Interval.`
        )
      }
      notes.push(Interval.apply(this._root, i.name))
    })
    this._notes = notes
    this._intervals = intervals
  }

  set notes (notes: Note[]) {
    const lowestNote = notes.sort((n1, n2) => n1.frequency - n2.frequency)[0]
    const semitonesAndValues = notes.map(note => ({
      semitones: Note.getNormalizedSemitonesBetween(this._root, note),
      value: Note.getIndexDifferenceBetween(this._root, note)
    }))
    const intervals = semitonesAndValues.map(({ semitones, value }, i) => {
      const interval = Interval.fromSemitonesAndValue(semitones, value)
      if (interval === undefined) {
        throw new Error(`Chord.notes (setter) : Trying to set a note within chord with semitones (${semitones}) and value (${value}). Note: ${notes[i]!.SPN} against root ${this._root.SPN}.`)
      }
      return interval
    })

    this._root = lowestNote!
    this._intervals = intervals
    this._notes = notes
  }

  get notes (): Note[] {
    const notes = this._intervals.map(interval => (
      Interval.apply(this._root, interval.name)
    ))
    this._notes = notes
    return notes
  }

  get notation (): string {
    const semitonesNotation = this.semitonesNotation
    const fullyMatchingChordDefinitions = Chord.getDefinitionsFromSemitonesNotation(semitonesNotation)
    const partialMatchingChordDefinitions = Chord.getDefinitionsFromPartialSemitonesNotation(semitonesNotation)
    // If we have perfect matched triad, it means it's either :
    // - A triad
    // - An extended chord
    // - A chord with added tones
    if (fullyMatchingChordDefinitions.length > 0) {
      const chord = fullyMatchingChordDefinitions[0]!
      if (chord.addedTones.length > 0) {
        return `${chord.chordDefinition.notation}${chord.addedTones.map(i => `add(${i.notation})`).join('')}`
      }
      return chord.chordDefinition.notation
    } else {
      // If not, it's probably a chord with ommited intervals
      if (partialMatchingChordDefinitions.length > 0) {
        const chord = partialMatchingChordDefinitions[0]!
        return `${chord.chordDefinition.notation}${chord.missingTones.map(i => ` no(${i.notation})`).join('')}`
      }
    }

    this._noNotationYet()

    return ''
  }

  /**
   * Use chord semitones notation to generate chord name.
   * Each semitone within the chord is represented as a digit or X or N.
   * For reference :
   * - 0 means that this is a 0 semitone interval
   * - 1 means that this is a 1 semitone interval
   * - 2 means that this is a 1 semitones interval
   * ...
   * - X means that this is a 10 semitones interval
   * - N means that this is a 11 semitones interval
   * And it circles back to 0.
   * There is no such thing as 12 semitones interval, since there is only one semitone whithin one octave.
   * This function returns every chord defintion which matches FULLY the semitones notation, with added tones.
   * @param notation
   * @returns
   */
  static getDefinitionsFromSemitonesNotation (notation: string): Array<{
    addedTones: Interval[]
    chordDefinition: IChordDefinition
  }> {
    const possibleChords = ALL_POSSIBLE_CHORDS.map(chord => {
      return {
        chordDefinition: chord,
        semitonesNotation: chord.intervals.map((interval) => interval.chordSemitonesNotation).join('')
      }
    })

    return possibleChords
      // Extract every fully matching chord notations
      .filter(pc => pc.semitonesNotation.split('').every(i => notation.includes(i)))
      // Add missing tones from each match
      .map(pc => {
        let addedTones: Interval[] = []
        if (notation.length > pc.semitonesNotation.length) {
          addedTones = notation
            // extract missing semitones intervals from the possible chord
            .split('')
            .filter(interval => !pc.semitonesNotation.includes(interval))
            .map(interval => {
              // Find possible intervals
              const possibleAddedTone = Interval.fromChordSemitonesNotation(interval)
              // Remove intervals with value that are already used within the chord
              const filteredAddedTone = possibleAddedTone
                ?.filter(pi => pc.chordDefinition.intervals.find(pci => pci.value === pi.value) === undefined) ?? []

              // If we're here, it means it's down to one possible added tone. We can safely add it to the chord.
              const addedTone = filteredAddedTone[0]!
              // Added tones are conventionnaly marked to the octave. We need to raise them as it's not done already.
              if (addedTone.value < 8) {
                const raisedAddedTone = Interval.raiseOctave(addedTone)
                if (raisedAddedTone !== undefined) {
                  return raisedAddedTone
                }
              }

              return addedTone
            })
        }

        return {
          ...pc,
          addedTones
        }
      })
      // Sort for the one with the longest definition to be at first position
      .sort((a, b) => b.semitonesNotation.length - a.semitonesNotation.length)
  }

  /**
   * Use chord semitones notation to generate chord name.
   * Each semitone within the chord is represented as a digit or X or N.
   * For reference :
   * - 0 means that this is a 0 semitone interval
   * - 1 means that this is a 1 semitone interval
   * - 2 means that this is a 1 semitones interval
   * ...
   * - X means that this is a 10 semitones interval
   * - N means that this is a 11 semitones interval
   * And it circles back to 0.
   * There is no such thing as 12 semitones interval, since there is only one semitone whithin one octave.
   * This function returns every chord defintion which matches PARTIALY the semitones notation, with missing intervals.
   * @param notation
   * @returns
   */
  static getDefinitionsFromPartialSemitonesNotation (notation: string): Array<{
    missingTones: Interval[]
    chordDefinition: IChordDefinition
  }> {
    const possibleChords = ALL_POSSIBLE_CHORDS.map(chord => ({
      chordDefinition: chord,
      semitonesNotation: chord.intervals.map((interval) => interval.chordSemitonesNotation).join('')
    }))

    return possibleChords
      // Extract every fully matching chord notations
      .filter(pc => notation.split('').every(i => pc.semitonesNotation.includes(i)))
      // Add missing tones from each match
      .map(pc => {
        const missingTones: Interval[] = []

        for (const interval of pc.chordDefinition.intervals) {
          if (!notation.includes(interval.chordSemitonesNotation)) {
            missingTones.push(interval)
          }
        }

        return {
          ...pc,
          missingTones
        }
      })
      // Sort for the one with the longest definition to be at first position
      .sort((a, b) => a.missingTones.length - b.missingTones.length)
  }

  static fromNotation (notation: string): Chord {
    const chars = notation.split('')
    let possibleRoot = new Note()

    try {
      possibleRoot = Note.fromSPN(chars[0] + '4')
      if (chars.length > 1) {
        possibleRoot = Note.fromSPN(chars.slice(0, 2).join('') + '4')
      }
      if (chars.length > 2) {
        // root note can contain double sharp or flat
        possibleRoot = Note.fromSPN(chars.slice(0, 3).join('') + '4')
      }
    } catch (err) {
      // Silent error
    }

    const rootLength = possibleRoot.SPN.length - 1
    const isolatedPossibleNotation = chars.slice(rootLength, chars.length).join('')
    const foundNotation = ALL_POSSIBLE_CHORDS.find(chordNotation => chordNotation.notation === isolatedPossibleNotation)

    if (foundNotation !== undefined) {
      return new Chord({
        root: possibleRoot,
        intervals: [
          ...foundNotation.intervals
        ]
      })
    }

    throw new Error(`Cannot find a chord notation yet for ${notation}`)
  }

  get semitonesNotation (): string {
    const semitones = []
    for (const note of this.notes) {
      const semitoneFromRoot = Note.getSemitonesBetween(this._root, note)
      if (semitoneFromRoot === 10) {
        semitones.push('X')
      } else if (semitoneFromRoot === 11) {
        semitones.push('N')
      } else {
        semitones.push(semitoneFromRoot)
      }
    }
    return semitones.join('')
  }

  computeNotationWithContext (scale: Scale): string {
    return ''
  }

  _noNotationYet (): void {
    console.warn(`No name for this chord yet ${this.root.SPN} ${JSON.stringify(this.intervals.map(i => i.name))}`)
  }

  computeIntervals (): Interval[] {
    const intervals: Interval[] = []

    this.notes.forEach((n: Note) => {
      // for now choosing the first result of interval from semitones
      // TODO: find algorithm to be sure semitone value is not currently in the chord
      const semitonesBetweenNotes = Note.getSemitonesBetween(this.root, n)
      const possibleInterval = Interval.fromSemitonesAndValue(
        semitonesBetweenNotes < 0
          ? (semitonesBetweenNotes % SEMITONES_WITHIN_OCTAVE) + SEMITONES_WITHIN_OCTAVE
          : semitonesBetweenNotes,
        Note.getIndexDifferenceBetween(this.root, n)
      )

      if (possibleInterval !== undefined) intervals.push(possibleInterval)
    })
    return intervals
  }

  addInterval (interval: Interval): Chord {
    this._intervals.push(interval)
    return this
  }

  possibleAddedTones (triad: ITriadDefinition): Interval[] {
    if (triad.intervals.length === this.intervals.length) {
      return []
    }

    return this.intervals.filter((i: Interval) => {
      for (let j = 0; j < triad.intervals.length; j++) {
        if (Interval.equals(i, triad.intervals[j]!)) {
          return false
        }
      }

      return true
    })
  }
}
