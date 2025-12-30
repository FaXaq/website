import { describe, it, expect } from 'vitest'
import { Rest } from './Rest'

describe('Rest Class', () => {
  describe('constructor', () => {
    it('Should instanciate a rest without parameter', () => {
      expect(() => new Rest()).not.toThrow()
    })
  })

  describe('Static', () => {
    describe('findLargest', () => {
      it('Should error when negative value is passed to it', () => {
        expect(() => Rest.findLargest(-3)).toThrow()
      })
    })
  })
})
