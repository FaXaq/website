import { describe, it, beforeEach, expect } from 'vitest'
import { Pitch } from './Pitch'

describe('Pitch Class', () => {
  describe('Constructor', () => {
    it('Should create a pitch with a default of 4', () => {
      const pitch = new Pitch()
      expect(pitch.value).toBe(4)
    })

    it('Should accept a number as a parameter', () => {
      const pitch = new Pitch({
        value: 5
      })
      expect(pitch.value).toBe(5)
    })

    it('Should not accept negative integers as parameters', () => {
      expect(() => {
        new Pitch({
          value: -3
        })
      }).toThrow()
    })
  })

  describe('Inc & Dec', () => {
    let pitch: Pitch

    beforeEach(() => {
      pitch = new Pitch()
    })

    describe('Inc', () => {
      it('Should be able to increment a pitch', () => {
        pitch.inc()
        expect(pitch.value).toBe(5)
      })
    })

    describe('Dec', () => {
      it('Should be able to decrement a pitch', () => {
        pitch.dec()
        expect(pitch.value).toBe(3)
      })

      it('Should error when the result of decrement is negative', () => {
        pitch = new Pitch({
          value: 0
        })
        expect(() => { pitch.dec() }).toThrow()
      })
    })
  })
})
