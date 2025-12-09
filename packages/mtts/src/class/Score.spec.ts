import { describe, it, expect } from 'vitest'
import { Scale } from './Scale'
import { Score, SCORE_STAFF } from './Score'
import { TimeSignature } from './TimeSignature'
import { Note } from './Note'

describe('Score Class', () => {
  describe('Constructor', () => {
    it('Should create a new score without any argument with default values', () => {
      const s = new Score()
      expect(s).toBeInstanceOf(Score)
      expect(s.keySignature).toBeInstanceOf(Scale)
      // verify that the staff belongs to SCORE_STAFF enum
      expect(Object.values(SCORE_STAFF).indexOf(s.staff)).toBeGreaterThan(-1)
      expect(s.timeSignature).toBeInstanceOf(TimeSignature)
      expect(Array.isArray(s.bars)).toBe(true)
      expect(typeof s.defaultNoteValue).toBe('number')
    })

    it('Should provide measure alternative to bars', () => {
      const s = new Score()
      expect(Array.isArray(s.measures)).toBe(true)
      expect(() => { s.measures = [] }).not.toThrow()
    })
  })

  describe('Getters & Setters', () => {
    describe('Last Bar', () => {
      it('Should get last bar of the score (create it if none exists)', () => {
        const s = new Score()
        expect(() => { console.log(s.lastBar) }).toThrow()
      })
    })
  })

  describe('Add Content', () => {
    it('Should add content to the last bar', () => {
      const s = new Score()
      expect(() => { s.addContent(new Note()) }).not.toThrow()
    })
  })
})
