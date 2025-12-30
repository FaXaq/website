import { describe, it, expect, beforeEach, vi } from "vitest"
import { TimeSignature } from "./TimeSignature"
import { Bar, BAR_TYPE_END, BAR_TYPE_START } from "./Bar"
import { SCORE_STAFF } from "./Score"
import { Chord } from "./Chord"
import { Note } from "./Note"
import { Rest } from "./Rest"
import { NOTE_VALUES } from "./NoteValue"

describe('Bar Class', () => {
  describe('Constructor', () => {
    it('Should work without parameters', () => {
      const bar = new Bar({
        autoFill: false
      })
      expect(bar.timeSignature instanceof TimeSignature).toBe(true)
      expect(Array.isArray(bar.content)).toBe(true)
      expect(bar.content.length).toBe(0)
      expect(Object.values(SCORE_STAFF).includes(bar.staff)).toBe(true)
      expect(Object.values(BAR_TYPE_START).includes(bar.typeStart)).toBe(true)
      expect(Object.values(BAR_TYPE_END).includes(bar.typeEnd)).toBe(true)
    })
  })

  describe('Add Content', () => {
    let bar = new Bar()

    beforeEach(() => {
      bar = new Bar({
        autoFill: false
      })
    })

    it('Should be able to add a Chord', () => {
      expect(() => {
        bar.addContent(new Chord())
      }).not.toThrow()
    })

    it('Should be able to add a Note', () => {
      expect(() => {
        bar.addContent(new Note())
      }).not.toThrow()
    })

    it('Should be able to add a Rest', () => {
      expect(() => {
        bar.addContent(new Rest())
      }).not.toThrow()
    })

    it('Should error when addind something else', () => {
      expect(() => {
        // @ts-expect-error
        bar.addContent({})
      }).toThrow()

      expect(() => {
        // @ts-expect-error
        bar.addContent([])
      }).toThrow()
    })
  })

  describe('Getters & Setters', () => {
    describe('Time Signature', () => {
      it('Should get & set with error handling', () => {
        const bar = new Bar()

        expect(bar.timeSignature instanceof TimeSignature).toBe(true)
        expect(() => {
          bar.timeSignature = new TimeSignature()
        }).not.toThrow()

        expect(() => {
          // @ts-expect-error
          bar.timeSignature = 'toto'
        }).toThrow()
      })
    })

    describe('Content', () => {
      it('Should get & set with error handling', () => {
        const bar = new Bar({
          autoFill: false
        })

        expect(bar.content.length === 0).toBe(true)

        bar.content = [
          new Note(),
          new Note(),
          new Note(),
          new Note()
        ]

        expect(bar.content.length === 0).toBe(false)
        expect(bar.content.length === 4).toBe(true)

        expect(() => {
          // @ts-expect-error
          bar.content = 'test'
        }).toThrow()
      })
    })
  })

  describe('Fill bar with rests', () => {
    it('Should know when a bar is full', () => {
      const bar = new Bar({
        autoFill: false
      })

      expect(bar.isFull()).toBe(false)
    })

    it('Should trigger fill empty space by default on setting content', () => {
      const bar = new Bar()
      // create spy function
      const spy = vi.fn(bar.fillEmptySpace)
      // replace it in original object
      bar.fillEmptySpace = spy
      // content assignement should trigger fillEmptySpace
      bar.content = []
      expect(spy).toHaveBeenCalledTimes(1)
      expect(bar.isFull()).toBe(true)
    })

    it('Should trigger fill empty space by default on modifying content', () => {
      const bar = new Bar()
      // create spy function
      const spy = vi.fn(bar.fillEmptySpace)
      // replace it in original object
      bar.fillEmptySpace = spy
      // content modification should trigger fillEmptySpace
      bar.modifyContent(0, new Note())
      expect(spy).toHaveBeenCalledTimes(1)
      expect(bar.isFull()).toBe(true)
    })

    it('Shouldn\'t trigger fill empty space on setting content, modifying and adding if autoFill false is provided at instanciation', () => {
      const bar = new Bar({
        autoFill: false
      })
      // create spy function
      const spy = vi.fn(bar.fillEmptySpace)
      // replace it in original object
      bar.fillEmptySpace = spy
      // content assignement shouldn't trigger fillEmptySpace
      bar.content = []
      // adding content shouldn't trigger fillEmptySpace
      bar.addContent(new Note())
      // content modification shouldn't trigger fillEmptySpace
      bar.modifyContent(0, new Note())
      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('Should fill empty space in a bar at instanciation by default', () => {
      const bar = new Bar()
      expect(bar.isFull()).toBe(true)
    })
  })

  describe('Add content to bar', () => {
    it('Should error when trying to add content to a bar that is already full', () => {
      const bar = new Bar()
      expect(() => bar.addContent(new Note())).toThrow()
    })

    it('Should error when trying to add not allowed content to a bar', () => {
      const bar = new Bar({
        autoFill: false
      })
      expect(() => bar.addContent(new Note({
        value: NOTE_VALUES.DOUBLE_WHOLE
      }))).toThrow()
    })

    it('Should fill empty space when asked for it', () => {
      const bar = new Bar({
        autoFill: false
      })
      // create spy function
      const spy = vi.fn(bar.fillEmptySpace)
      // replace it in original object
      bar.fillEmptySpace = spy
      bar.addContent(new Note(), true)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('Can modify content of a bar', () => {
    it('Should error when there is no content at the index provided', () => {
      const bar = new Bar({
        autoFill: false
      })

      expect(() => bar.modifyContent(0, new Note())).toThrow()
    })
  })
})
