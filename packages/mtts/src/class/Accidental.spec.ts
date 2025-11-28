import { describe, it, expect } from "vitest";
import { ACCIDENTAL, Accidental, ACCIDENTALS } from "./Accidental";

describe('Accidental class', () => {
  describe('Constants', () => {
    it('Should have all Accidental names', () => {
      expect(ACCIDENTALS).toEqual([
        'DOUBLE_FLAT',
        'FLAT',
        'NATURAL',
        'SHARP',
        'DOUBLE_SHARP'
      ])
    })
  })
  describe('Constructor', () => {
    it('Should check if the name is valid before creating an accidental', () => {
      expect(() => {
        new Accidental({
          semitones: -3
        })
      }).toThrow()
    })

    it('Should create an accidental if the name is valid', () => {
      expect(() => {
        new Accidental({
          semitones: ACCIDENTAL.SHARP
        })
      }).not.toThrow()
    })

    it('Should create a note with a default value of n (for natural)', () => {
      const accidental = new Accidental()
      expect(accidental.name).toBe('NATURAL')
    })
  })

  describe('Setters', () => {
    const accidental = new Accidental({
      semitones: ACCIDENTAL.FLAT
    })

    it('Should be able to set accidental through semitones', () => {
      accidental.semitones = -2
      expect(accidental.name).toBe('DOUBLE_FLAT')
    })
  })

  describe('Modifiers', () => {
    describe('Add Sharp', () => {
      it('Should be able to add a sharp to an existing accidental', () => {
        const accidental = new Accidental()
        expect(() => {
          accidental.addSharp()
        }).not.toThrow()
      })

      it('Should error if the accidental is already a double sharp', () => {
        const accidental = new Accidental({
          semitones: ACCIDENTAL.DOUBLE_SHARP
        })

        expect(() => {
          accidental.addSharp()
        }).toThrow()
      })
    })

    describe('Add Flat', () => {
      it('Should be able to add a flat to an existing accidental', () => {
        const accidental = new Accidental()
        expect(() => {
          accidental.addFlat()
        }).not.toThrow()
      })

      it('Should error if the accidental is already a double flat', () => {
        const accidental = new Accidental({
          semitones: ACCIDENTAL.DOUBLE_FLAT
        })

        expect(() => {
          accidental.addFlat()
        }).toThrow()
      })
    })
  })

  describe('Static', () => {
    describe('fromString', () => {
      it('Should detect accidental from string', () => {
        let accidental = Accidental.fromString('#')
        expect(accidental.semitones).toBe(1)
        accidental = Accidental.fromString('♯')
        expect(accidental.semitones).toBe(1)

        accidental = Accidental.fromString('𝄪')
        expect(accidental.semitones).toBe(2)

        accidental = Accidental.fromString('b')
        expect(accidental.semitones).toBe(-1)
        accidental = Accidental.fromString('♭')
        expect(accidental.semitones).toBe(-1)

        accidental = Accidental.fromString('bb')
        expect(accidental.semitones).toBe(-2)
        accidental = Accidental.fromString('𝄫')
        expect(accidental.semitones).toBe(-2)

        accidental = Accidental.fromString('♮')
        expect(accidental.semitones).toBe(0)
      })
    })
  })

  describe('SPN notation', () => {
    it('Should get note SPN when note is valid', () => {
      const accidental1 = new Accidental()
      expect(accidental1.SPN).toBe('')
      const accidental2 = new Accidental({ semitones: -1 })
      expect(accidental2.SPN).toBe('b')
      const accidental3 = new Accidental({ semitones: -2 })
      expect(accidental3.SPN).toBe('bb')
      const accidental4 = new Accidental({ semitones: 1 })
      expect(accidental4.SPN).toBe('#')
      const accidental5 = new Accidental({ semitones: 2 })
      expect(accidental5.SPN).toBe('x')
    })

    it('Should error on get SPN when not provided a valid note', () => {
      expect(() => Accidental.fromSPN('tartiflette')).toThrow()
    })

    it('Should create a not from a SPN string', () => {
      expect(Accidental.fromSPN('n')).toEqual(new Accidental())
    })
  })
})
