import { describe, it, expect } from 'vitest'
import { Interval, INTERVALS } from './Interval'
import { Pitch } from './Pitch'
import { Note } from './Note'
import { ACCIDENTAL, Accidental } from './Accidental'

describe('Interval class', () => {
  describe('Constructor', () => {
    it('Should always work as interval in not an instanciable class', () => {
      expect(() => { new Interval('P1') }).not.toThrow()
      expect(() => { new Interval('A2') }).not.toThrow()
    })
  })

  describe('Static', () => {
    it('Should give intervals from semitones', () => {
      expect(Interval.fromSemitones(1).length).toBe(2)
      expect(Interval.fromSemitones(3).length).toBe(2)
      expect(Interval.fromSemitones(10).length).toBe(2)
      expect(Interval.fromSemitones(12).length).toBe(3)
    })
    it('Should give intervals from value', () => {
      expect(Interval.fromValue(1).length).toBe(2)
      expect(Interval.fromValue(3).length).toBe(4)
      expect(Interval.fromValue(10).length).toBe(4)
      expect(Interval.fromValue(12).length).toBe(3)
    })
    it('Should give interval from semitones and value', () => {
      expect(Interval.fromSemitonesAndValue(1, 1)).not.toBe(undefined)
      expect(Interval.fromSemitonesAndValue(2, 3)).not.toBe(undefined)
      expect(Interval.fromSemitonesAndValue(1, 12)).toBe(undefined)
    })
    it('Should give intervals from chord semitones notation', () => {
      expect(Interval.fromChordSemitonesNotation('1')).not.toBe(undefined)
      expect(Interval.fromChordSemitonesNotation('X')).not.toBe(undefined)
      expect(Interval.fromChordSemitonesNotation('N')).not.toBe(undefined)
      expect(Interval.fromChordSemitonesNotation('14')).toBe(undefined)
    })
  })

  describe('Get new note from interval name and initial note', () => {
    describe('Should work with a note without accidental', () => {
      it('Should work with the perfect unison', () => {
        const note1 = new Note({
          name: 'C'
        })

        const expected = new Note({
          name: 'C'
        })

        expect(Interval.apply(note1, 'P1').SPN).toBe(expected.SPN)
      })

      it('Should work with the perfect octave', () => {
        const note1 = new Note({
          name: 'C'
        })

        const expected = new Note({
          name: 'C',
          pitch: new Pitch({
            value: 5
          })
        })

        expect(Interval.apply(note1, 'P8').SPN).toBe(expected.SPN)
      })

      it('Should work when obtaining a note with a lesser accidental', () => {
        const note1 = new Note({
          name: 'C'
        })

        const expected = new Note({
          name: 'D',
          accidental: new Accidental({
            semitones: ACCIDENTAL.FLAT
          })
        })

        expect(Interval.apply(note1, 'm2')).toEqual(expected)
      })

      it('Should work when obtaining a note with a higher', () => {
        const note1 = new Note({
          name: 'C'
        })

        const expected = new Note({
          name: 'D',
          accidental: new Accidental({
            semitones: ACCIDENTAL.SHARP
          })
        })

        expect(Interval.apply(note1, 'A2')).toEqual(expected)
      })
    })

    describe('Should work with a note with accidental', () => {
      it('Should work with the perfect unison', () => {
        const note1 = new Note({
          name: 'C',
          pitch: new Pitch({
            value: 4
          }),
          accidental: new Accidental({
            semitones: 1
          })
        })

        const expected = new Note({
          name: 'C',
          pitch: new Pitch({
            value: 4
          }),
          accidental: new Accidental({
            semitones: 1
          })
        })

        expect(Interval.apply(note1, 'P1')).toEqual(expected)
      })

      it('Should work with the perfect octave', () => {
        const note1 = new Note({
          name: 'C',
          pitch: new Pitch({
            value: 4
          }),
          accidental: new Accidental({
            semitones: 1
          })
        })

        const expected = new Note({
          name: 'C',
          pitch: new Pitch({
            value: 5
          }),
          accidental: new Accidental({
            semitones: 1
          })
        })

        expect(Interval.apply(note1, 'P8')).toEqual(expected)
      })
    })

    describe('Should be able to modify interval to its next octave', () => {
      it('Should work with an interval with value below 8', () => {
      })

      it('Should not work with an interval with value above 7', () => {
        expect(() => { new Interval('P8').raiseOctave() }).toThrow()
      })
    })
  })

  describe('Getters', () => {
    describe('notation', () => {
      it('Should get a notation from an interval name', () => {
        let interval = new Interval('P5')
        expect(interval.notation).toBe('5')
        interval = new Interval('d5')
        expect(interval.notation).toBe('-5')
        interval = new Interval('A5')
        expect(interval.notation).toBe('+5')
        interval = new Interval('A13')
        expect(interval.notation).toBe('+13')
        interval = new Interval('M13')
        expect(interval.notation).toBe('13')
        interval = new Interval('m13')
        expect(interval.notation).toBe('-13')
        interval = new Interval('d13')
        expect(interval.notation).toBe('°13')
      })
    })
  })
})
