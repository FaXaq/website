export const NOTE_VALUES = {
  LARGE: 8,
  LONG: 4,
  DOUBLE_WHOLE: 2,
  WHOLE: 1,
  HALF: 1 / 2,
  QUARTER: 1 / 4,
  EIGHT: 1 / 8,
  SIXTEENTH: 1 / 16,
  THIRTY_SECOND: 1 / 32,
  SIXY_FOURTH: 1 / 64,
  HUNDRED_TWENTY_EIGHTH: 1 / 128,
  TWO_HUNDRED_FIFTY_SIXTH: 1 / 256
}

export declare type NOTE_VALUE = typeof NOTE_VALUES[keyof typeof NOTE_VALUES]

export const SORTED_NOTE_VALUES = (Object.keys(NOTE_VALUES) as Array<keyof typeof NOTE_VALUES>)
  .map(v => NOTE_VALUES[v]).sort((a, b) => a - b)

export const REVERSE_SORTED_NOTE_VALUES = SORTED_NOTE_VALUES.reverse()
export const DEFAULT_NOTE_VALUE: NOTE_VALUE = NOTE_VALUES.QUARTER
