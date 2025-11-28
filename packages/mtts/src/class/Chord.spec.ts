import { describe, it, expect } from 'vitest'
import { Chord, TRIADS } from './Chord'
import { Note } from './Note'
import { Interval, INTERVAL_NAME, INTERVALS } from './Interval'

describe('Chord class', () => {
  describe('Constructor', () => {
    it('Should instanciate a chord without parameter, and define default values for root and intervals', () => {
      expect(() => new Chord()).not.toThrow()
    })

    it('Should be able to instanciate with only root', () => {
      expect(() => new Chord({
        root: new Note({
          name: 'A'
        })
      })).not.toThrow()
    })
  })

  describe('Static', () => {
    it('Should be able to create a chord from notation', () => {
      expect(() => { Chord.fromNotation('C') }).not.toThrow()
      expect(Chord.fromNotation('C').notation).toBe('')

      expect(() => { Chord.fromNotation('Cs-') }).not.toThrow()
      expect(Chord.fromNotation('Cs-').notation).toBe('-')

      expect(() => { Chord.fromNotation('Ebb7') }).not.toThrow()
      expect(Chord.fromNotation('Ebb7').notation).toBe('7')
    })
  })

  describe('Guess intervals', () => {
    it('Should guess intervals from chord notes', () => {
      const root = new Note({
        name: 'F'
      })
      new Chord({
        root,
        notes: [
          root,
          Interval.apply(root, 'M3'),
          new Note({
            name: 'C'
          }),
          Interval.apply(root, 'M7')
        ]
      })
    })
  })

  describe('Getters & Setters', () => {
    describe('Root', () => {
      it('Should be able to get root', () => {
        const c = new Chord({
          root: new Note({
            name: 'C'
          })
        })
        expect(c.root).toEqual(new Note({
          name: 'C'
        }))
      })

      it('Should be able to set root', () => {
        const c = new Chord()
        expect(() => {
          c.root = new Note({
            name: 'A'
          })
        }).not.toThrow()
      })
    })

    describe('Intervals', () => {
      it('Should be able to get intervals', () => {
        const c = new Chord()
        expect(c.intervals).toEqual(TRIADS.maj.intervals)
      })

      it('Should be able to set intervals', () => {
        const c = new Chord()
        expect(() => {
          Object.keys(INTERVALS).forEach(k => {
            c.intervals.push(new Interval(INTERVALS[k as INTERVAL_NAME].name))
          })
        }).not.toThrow()
      })

      it('Should infer notes values from setting intervals', () => {
        const c = new Chord()
        c.intervals = [
          new Interval(INTERVALS.P1.name),
          new Interval(INTERVALS.P5.name)
        ]
        expect(c.notes.map(note => note.SPN)).toEqual(['C4', 'G4'])
      })
    })

    describe('Notes', () => {
      it('Should be able to get notes', () => {
        const c = new Chord()
        expect(c.notes.map(n => n.SPN)).toEqual([
          new Note({
            name: 'C'
          }),
          new Note({
            name: 'E'
          }),
          new Note({
            name: 'G'
          })
        ].map(n => n.SPN))
      })
    })

    describe('Name', () => {
      describe('Triads', () => {
        it('Should give notation for major chord', () => {
          const c = new Chord()
          expect(c.notation).toBe('')
        })
        it('Should give notation for minor chord', () => {
          const c = new Chord({
            root: new Note({
              name: 'C'
            }),
            intervals: [
              new Interval('P1'),
              new Interval('m3'),
              new Interval('P5')
            ]
          })
          expect(c.notation).toBe('-')
        })
        it('Should give notation for diminished chord', () => {
          const root = new Note({
            name: 'C'
          })
          const c = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'm3'),
              Interval.apply(root, 'd5')
            ]
          })
          expect(c.notation).toBe('°')
        })
        it('Should give notation for augmented chord', () => {
          const root = new Note({
            name: 'C'
          })
          const c = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'M3'),
              Interval.apply(root, 'A5')
            ]
          })
          expect(c.notation).toBe('+')
        })
        it('Should give notation for suspended 2 chord', () => {
          const root = new Note({
            name: 'C'
          })
          const c = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'M2'),
              Interval.apply(root, 'P5')
            ]
          })
          expect(c.notation).toBe('sus2')
        })
        it('Should give notation for suspended 2 chord', () => {
          const root = new Note({
            name: 'C'
          })
          const c = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'P4'),
              Interval.apply(root, 'P5')
            ]
          })
          expect(c.notation).toBe('sus4')
        })
      })

      describe('Added tones to triad', () => {
        it('Should write correctly added tones to a triad', () => {
          const root = new Note({
            name: 'C'
          })
          const c = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'A4'),
              Interval.apply(root, 'P5')
            ]
          })
          expect(c.notation).toBe('5add(+11)')
        })
      })

      describe('Extended', () => {
        it('Should give notation for Major 7 chord', () => {
          const root = new Note({
            name: 'C'
          })
          const c = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'M3'),
              Interval.apply(root, 'P5'),
              Interval.apply(root, 'M7')
            ]
          })
          expect(c.notation).toBe('M7')
        })

        it('Should give notation for minor 7 chord', () => {
          const root = new Note({
            name: 'C'
          })
          const c = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'm3'),
              Interval.apply(root, 'P5'),
              Interval.apply(root, 'm7')
            ]
          })
          expect(c.notation).toBe('-7')
        })

        it('Should give notation for minor 7 flat 5 chord', () => {
          const root = new Note({
            name: 'C'
          })
          const c = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'm3'),
              Interval.apply(root, 'd5'),
              Interval.apply(root, 'm7')
            ]
          })
          expect(c.notation).toBe('-7/5b')
        })

        it('Should give notation for 9 chords', () => {
          const root = new Note({
            name: 'C'
          })

          const c = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'M3'),
              Interval.apply(root, 'P5'),
              Interval.apply(root, 'M7'),
              Interval.apply(root, 'M9')
            ]
          })

          expect(c.notation).toBe('M9')

          const c2 = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'm3'),
              Interval.apply(root, 'P5'),
              Interval.apply(root, 'm7'),
              Interval.apply(root, 'M9')
            ]
          })

          expect(c2.notation).toBe('-9')

          const c3 = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'M3'),
              Interval.apply(root, 'P5'),
              Interval.apply(root, 'm7'),
              Interval.apply(root, 'M9')
            ]
          })

          expect(c3.notation).toBe('9')
        })

        it('Should give notation for 11 chords', () => {
          const root = new Note({
            name: 'C'
          })

          const c = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'M3'),
              Interval.apply(root, 'P5'),
              Interval.apply(root, 'M7'),
              Interval.apply(root, 'M9'),
              Interval.apply(root, 'P11')
            ]
          })

          expect(c.notation).toBe('M11')

          const c2 = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'm3'),
              Interval.apply(root, 'P5'),
              Interval.apply(root, 'm7'),
              Interval.apply(root, 'M9'),
              Interval.apply(root, 'P11')
            ]
          })

          expect(c2.notation).toBe('-11')

          const c3 = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'M3'),
              Interval.apply(root, 'P5'),
              Interval.apply(root, 'm7'),
              Interval.apply(root, 'M9'),
              Interval.apply(root, 'P11')
            ]
          })

          expect(c3.notation).toBe('11')
        })

        it('Should give notation for 13 chords', () => {
          const root = new Note({
            name: 'C'
          })

          const c = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'M3'),
              Interval.apply(root, 'P5'),
              Interval.apply(root, 'M7'),
              Interval.apply(root, 'M9'),
              Interval.apply(root, 'P11'),
              Interval.apply(root, 'M13')
            ]
          })

          expect(c.notation).toBe('M13')

          const c2 = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'm3'),
              Interval.apply(root, 'P5'),
              Interval.apply(root, 'm7'),
              Interval.apply(root, 'M9'),
              Interval.apply(root, 'P11'),
              Interval.apply(root, 'M13')
            ]
          })

          expect(c2.notation).toBe('-13')

          const c3 = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'M3'),
              Interval.apply(root, 'P5'),
              Interval.apply(root, 'm7'),
              Interval.apply(root, 'M9'),
              Interval.apply(root, 'P11'),
              Interval.apply(root, 'M13')
            ]
          })

          expect(c3.notation).toBe('13')
        })

        it('Should give notation for 7 chords with added 11', () => {
          const root = new Note({
            name: 'C'
          })

          const c = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'M3'),
              Interval.apply(root, 'P5'),
              Interval.apply(root, 'M7'),
              Interval.apply(root, 'P11')
            ]
          })

          expect(c.notation).toBe('M7add(11)')

          const c2 = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'M3'),
              Interval.apply(root, 'P5'),
              Interval.apply(root, 'M7'),
              Interval.apply(root, 'M2')
            ]
          })

          expect(c2.notation).toBe('M9')
        })

        it('Should give notation for 7 chords with no 5', () => {
          const root = new Note({
            name: 'C'
          })

          const c = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'M3'),
              Interval.apply(root, 'M7')
            ]
          })

          expect(c.notation).toBe('M7 no(5)')
        })

        it('Should give notation for 7 chords with no 5 and added 11', () => {
          const root = new Note({
            name: 'C'
          })

          const c = new Chord({
            root,
            notes: [
              root,
              Interval.apply(root, 'M3'),
              Interval.apply(root, 'M7'),
              Interval.apply(root, 'P11')
            ]
          })

          expect(c.notation).toBe('M11 no(5) no(9)')
        })
      })

      it('Should give notation for a M13 chord with all notes from the C Major scale', () => {
        const notes = [
          'C4',
          'D4',
          'E4',
          'F4',
          'G4',
          'A4',
          'B4'
        ].map(n => Note.fromSPN(n))

        const c = new Chord({ root: notes[0]!, notes: [...notes] })
        expect(c.notation).toBe('M13')
      })

      it('Should dyads chords', () => {
        const c = new Chord({ root: new Note(), notes: [new Note(), new Note({ name: 'B' })] })
        expect(c.notation).toBe('M7 no(3) no(5)')
      })
    })

    describe('semitonesNotation', () => {
      it('Should be able to extract semitones notation from a chord', () => {
        expect(new Chord().semitonesNotation).toBe('047')
      })

      it('Should be able to extract semitones notation from a chord, with set intervals', () => {
        const c = new Chord()
        c.intervals = [
          new Interval(INTERVALS.P1.name),
          new Interval(INTERVALS.m3.name),
          new Interval(INTERVALS.P5.name)
        ]
        expect(c.semitonesNotation).toBe('037')
      })

      it('Should be able to extract semitones notation from a chord, with set notes', () => {
        const c = new Chord()
        c.notes = [
          Note.fromSPN('C4'),
          Note.fromSPN('Eb4'),
          Note.fromSPN('G4')
        ]
        expect(c.semitonesNotation).toBe('037')
      })
    })
  })
})
