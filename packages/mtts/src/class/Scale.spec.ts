import { describe, it, expect } from 'vitest'
import { Scale } from './Scale'
import { Note } from './Note'
import { Interval } from './Interval'

describe('Scale class', () => {
  describe('Constructor', () => {
    it('Should create a major scale without name provided', () => {
      const s = new Scale()
      expect(s.name).toBe('major')
      expect(s.key).toEqual(new Note({
        name: 'C'
      }))
      expect(s.notes.map((n: Note) => n.SPN)).toEqual([
        new Note({ name: 'C' }),
        new Note({ name: 'D' }),
        new Note({ name: 'E' }),
        new Note({ name: 'F' }),
        new Note({ name: 'G' }),
        new Note({ name: 'A' }),
        new Note({ name: 'B' })
      ].map((n: Note) => n.SPN))
    })

    it('Should reject any name unknown', () => {
      expect(() => {
        new Scale({
          name: 'wat'
        })
      }).toThrow()
    })
  })

  describe('Get & Set intervals', () => {
    it('Shoule be able to provide intervals at instanciation', () => {
      let s: Scale | undefined
      const intervals = [
        new Interval('P1'),
        new Interval('m2'),
        new Interval('M3'),
        new Interval('A4'),
        new Interval('P5'),
        new Interval('m6'),
        new Interval('M7')
      ]
      expect(() => {
        s = new Scale({
          intervals: intervals
        })
      }).not.toThrow()

      expect(s!.intervals).toEqual(intervals)
    })

    it('Should be able to set intervals after creating it.', () => {
      const s = new Scale()
      expect(() => {
        s.intervals = [new Interval('P1'), new Interval('P5')]
      }).not.toThrow()

      expect(s.notes.map((n: Note) => n.SPN)).toEqual([Note.fromSPN('C4').SPN, Note.fromSPN('G4').SPN])
    })

    it('Should refuse something other than an array of intervals.', () => {
      expect(() => {
        // @ts-expect-error purposely bad input
        new Scale({ intervals: [{ 2: 'test' }] })
      }).toThrow()
    })
  })

  describe('Get & Set mode & name', () => {
    describe('setters', () => {
      it('Should create a scale from a name', () => {
        expect(new Scale({ name: 'major' })).toEqual(new Scale())
      })

      it('Should be able to set a name after its creation', () => {
        // default is major
        const s = new Scale()
        s.name = 'natural_minor'
        expect(s).toEqual(new Scale({ name: 'natural_minor' }))
      })

      it('Should create a scale from a mode', () => {
        expect(new Scale({ mode: 'aeolian' })).toEqual(new Scale({ name: 'natural_minor' }))
      })
      it('Should be able to set a mode after its creation', () => {
        // default is ionian
        const s = new Scale()
        s.mode = 'aeolian'
        expect(s).toEqual(new Scale({ name: 'natural_minor' }))
      })

      it('Should throw when name / mode is unknown', () => {
        const s = new Scale()

        expect(() => { s.name = 'tartiflette' }).toThrow()
        expect(() => { s.name = ['tartiflette'] as any }).toThrow()
        expect(() => { s.mode = 'tartiflette' }).toThrow()
        expect(() => { s.mode = { tartiflette: 2 } as any }).toThrow()
      })
    })

    describe('getters', () => {
      it('Should get a scale name', () => {
        expect(new Scale().name).toBe('major')
        expect(new Scale().mode).toBe('ionian')
        expect(new Scale({
          intervals: [
            new Interval('P1'),
            new Interval('M2'),
            new Interval('P4'),
            new Interval('P5'),
            new Interval('M6'),
            new Interval('M7'),
            new Interval('M3')
          ]
        }).mode).toBe('ionian')
      })

      it('Should be able to set a name after its creation', () => {
        // Seems blank; no content in original
      })

      it('Should return an empty string when definition is not found', () => {
        const s = new Scale({ intervals: [new Interval('P1'), new Interval('A2')] })
        expect(s.name).toBe('')
        expect(s.mode).toBe('')
      })
    })
  })

  describe('Generate chords', () => {
    it('Should generate default 7th chords from the current scale', () => {
      const s = new Scale()
      expect(s.scaleChords.length).toBe(7)
    })
  })
})
