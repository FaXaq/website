// src/class/Pitch.ts
var Pitch = class {
  _value;
  constructor(params = { value: 4 }) {
    this.value = params.value;
  }
  inc() {
    this.value++;
  }
  dec() {
    this.value--;
  }
  // getters & setters
  get value() {
    return this._value;
  }
  set value(value) {
    if (value > -1) {
      this._value = value;
    } else {
      throw new Error(`Trying to set a negative pitch : ${value}`);
    }
  }
};

// src/class/Accidental.ts
var ACCIDENTAL = /* @__PURE__ */ ((ACCIDENTAL2) => {
  ACCIDENTAL2[ACCIDENTAL2["DOUBLE_FLAT"] = -2] = "DOUBLE_FLAT";
  ACCIDENTAL2[ACCIDENTAL2["FLAT"] = -1] = "FLAT";
  ACCIDENTAL2[ACCIDENTAL2["NATURAL"] = 0] = "NATURAL";
  ACCIDENTAL2[ACCIDENTAL2["SHARP"] = 1] = "SHARP";
  ACCIDENTAL2[ACCIDENTAL2["DOUBLE_SHARP"] = 2] = "DOUBLE_SHARP";
  return ACCIDENTAL2;
})(ACCIDENTAL || {});
var ACCIDENTALS = Object.keys(ACCIDENTAL).filter(
  (p) => isNaN(parseInt(p))
);
var Accidental = class _Accidental {
  _semitones;
  constructor(params = { semitones: 0 }) {
    this.semitones = params.semitones;
  }
  addSharp() {
    switch (this.semitones) {
      case 2:
        throw new Error("Cannot add sharp to a DOUBLE_SHARP.");
      default:
        this.semitones++;
    }
    return this;
  }
  addFlat() {
    switch (this.semitones) {
      case -2:
        throw new Error("Cannot add flat to a DOUBLE_FLAT.");
      default:
        this.semitones--;
    }
    return this;
  }
  // getters & setters
  // semitones
  get semitones() {
    return this._semitones;
  }
  set semitones(semitones) {
    if (ACCIDENTAL[semitones] !== void 0) {
      this._semitones = semitones;
    } else {
      throw new Error(
        `Couldn't find a semitone with the value ${semitones}. Semitones available : ${Object.keys(ACCIDENTAL).join(", ")}`
      );
    }
  }
  // name
  get name() {
    return ACCIDENTAL[this._semitones];
  }
  get SPN() {
    return _Accidental.toSPN(this);
  }
  static fromString(s) {
    switch (s) {
      case "b":
      case "\u266D":
        return new _Accidental({
          semitones: -1
        });
      case "bb":
      case "\u{1D12B}":
        return new _Accidental({
          semitones: -2
        });
      case "s":
      case "#":
      case "\u266F":
        return new _Accidental({
          semitones: 1
        });
      case "\u{1D12A}":
        return new _Accidental({
          semitones: 2
        });
      case "n":
      case "\u266E":
        return new _Accidental({
          semitones: 0
        });
      default:
        throw new Error(`Couldn't find an accidental for this string : ${JSON.stringify(s)}.`);
    }
  }
  /**
   * To Scientific Pitch Notation
   */
  static toSPN(accidental) {
    switch (accidental.name) {
      case "SHARP":
        return "#";
      case "FLAT":
        return "b";
      case "DOUBLE_SHARP":
        return "x";
      case "DOUBLE_FLAT":
        return "bb";
      case "NATURAL":
        return "";
      default:
        throw new Error(`Couldn't find SPN for this accidental : ${JSON.stringify(accidental)}.`);
    }
  }
  /**
   * To Scientific Pitch Notation
   */
  static fromSPN(s) {
    return _Accidental.fromString(s);
  }
};

// src/class/NoteValue.ts
var NOTE_VALUES = {
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
};
var SORTED_NOTE_VALUES = Object.keys(NOTE_VALUES).map((v) => NOTE_VALUES[v]).sort((a, b) => a - b);
var REVERSE_SORTED_NOTE_VALUES = SORTED_NOTE_VALUES.reverse();
var DEFAULT_NOTE_VALUE = NOTE_VALUES.QUARTER;

// src/super/ValuedBarContent.ts
var ValuedBarContent = class {
  _value;
  _dots;
  constructor(params = {}) {
    this.value = params.value ?? DEFAULT_NOTE_VALUE;
    this.dots = params.dots ?? 0;
  }
  // getters & setters
  set value(value) {
    this._value = value;
  }
  get value() {
    return this._value;
  }
  set dots(dots) {
    this._dots = dots;
  }
  get dots() {
    return this._dots;
  }
  get dottedValue() {
    return this.value + this.value / 2 * this.dots;
  }
};

// src/class/Interval.ts
var SEMITONES_WITHIN_OCTAVE = 12;
var INTERVALS = {
  "P1": { name: "P1", value: 1, semitones: 0 },
  "d2": { name: "d2", value: 2, semitones: 0 },
  "m2": { name: "m2", value: 2, semitones: 1 },
  "A1": { name: "A1", value: 1, semitones: 1 },
  "M2": { name: "M2", value: 2, semitones: 2 },
  "d3": { name: "d3", value: 3, semitones: 2 },
  "m3": { name: "m3", value: 3, semitones: 3 },
  "A2": { name: "A2", value: 2, semitones: 3 },
  "M3": { name: "M3", value: 3, semitones: 4 },
  "d4": { name: "d4", value: 4, semitones: 4 },
  "P4": { name: "P4", value: 4, semitones: 5 },
  "A3": { name: "A3", value: 3, semitones: 5 },
  "d5": { name: "d5", value: 5, semitones: 6 },
  "A4": { name: "A4", value: 4, semitones: 6 },
  "P5": { name: "P5", value: 5, semitones: 7 },
  "d6": { name: "d6", value: 6, semitones: 7 },
  "m6": { name: "m6", value: 6, semitones: 8 },
  "A5": { name: "A5", value: 5, semitones: 8 },
  "M6": { name: "M6", value: 6, semitones: 9 },
  "d7": { name: "d7", value: 7, semitones: 9 },
  "m7": { name: "m7", value: 7, semitones: 10 },
  "A6": { name: "A6", value: 6, semitones: 10 },
  "M7": { name: "M7", value: 7, semitones: 11 },
  "d8": { name: "d8", value: 8, semitones: 11 },
  "P8": { name: "P8", value: 8, semitones: 12 },
  "A7": { name: "A7", value: 7, semitones: 12 },
  "d9": { name: "d9", value: 9, semitones: 12 },
  "m9": { name: "m9", value: 9, semitones: 13 },
  "A8": { name: "A8", value: 8, semitones: 13 },
  "M9": { name: "M9", value: 9, semitones: 14 },
  "d10": { name: "d10", value: 10, semitones: 14 },
  "m10": { name: "m10", value: 10, semitones: 15 },
  "A9": { name: "A9", value: 9, semitones: 15 },
  "M10": { name: "M10", value: 10, semitones: 16 },
  "d11": { name: "d11", value: 11, semitones: 16 },
  "A10": { name: "A10", value: 10, semitones: 17 },
  "P11": { name: "P11", value: 11, semitones: 17 },
  "d12": { name: "d12", value: 12, semitones: 18 },
  "A11": { name: "A11", value: 11, semitones: 18 },
  "P12": { name: "P12", value: 12, semitones: 19 },
  "d13": { name: "d13", value: 13, semitones: 19 },
  "m13": { name: "m13", value: 13, semitones: 20 },
  "A12": { name: "A12", value: 12, semitones: 20 },
  "M13": { name: "M13", value: 13, semitones: 21 },
  "d14": { name: "d14", value: 14, semitones: 21 },
  "m14": { name: "m14", value: 14, semitones: 22 },
  "A13": { name: "A13", value: 13, semitones: 22 },
  "M14": { name: "M14", value: 14, semitones: 23 },
  "d15": { name: "d15", value: 15, semitones: 23 },
  "P15": { name: "P15", value: 15, semitones: 24 },
  "A14": { name: "A14", value: 14, semitones: 24 },
  "A15": { name: "A15", value: 15, semitones: 25 }
};
var Interval = class _Interval {
  name;
  semitones;
  value;
  constructor(name) {
    if (INTERVALS[name] !== void 0) {
      this.name = name;
      this.semitones = INTERVALS[name].semitones;
      this.value = INTERVALS[name].value;
    } else {
      throw new Error(`Interval with ${name} does not exist.`);
    }
  }
  apply(note) {
    return _Interval.apply(note, this.name);
  }
  get notation() {
    return _Interval.notation(this.name);
  }
  get chordSemitonesNotation() {
    return _Interval.chordSemitonesNotation(this);
  }
  raiseOctave() {
    const interval = _Interval.raiseOctave(this);
    if (interval !== void 0) {
      return interval;
    }
    return _Interval.fromSemitonesAndValue(this.semitones, this.value);
  }
  static raiseOctave(interval) {
    if (interval.value < 8) {
      return _Interval.fromSemitonesAndValue(interval.semitones + 12, interval.value + 7);
    } else {
      throw new Error(`Interval ${interval.name} cannot be raised to octave.`);
    }
  }
  static fromSemitones(semitones) {
    const intervals = [];
    for (const key in INTERVALS) {
      if (INTERVALS[key].semitones === semitones) {
        intervals.push(new _Interval(INTERVALS[key].name));
      }
    }
    return intervals;
  }
  static fromValue(value) {
    const intervals = [];
    for (const key in INTERVALS) {
      if (INTERVALS[key].value === value) {
        intervals.push(new _Interval(INTERVALS[key].name));
      }
    }
    return intervals;
  }
  static fromSemitonesAndValue(semitones, value) {
    return _Interval.fromSemitones(semitones).find((interval) => {
      return interval.value % NOTES.length === value % NOTES.length;
    });
  }
  static getSemitones(name) {
    return INTERVALS[name].semitones;
  }
  static apply(note, name) {
    const newNote = note.duplicate();
    let intervalValue = _Interval.getValue(name);
    while (intervalValue > 1) {
      newNote.next();
      intervalValue--;
    }
    const semitonesDifference = _Interval.getSemitones(name) - note.getSemitonesTo(newNote);
    if (semitonesDifference < 0) {
      newNote.flattenTo(semitonesDifference);
    } else if (semitonesDifference > 0) {
      newNote.sharpenTo(semitonesDifference);
    }
    return newNote;
  }
  static getValue(name) {
    return INTERVALS[name].value;
  }
  static fromName(name) {
    return new _Interval(name);
  }
  static equals(interval1, interval2) {
    return interval1.name === interval2.name;
  }
  static notation(name) {
    if (!INTERVALS[name]) {
      throw new Error(`No interval known with that name : ${name}. Cannot get its notation.`);
    }
    const [modifier, ...values] = name.split("");
    const value = values.join("");
    switch (value) {
      case "4":
      case "5":
      case "11":
      case "12":
        switch (modifier) {
          case "d":
            return `-${value}`;
          case "A":
            return `+${value}`;
          default:
            return value;
        }
      default:
        switch (modifier) {
          case "d":
            return `\xB0${value}`;
          case "m":
            return `-${value}`;
          case "A":
            return `+${value}`;
          default:
            return value;
        }
    }
  }
  static chordSemitonesNotation(interval) {
    const semitones = interval.semitones % SEMITONES_WITHIN_OCTAVE;
    if (semitones === 10) {
      return "X";
    } else if (semitones === 11) {
      return "N";
    }
    return semitones.toString();
  }
  /**
   * Chord semitones notation indicates the semitones of the corresponding interval by only one character.
   * For reference :
   * - 0 means that this is a 0 semitone interval
   * - 1 means that this is a 1 semitone interval
   * - 2 means that this is a 1 semitones interval
   * ...
   * - X means that this is a 10 semitones interval
   * - N means that this is a 11 semitones interval
   * And it circles back to 0.
   * There is no such thing as 12 semitones interval, since there is only one semitone whithin one octave.
   * @param chordSemitonesNotation
   * @returns
   */
  static fromChordSemitonesNotation(chordSemitonesNotation) {
    if (chordSemitonesNotation === "N") {
      return _Interval.fromSemitones(11);
    }
    if (chordSemitonesNotation === "X") {
      return _Interval.fromSemitones(10);
    }
    const parsedNotation = parseInt(chordSemitonesNotation);
    if (!Number.isNaN(parsedNotation) && parsedNotation <= 9) {
      return _Interval.fromSemitones(parsedNotation);
    }
  }
};

// src/class/Note.ts
var NOTES = ["C", "D", "E", "F", "G", "A", "B"];
var BASE_FREQUENCY = 440;
var Note2 = class _Note extends ValuedBarContent {
  _name;
  _pitch;
  _accidental;
  constructor(params = { name: "C" }) {
    super(params);
    this.name = params.name ?? "C";
    this.value = params.value ?? DEFAULT_NOTE_VALUE;
    this.pitch = params.pitch ?? new Pitch();
    this.dots = params.dots ?? 0;
    if (params.accidental !== void 0) this.accidental = params.accidental;
  }
  /**
   * Adds a sharp accidental (if one is already there, adds a second one)
   */
  addSharp() {
    if (!this.hasAccidental()) {
      this.accidental = new Accidental({ semitones: 1 /* SHARP */ });
    } else {
      this.accidental.addSharp();
    }
    return this;
  }
  sharpenTo(n) {
    while (n > 0) {
      this.addSharp();
      n--;
    }
    return this;
  }
  /**
   * Adds a flat to the current note (or flatten the accidental)
   */
  addFlat() {
    if (!this.hasAccidental()) {
      this.accidental = new Accidental({ semitones: -1 /* FLAT */ });
    } else {
      this.accidental.addFlat();
    }
    return this;
  }
  flattenTo(n) {
    while (n < 0) {
      this.addFlat();
      n++;
    }
    return this;
  }
  next() {
    if (this.name === "B") this.pitch.inc();
    this.name = NOTES[(this.index + 1) % NOTES.length];
    return this;
  }
  previous() {
    if (this.name === "C") this.pitch.dec();
    this.name = NOTES[(this.index - 1 + NOTES.length) % NOTES.length];
    return this;
  }
  sharpenChromatically(semitones = 1) {
    for (let i = 0; i < semitones; i++) {
      if (!this.hasAccidental()) {
        if (this.isBorE()) {
          this.next();
        } else {
          this.addSharp();
        }
      } else {
        if (this.accidental.semitones === -1) {
          this.addSharp();
        } else if (this.isBorE()) {
          this.removeAccidental();
          this.next().addSharp();
        } else {
          this.removeAccidental();
          this.next();
        }
      }
    }
    return this;
  }
  flattenChromatically(semitones = 1) {
    for (let i = 0; i < semitones; i++) {
      if (!this.hasAccidental()) {
        if (this.isCorF()) {
          this.previous();
        } else {
          this.addFlat();
        }
      } else {
        if (this.accidental.semitones === 1) {
          this.addFlat();
        } else if (this.isCorF()) {
          this.removeAccidental();
          this.previous().addFlat();
        } else {
          this.removeAccidental();
          this.previous();
        }
      }
    }
    return this;
  }
  // Get semitones between this note and the one passed as parameter
  getSemitonesTo(note) {
    return _Note.getSemitonesBetween(this, note);
  }
  duplicate() {
    return new _Note({
      name: this.name,
      pitch: new Pitch({
        value: this.pitch.value
      }),
      accidental: this.accidental !== void 0 ? new Accidental({ semitones: this.accidental.semitones }) : void 0
    });
  }
  removeAccidental() {
    delete this._accidental;
    return this;
  }
  // checks
  hasAccidental() {
    return this._accidental !== void 0;
  }
  isBorE() {
    return this.name === "B" || this.name === "E";
  }
  isCorF() {
    return this.name === "C" || this.name === "F";
  }
  // getters & setters
  // name
  set name(name) {
    if (_Note.validateName(name)) {
      this._name = name;
    } else {
      throw new Error(
        `Trying to set a name that doesn't exist to a note : ${name}. Possible notes : ${NOTES.join(", ")}`
      );
    }
  }
  get name() {
    return this._name;
  }
  // pitch
  set pitch(pitch) {
    this._pitch = pitch;
  }
  get pitch() {
    return this._pitch;
  }
  // note index
  get index() {
    return NOTES.indexOf(this.name);
  }
  // accidental
  set accidental(accidental) {
    this._accidental = accidental;
  }
  get accidental() {
    return this._accidental ?? new Accidental();
  }
  // frequency
  // Base frequency times 2 pow (semitones to A440 / 12)
  get frequency() {
    const baseA = new _Note({ name: "A", pitch: new Pitch({ value: 4 }) });
    return BASE_FREQUENCY * Math.pow(2, baseA.getSemitonesTo(this) / 12);
  }
  get SPN() {
    return _Note.toSPN(this);
  }
  // static methods
  static validateName(name) {
    return NOTES.indexOf(name) > -1;
  }
  static getSemitonesBetween(note1, note2) {
    let semitones = 0;
    let noteIndex = note1.index;
    while (NOTES[noteIndex] !== note2.name) {
      if (NOTES[noteIndex] === "B" || NOTES[noteIndex] === "E") semitones++;
      else semitones += 2;
      noteIndex = (noteIndex + 1) % NOTES.length;
    }
    if (note2.index < note1.index) semitones -= 12;
    semitones += (note2.pitch.value - note1.pitch.value) * 12;
    semitones += (note2.hasAccidental() ? note2.accidental.semitones : 0) - (note1.hasAccidental() ? note1.accidental.semitones : 0);
    return semitones;
  }
  /**
   * Get semitones between notes, ALWAYS considering destination note is ABOVE root and within one octave.
   * @param note1 The root from which you want to start counting semitones
   * @param note2 The destination note
   */
  static getNormalizedSemitonesBetween(note1, note2) {
    let semitones = _Note.getSemitonesBetween(note1, note2);
    if (semitones < 0) {
      semitones += SEMITONES_WITHIN_OCTAVE;
    }
    if (semitones > SEMITONES_WITHIN_OCTAVE) {
      semitones = semitones % SEMITONES_WITHIN_OCTAVE;
    }
    return semitones;
  }
  static getIndexDifferenceBetween(note1, note2) {
    return 1 + (note2.index - note1.index + NOTES.length) % NOTES.length;
  }
  /**
   * To Scientific Pitch Notation
   */
  static toSPN(n) {
    try {
      return `${n.name}${n.hasAccidental() ? n.accidental.SPN : ""}${n.pitch.value}`;
    } catch (err) {
      throw new Error(`The note you provided is incorrect. You provided : ${JSON.stringify(n)}.`);
    }
  }
  /**
   * From Scientific Pitch Notation
   */
  static fromSPN(s) {
    try {
      return new _Note({
        name: s[0],
        accidental: s.length > 2 ? Accidental.fromSPN(s.slice(1, s.length - 1)) : void 0,
        pitch: new Pitch({
          value: parseInt(s[s.length - 1])
        })
      });
    } catch (err) {
      throw new Error(`The string you provided is not a Scientific Pitch Notation. You provided : ${s}.`);
    }
  }
};

// src/misc/utils.ts
function cloneInstanceObject(instanciableObject) {
  return Object.assign(Object.create(Object.getPrototypeOf(instanciableObject)), instanciableObject);
}
function cloneInstanceObjectArray(instanceObjectArray) {
  return Array.from(instanceObjectArray, (instanceObject) => {
    return cloneInstanceObject(instanceObject);
  });
}

// src/class/Chord.ts
var TRIADS = {
  "maj": {
    key: "maj",
    name: "major",
    intervals: [new Interval("P1"), new Interval("M3"), new Interval("P5")],
    notation: ""
  },
  "min": {
    key: "min",
    name: "minor",
    intervals: [new Interval("P1"), new Interval("m3"), new Interval("P5")],
    notation: "-"
  },
  "aug": {
    key: "aug",
    name: "augmented",
    intervals: [new Interval("P1"), new Interval("M3"), new Interval("A5")],
    notation: "+"
  },
  "dim": {
    key: "dim",
    name: "diminished",
    intervals: [new Interval("P1"), new Interval("m3"), new Interval("d5")],
    notation: "\xB0"
  },
  "sus2": {
    key: "sus2",
    name: "suspended2",
    intervals: [new Interval("P1"), new Interval("M2"), new Interval("P5")],
    notation: "sus2"
  },
  "sus4": {
    key: "sus4",
    name: "suspended4",
    intervals: [new Interval("P1"), new Interval("P4"), new Interval("P5")],
    notation: "sus4"
  },
  "power": {
    key: "power",
    name: "power",
    intervals: [new Interval("P1"), new Interval("P5")],
    notation: "5"
  }
};
var EXTENDED_CHORDS = {
  M7: {
    key: "M7",
    addedTones: [new Interval("M7")],
    name: "major 7",
    notation: "M7",
    extends: TRIADS.maj
  },
  7: {
    key: "7",
    addedTones: [new Interval("m7")],
    name: "dominant 7",
    notation: "7",
    extends: TRIADS.maj
  },
  "-7/5b": {
    key: "-7/5b",
    addedTones: [new Interval("m7")],
    name: "minor 7 flat 5",
    notation: "-7/5b",
    extends: TRIADS.dim
  },
  m7: {
    key: "m7",
    addedTones: [new Interval("m7")],
    name: "minor 7",
    notation: "-7",
    extends: TRIADS.min
  },
  "7sus4": {
    key: "7sus4",
    addedTones: [new Interval("m7")],
    name: "dominant 7 sus 4",
    notation: "7sus4",
    extends: TRIADS.sus4
  },
  d7: {
    key: "d7",
    addedTones: [new Interval("d7")],
    name: "diminished 7",
    notation: "\xB07",
    extends: TRIADS.dim
  },
  mM7: {
    key: "mM7",
    addedTones: [new Interval("M7")],
    name: "minor major 7",
    notation: "mM7",
    extends: TRIADS.min
  },
  9: {
    key: "9",
    addedTones: [new Interval("m7"), new Interval("M9")],
    name: "7(9)",
    notation: "9",
    extends: TRIADS.maj
  },
  M9: {
    key: "M9",
    addedTones: [new Interval("M7"), new Interval("M9")],
    name: "M7(9)",
    notation: "M9",
    extends: TRIADS.maj
  },
  min9: {
    key: "min9",
    addedTones: [new Interval("m7"), new Interval("M9")],
    name: "-7(9)",
    notation: "-9",
    extends: TRIADS.min
  },
  11: {
    key: "11",
    addedTones: [new Interval("m7"), new Interval("M9"), new Interval("P11")],
    name: "7(11)",
    notation: "11",
    extends: TRIADS.maj
  },
  M11: {
    key: "M11",
    addedTones: [new Interval("M7"), new Interval("M9"), new Interval("P11")],
    name: "M7(11)",
    notation: "M11",
    extends: TRIADS.maj
  },
  m11: {
    key: "m11",
    addedTones: [new Interval("m7"), new Interval("M9"), new Interval("P11")],
    name: "-7(11)",
    notation: "-11",
    extends: TRIADS.min
  },
  13: {
    key: "13",
    addedTones: [new Interval("m7"), new Interval("M9"), new Interval("P11"), new Interval("M13")],
    name: "7(13)",
    notation: "13",
    extends: TRIADS.maj
  },
  M13: {
    key: "M13",
    addedTones: [new Interval("M7"), new Interval("M9"), new Interval("P11"), new Interval("M13")],
    name: "M7(13)",
    notation: "M13",
    extends: TRIADS.maj
  },
  m13: {
    key: "m13",
    addedTones: [new Interval("m7"), new Interval("M9"), new Interval("P11"), new Interval("M13")],
    name: "-7(13)",
    notation: "-13",
    extends: TRIADS.min
  },
  6: {
    key: "6",
    addedTones: [new Interval("M6")],
    name: "major 6",
    notation: "6",
    extends: TRIADS.maj
  },
  min6: {
    key: "min6",
    addedTones: [new Interval("M6")],
    name: "minor major 6",
    notation: "-6",
    extends: TRIADS.min
  }
};
function _recursiveExtendedChordCompute(chord, addedTones = []) {
  if (chord.intervals !== void 0) {
    return {
      intervals: chord.intervals,
      addedTones
    };
  }
  return _recursiveExtendedChordCompute(chord.extends, [
    ...chord.addedTones,
    ...addedTones
  ]);
}
var COMPUTED_EXTENDED_CHORDS = Object.values(EXTENDED_CHORDS).map((EXTENDED_CHORD) => {
  const { intervals, addedTones } = _recursiveExtendedChordCompute(
    EXTENDED_CHORD
  );
  return {
    ...EXTENDED_CHORD,
    intervals: [...intervals, ...addedTones]
  };
});
var ALL_POSSIBLE_CHORDS = [];
Object.keys(TRIADS).forEach((key) => ALL_POSSIBLE_CHORDS.push(TRIADS[key]));
ALL_POSSIBLE_CHORDS.push(...COMPUTED_EXTENDED_CHORDS);
var Chord = class _Chord extends ValuedBarContent {
  _root;
  _intervals;
  _notes = [];
  _definitions = [];
  constructor(params = {
    root: new Note2({ name: "C" }),
    value: DEFAULT_NOTE_VALUE
  }) {
    super();
    this.root = params.root;
    if (params.notes !== void 0 && params.notes.length > 0) {
      this.notes = params.notes;
      this.value = params.value ?? DEFAULT_NOTE_VALUE;
    } else {
      this.intervals = params.intervals ?? cloneInstanceObjectArray(TRIADS.maj.intervals);
      this.value = params.value ?? DEFAULT_NOTE_VALUE;
    }
  }
  get root() {
    return this._root;
  }
  set root(root) {
    if (root instanceof Note2) {
      this._root = root;
    } else {
      throw new Error(
        "Trying to set a root for a chord, with something that is note a Note"
      );
    }
  }
  get intervals() {
    return this._intervals;
  }
  set intervals(intervals) {
    const notes = [];
    intervals.forEach((i) => {
      if (!(i instanceof Interval)) {
        throw new Error(
          `Trying to set interval for chords, but ${JSON.stringify(
            i
          )} is not an Interval.`
        );
      }
      notes.push(Interval.apply(this._root, i.name));
    });
    this._notes = notes;
    this._intervals = intervals;
  }
  set notes(notes) {
    const lowestNote = notes.sort((n1, n2) => n1.frequency - n2.frequency)[0];
    const semitonesAndValues = notes.map((note) => ({
      semitones: Note2.getNormalizedSemitonesBetween(this._root, note),
      value: Note2.getIndexDifferenceBetween(this._root, note)
    }));
    const intervals = semitonesAndValues.map(({ semitones, value }, i) => {
      const interval = Interval.fromSemitonesAndValue(semitones, value);
      if (interval === void 0) {
        throw new Error(`Chord.notes (setter) : Trying to set a note within chord with semitones (${semitones}) and value (${value}). Note: ${notes[i].SPN} against root ${this._root.SPN}.`);
      }
      return interval;
    });
    this._root = lowestNote;
    this._intervals = intervals;
    this._notes = notes;
  }
  get notes() {
    const notes = this._intervals.map((interval) => Interval.apply(this._root, interval.name));
    this._notes = notes;
    return notes;
  }
  get notation() {
    const semitonesNotation = this.semitonesNotation;
    const fullyMatchingChordDefinitions = _Chord.getDefinitionsFromSemitonesNotation(semitonesNotation);
    const partialMatchingChordDefinitions = _Chord.getDefinitionsFromPartialSemitonesNotation(semitonesNotation);
    if (fullyMatchingChordDefinitions.length > 0) {
      const chord = fullyMatchingChordDefinitions[0];
      if (chord.addedTones.length > 0) {
        return `${chord.chordDefinition.notation}${chord.addedTones.map((i) => `add(${i.notation})`).join("")}`;
      }
      return chord.chordDefinition.notation;
    } else {
      if (partialMatchingChordDefinitions.length > 0) {
        const chord = partialMatchingChordDefinitions[0];
        return `${chord.chordDefinition.notation}${chord.missingTones.map((i) => ` no(${i.notation})`).join("")}`;
      }
    }
    this._noNotationYet();
    return "";
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
  static getDefinitionsFromSemitonesNotation(notation) {
    const possibleChords = ALL_POSSIBLE_CHORDS.map((chord) => {
      return {
        chordDefinition: chord,
        semitonesNotation: chord.intervals.map((interval) => interval.chordSemitonesNotation).join("")
      };
    });
    return possibleChords.filter((pc) => pc.semitonesNotation.split("").every((i) => notation.includes(i))).map((pc) => {
      let addedTones = [];
      if (notation.length > pc.semitonesNotation.length) {
        addedTones = notation.split("").filter((interval) => !pc.semitonesNotation.includes(interval)).map((interval) => {
          const possibleAddedTone = Interval.fromChordSemitonesNotation(interval);
          const filteredAddedTone = possibleAddedTone?.filter((pi) => pc.chordDefinition.intervals.find((pci) => pci.value === pi.value) === void 0) ?? [];
          const addedTone = filteredAddedTone[0];
          if (addedTone.value < 8) {
            const raisedAddedTone = Interval.raiseOctave(addedTone);
            if (raisedAddedTone !== void 0) {
              return raisedAddedTone;
            }
          }
          return addedTone;
        });
      }
      return {
        ...pc,
        addedTones
      };
    }).sort((a, b) => b.semitonesNotation.length - a.semitonesNotation.length);
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
  static getDefinitionsFromPartialSemitonesNotation(notation) {
    const possibleChords = ALL_POSSIBLE_CHORDS.map((chord) => ({
      chordDefinition: chord,
      semitonesNotation: chord.intervals.map((interval) => interval.chordSemitonesNotation).join("")
    }));
    return possibleChords.filter((pc) => notation.split("").every((i) => pc.semitonesNotation.includes(i))).map((pc) => {
      const missingTones = [];
      for (const interval of pc.chordDefinition.intervals) {
        if (!notation.includes(interval.chordSemitonesNotation)) {
          missingTones.push(interval);
        }
      }
      return {
        ...pc,
        missingTones
      };
    }).sort((a, b) => a.missingTones.length - b.missingTones.length);
  }
  static fromNotation(notation) {
    const chars = notation.split("");
    let possibleRoot = new Note2();
    try {
      possibleRoot = Note2.fromSPN(chars[0] + "4");
      if (chars.length > 1) {
        possibleRoot = Note2.fromSPN(chars.slice(0, 2).join("") + "4");
      }
      if (chars.length > 2) {
        possibleRoot = Note2.fromSPN(chars.slice(0, 3).join("") + "4");
      }
    } catch (err) {
    }
    const rootLength = possibleRoot.SPN.length - 1;
    const isolatedPossibleNotation = chars.slice(rootLength, chars.length).join("");
    const foundNotation = ALL_POSSIBLE_CHORDS.find((chordNotation) => chordNotation.notation === isolatedPossibleNotation);
    if (foundNotation !== void 0) {
      return new _Chord({
        root: possibleRoot,
        intervals: [
          ...foundNotation.intervals
        ]
      });
    }
    throw new Error(`Cannot find a chord notation yet for ${notation}`);
  }
  get semitonesNotation() {
    const semitones = [];
    for (const note of this.notes) {
      const semitoneFromRoot = Note2.getSemitonesBetween(this._root, note);
      if (semitoneFromRoot === 10) {
        semitones.push("X");
      } else if (semitoneFromRoot === 11) {
        semitones.push("N");
      } else {
        semitones.push(semitoneFromRoot);
      }
    }
    return semitones.join("");
  }
  computeNotationWithContext(scale) {
    return "";
  }
  _noNotationYet() {
    console.warn(`No name for this chord yet ${this.root.SPN} ${JSON.stringify(this.intervals.map((i) => i.name))}`);
  }
  computeIntervals() {
    const intervals = [];
    this.notes.forEach((n) => {
      const semitonesBetweenNotes = Note2.getSemitonesBetween(this.root, n);
      const possibleInterval = Interval.fromSemitonesAndValue(
        semitonesBetweenNotes < 0 ? semitonesBetweenNotes % SEMITONES_WITHIN_OCTAVE + SEMITONES_WITHIN_OCTAVE : semitonesBetweenNotes,
        Note2.getIndexDifferenceBetween(this.root, n)
      );
      if (possibleInterval !== void 0) intervals.push(possibleInterval);
    });
    return intervals;
  }
  addInterval(interval) {
    this._intervals.push(interval);
    return this;
  }
  possibleAddedTones(triad) {
    if (triad.intervals.length === this.intervals.length) {
      return [];
    }
    return this.intervals.filter((i) => {
      for (let j = 0; j < triad.intervals.length; j++) {
        if (Interval.equals(i, triad.intervals[j])) {
          return false;
        }
      }
      return true;
    });
  }
};

// src/class/Scale.ts
var SCALES = {
  MAJOR: {
    name: "major",
    mode: "ionian",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("M3"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("M6"),
      new Interval("M7")
    ]
  },
  ACOUSTIC: {
    name: "acoustic",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("M3"),
      new Interval("A4"),
      new Interval("P5"),
      new Interval("M6"),
      new Interval("m7")
    ]
  },
  NATURAL_MINOR: {
    name: "natural_minor",
    mode: "aeolian",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("m3"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("m6"),
      new Interval("m7")
    ]
  },
  ALGERIAN: {
    name: "algerian",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("m3"),
      new Interval("A4"),
      new Interval("P5"),
      new Interval("m6"),
      new Interval("M7"),
      new Interval("P8"),
      new Interval("M9"),
      new Interval("m10"),
      new Interval("P11"),
      new Interval("P12"),
      new Interval("m13"),
      new Interval("M14")
    ]
  },
  ALTERED: {
    name: "altered",
    mode: "super_locrian",
    intervals: [
      new Interval("P1"),
      new Interval("m2"),
      new Interval("m3"),
      new Interval("d4"),
      new Interval("d5"),
      new Interval("m6"),
      new Interval("m7")
    ]
  },
  AUGMENTED: {
    name: "augmented",
    intervals: [
      new Interval("P1"),
      new Interval("m3"),
      new Interval("M3"),
      new Interval("P5"),
      new Interval("A5"),
      new Interval("M7")
    ]
  },
  BEBOP_DOMINANT: {
    name: "bebop_dominant",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("M3"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("M6"),
      new Interval("m7"),
      new Interval("M7")
    ]
  },
  BLUES: {
    name: "blues",
    intervals: [
      new Interval("P1"),
      new Interval("m3"),
      new Interval("M3"),
      new Interval("P4"),
      new Interval("d5"),
      new Interval("P5"),
      new Interval("m7")
    ]
  },
  ASCENDING_CHROMATIC: {
    name: "ascending_chromatic",
    intervals: [
      new Interval("P1"),
      new Interval("A1"),
      new Interval("M2"),
      new Interval("A2"),
      new Interval("M3"),
      new Interval("P4"),
      new Interval("A4"),
      new Interval("P5"),
      new Interval("A5"),
      new Interval("M6"),
      new Interval("A6"),
      new Interval("M7")
    ]
  },
  DESCENDING_CHROMATIC: {
    name: "decending_chromatic",
    intervals: [
      new Interval("M7"),
      new Interval("m7"),
      new Interval("M6"),
      new Interval("m6"),
      new Interval("P5"),
      new Interval("d5"),
      new Interval("P4"),
      new Interval("M3"),
      new Interval("m3"),
      new Interval("M2"),
      new Interval("m2"),
      new Interval("P1")
    ]
  },
  DORIAN: {
    mode: "dorian",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("m3"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("M6"),
      new Interval("m7")
    ]
  },
  DOUBLE_HARMONIC: {
    name: "double_harmonic",
    mode: "flamenco",
    intervals: [
      new Interval("P1"),
      new Interval("m2"),
      new Interval("M3"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("m6"),
      new Interval("M7")
    ]
  },
  ENIGMATIC: {
    name: "enigmatic",
    intervals: [
      new Interval("P1"),
      new Interval("m2"),
      new Interval("M3"),
      new Interval("A4"),
      new Interval("A5"),
      new Interval("A6"),
      new Interval("M7")
    ]
  },
  GYPSY: {
    name: "gipsy",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("m3"),
      new Interval("A4"),
      new Interval("P5"),
      new Interval("m6"),
      new Interval("m7")
    ]
  },
  HALF_DIMINISHED: {
    name: "half_diminished",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("m3"),
      new Interval("d4"),
      new Interval("d5"),
      new Interval("m6"),
      new Interval("m7")
    ]
  },
  HARMONIC_MAJOR: {
    name: "harmonic_major",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("M3"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("m6"),
      new Interval("M7")
    ]
  },
  HARMONIC_MINOR: {
    name: "harmonic_minor",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("m3"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("m6"),
      new Interval("M7")
    ]
  },
  HIRAJOSHI: {
    name: "hirajoshi",
    intervals: [
      new Interval("P1"),
      new Interval("M3"),
      new Interval("A4"),
      new Interval("P5"),
      new Interval("M7")
    ]
  },
  HUNGRARIAN_GYPSY: {
    name: "hungrarian_gypsy",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("m3"),
      new Interval("A4"),
      new Interval("P5"),
      new Interval("m6"),
      new Interval("M7")
    ]
  },
  HUNGRARIAN_MINOR: {
    name: "hungrarian_minor",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("m3"),
      new Interval("A4"),
      new Interval("P5"),
      new Interval("m6"),
      new Interval("M7")
    ]
  },
  IN: {
    name: "in",
    intervals: [
      new Interval("P1"),
      new Interval("m2"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("m6")
    ]
  },
  INSEN: {
    name: "insen",
    intervals: [
      new Interval("P1"),
      new Interval("m2"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("m7")
    ]
  },
  ISTRIAN: {
    name: "istrian",
    mode: "istrian",
    intervals: [
      new Interval("P1"),
      new Interval("m2"),
      new Interval("m3"),
      new Interval("d4"),
      new Interval("d5"),
      new Interval("P5")
    ]
  },
  IWATO: {
    name: "iwato",
    intervals: [
      new Interval("P1"),
      new Interval("m2"),
      new Interval("P4"),
      new Interval("d5"),
      new Interval("m7")
    ]
  },
  LOCRIAN: {
    mode: "locrian",
    intervals: [
      new Interval("P1"),
      new Interval("m2"),
      new Interval("m3"),
      new Interval("P4"),
      new Interval("d5"),
      new Interval("m6"),
      new Interval("m7")
    ]
  },
  LYDIAN_AUGMENTED: {
    name: "lydian_augmented",
    mode: "lydian_augmented",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("M3"),
      new Interval("A4"),
      new Interval("A5"),
      new Interval("M6"),
      new Interval("M7")
    ]
  },
  LYDIAN: {
    mode: "lydian",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("M3"),
      new Interval("A4"),
      new Interval("P5"),
      new Interval("M6"),
      new Interval("M7")
    ]
  },
  MAJOR_BEBOP: {
    name: "major_bebop",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("M3"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("A5"),
      new Interval("M6"),
      new Interval("M7")
    ]
  },
  MAJOR_LOCRIAN: {
    name: "major_locrian",
    mode: "major_locrian",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("M3"),
      new Interval("P4"),
      new Interval("d5"),
      new Interval("m6"),
      new Interval("m7")
    ]
  },
  MAJOR_PENTATONIC: {
    name: "major_pentatonic",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("M3"),
      new Interval("P5"),
      new Interval("M6")
    ]
  },
  MELODIC_MINOR_ASCENDING: {
    name: "melodic_minor_ascending",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("m3"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("M6"),
      new Interval("M7")
    ]
  },
  MELODIC_MINOR_DESCENDING: {
    name: "melodic_minor_descending",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("m3"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("m6"),
      new Interval("m7")
    ]
  },
  MINOR_PENTATONIC: {
    name: "minor_pentatonic",
    intervals: [
      new Interval("P1"),
      new Interval("m3"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("m7")
    ]
  },
  MIXOLYDIAN: {
    mode: "mixolydian",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("M3"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("M6"),
      new Interval("m7")
    ]
  },
  NEOPOLITAN_MAJOR: {
    name: "neopolitan_major",
    intervals: [
      new Interval("P1"),
      new Interval("m2"),
      new Interval("m3"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("M6"),
      new Interval("M7")
    ]
  },
  NEOPOLITAN_MINOR: {
    name: "neopolitan_minor",
    intervals: [
      new Interval("P1"),
      new Interval("m2"),
      new Interval("m3"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("m6"),
      new Interval("M7")
    ]
  },
  PERSIAN: {
    name: "persian",
    intervals: [
      new Interval("P1"),
      new Interval("m2"),
      new Interval("M3"),
      new Interval("P4"),
      new Interval("d5"),
      new Interval("m6"),
      new Interval("M7")
    ]
  },
  PHRYGIAN_DOMINANT: {
    name: "phrygian_dominant",
    mode: "phrygian_dominant",
    intervals: [
      new Interval("P1"),
      new Interval("m2"),
      new Interval("M3"),
      new Interval("P4"),
      new Interval("d5"),
      new Interval("m6"),
      new Interval("m7")
    ]
  },
  PHRYGIAN: {
    mode: "phrygian",
    intervals: [
      new Interval("P1"),
      new Interval("m2"),
      new Interval("m3"),
      new Interval("P4"),
      new Interval("d5"),
      new Interval("m6"),
      new Interval("m7")
    ]
  },
  PROMETHEUS: {
    name: "prometheus",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("M3"),
      new Interval("A4"),
      new Interval("M6"),
      new Interval("m7")
    ]
  },
  HARMONICS: {
    name: "harmonics",
    intervals: [
      new Interval("P1"),
      new Interval("m3"),
      new Interval("M3"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("M6")
    ]
  },
  TRITONE: {
    name: "tritones",
    intervals: [
      new Interval("P1"),
      new Interval("m2"),
      new Interval("M3"),
      new Interval("d5"),
      new Interval("P5"),
      new Interval("m7")
    ]
  },
  TWO_SEMITONE_TRITONE: {
    name: "two_semiton_tritone",
    intervals: [
      new Interval("P1"),
      new Interval("m2"),
      new Interval("M2"),
      new Interval("A4"),
      new Interval("P5"),
      new Interval("m6")
    ]
  },
  UKRANIAN_DORIAN: {
    name: "ukrarian_dorian",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("m3"),
      new Interval("A4"),
      new Interval("P5"),
      new Interval("M6"),
      new Interval("m7")
    ]
  },
  WHOLE_TONE: {
    name: "whole_tone",
    intervals: [
      new Interval("P1"),
      new Interval("M2"),
      new Interval("M3"),
      new Interval("A4"),
      new Interval("A5"),
      new Interval("A6")
    ]
  },
  YO: {
    name: "yo",
    intervals: [
      new Interval("P1"),
      new Interval("m3"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("m7")
    ]
  },
  MAJOR_7_ARPEGGIO: {
    arpeggio: true,
    name: "major_seven_arpeggio",
    intervals: [
      new Interval("P1"),
      new Interval("M3"),
      new Interval("P5"),
      new Interval("M7")
    ]
  },
  DOMINANT_SEVEN_ARPEGGIO: {
    arpeggio: true,
    name: "dominant_seven_arpeggio",
    intervals: [
      new Interval("P1"),
      new Interval("M3"),
      new Interval("P5"),
      new Interval("m7")
    ]
  },
  MINOR_SEVEN_ARPEGGIO: {
    arpeggio: true,
    name: "minor_seven_arpeggio",
    intervals: [
      new Interval("P1"),
      new Interval("m3"),
      new Interval("P5"),
      new Interval("m7")
    ]
  },
  MINOR_SEVEN_FLAT_FIVE_ARPEGGIO: {
    arpeggio: true,
    name: "minor_seven_flat_five_arpeggio",
    intervals: [
      new Interval("P1"),
      new Interval("m3"),
      new Interval("d5"),
      new Interval("m7")
    ]
  },
  DOMINANT_SEVEN_SUS_FOUR_ARPEGGIO: {
    arpeggio: true,
    name: "dominant_seven_sus_four_arpeggio",
    intervals: [
      new Interval("P1"),
      new Interval("P4"),
      new Interval("P5"),
      new Interval("m7")
    ]
  },
  DIMINISHED_SEVENT_ARPEGGIO: {
    arpeggio: true,
    name: "diminished_seven_arpeggio",
    intervals: [
      new Interval("P1"),
      new Interval("m3"),
      new Interval("d5"),
      new Interval("d7")
    ]
  },
  MINOR_MAJOR_SEVEN_ARPEGGIO: {
    arpeggio: true,
    name: "minor_major_seven_arpeggio",
    intervals: [
      new Interval("P1"),
      new Interval("m3"),
      new Interval("P5"),
      new Interval("M7")
    ]
  },
  MAJOR_SIX_ARPEGGIO: {
    arpeggio: true,
    name: "major_six_arpeggio",
    intervals: [
      new Interval("P1"),
      new Interval("M3"),
      new Interval("P5"),
      new Interval("M6")
    ]
  },
  MINOR_MAJOR_SIX_ARPEGGIO: {
    arpeggio: true,
    name: "minor_major_six_arpeggio",
    intervals: [
      new Interval("P1"),
      new Interval("m3"),
      new Interval("P5"),
      new Interval("M6")
    ]
  }
};
var Scale = class _Scale {
  _key;
  _notes = [];
  _intervals = [];
  constructor(params = {}) {
    const key = params.key ?? new Note2({ name: "C" });
    const intervals = params.intervals ?? [];
    const name = params.name ?? "major";
    const mode = params.mode ?? "";
    this.key = key;
    if (params.intervals !== void 0 && Array.isArray(intervals) && intervals.length > 0) {
      this.intervals = intervals;
    } else if (mode !== "") {
      this.mode = mode;
    } else {
      this.name = name;
    }
  }
  get intervals() {
    return this._intervals;
  }
  set intervals(intervals) {
    if (!Array.isArray(intervals) || !intervals.every((i) => i instanceof Interval)) {
      throw new Error(`Cannot assign ${JSON.stringify(intervals)} as scale intervals.`);
    }
    this._intervals = intervals.sort((ia, ib) => ia.semitones - ib.semitones);
  }
  get name() {
    const definitions = _Scale.getDefintionsFromIntervals(this.intervals);
    return definitions.length > 0 ? definitions[0].name ?? "" : "";
  }
  set name(name) {
    const definitionName = Object.keys(SCALES).find((s) => SCALES[s].name === name);
    if (definitionName !== void 0) {
      this.intervals = SCALES[definitionName].intervals;
    } else {
      throw new Error(`Couldn't find a scale definition with that name : ${name}.`);
    }
  }
  get mode() {
    const definitions = _Scale.getDefintionsFromIntervals(this.intervals);
    return definitions.length > 0 ? definitions[0].mode ?? "" : "";
  }
  set mode(mode) {
    const definitionName = Object.keys(SCALES).find((s) => SCALES[s].mode === mode);
    if (definitionName !== void 0) {
      this.intervals = SCALES[definitionName].intervals;
    } else {
      throw new Error(`Couldn't find a scale definition with that mode : ${mode}.`);
    }
  }
  get key() {
    return this._key;
  }
  set key(note) {
    this._key = note;
  }
  set notes(notes) {
    this._notes = notes;
  }
  get notes() {
    return this._intervals.map((interval) => Interval.apply(this._key, interval.name));
  }
  // Return all 7th chords from the scale if it is diatonic
  get scaleChords() {
    const chords = [];
    if (this.intervals.length === 7) {
      for (let i = 0; i < this.notes.length; i++) {
        chords.push(
          new Chord({
            root: this.notes[i],
            notes: [
              this.notes[i],
              this.notes[(i + 2) % this.notes.length],
              // 3rd
              this.notes[(i + 4) % this.notes.length],
              // 5th
              this.notes[(i + 6) % this.notes.length]
              // 7th
            ]
          })
        );
      }
    } else {
      console.warn("Cannot compute scale chords yet.");
    }
    return chords;
  }
  static getDefintionsFromIntervals(intervals) {
    return Object.keys(SCALES).filter((s) => {
      const scale = SCALES[s];
      if (scale.intervals.length === intervals.length) {
        return scale.intervals.every((v, i) => v.name === intervals[i].name);
      } else {
        return false;
      }
    }).map((n) => SCALES[n]);
  }
};

// src/class/Rest.ts
var Rest = class _Rest extends ValuedBarContent {
  constructor(params = {}) {
    super(params);
  }
  static findLargest(value) {
    for (var i = 0; i < REVERSE_SORTED_NOTE_VALUES.length; i++) {
      if (REVERSE_SORTED_NOTE_VALUES[i] <= value) {
        return new _Rest({
          value: REVERSE_SORTED_NOTE_VALUES[i]
        });
      }
    }
    throw new Error(`Couldn't find largest rest value for ${value}. Possible Note values : ${JSON.stringify(NOTE_VALUES)}`);
  }
};

// src/class/TimeSignature.ts
var BEATS_TYPE = /* @__PURE__ */ ((BEATS_TYPE2) => {
  BEATS_TYPE2[BEATS_TYPE2["WHOLE_NOTE"] = 1] = "WHOLE_NOTE";
  BEATS_TYPE2[BEATS_TYPE2["HALF_NOTE"] = 2] = "HALF_NOTE";
  BEATS_TYPE2[BEATS_TYPE2["QUARTER_NOTE"] = 4] = "QUARTER_NOTE";
  BEATS_TYPE2[BEATS_TYPE2["EIGHT_NOTE"] = 8] = "EIGHT_NOTE";
  return BEATS_TYPE2;
})(BEATS_TYPE || {});
var TimeSignature = class {
  _beats;
  _beatsType;
  constructor(params = {}) {
    this.beats = params.beats ?? 4;
    this.beatsType = params.beatsType ?? 4 /* QUARTER_NOTE */;
  }
  // getters & setters
  set beats(beats) {
    this._beats = beats;
  }
  get beats() {
    return this._beats;
  }
  set beatsType(beatsType) {
    this._beatsType = beatsType;
  }
  get beatsType() {
    return this._beatsType;
  }
};

// src/class/Bar.ts
var BAR_TYPE_START = /* @__PURE__ */ ((BAR_TYPE_START2) => {
  BAR_TYPE_START2["STANDARD"] = "STANDARD";
  BAR_TYPE_START2["DOUBLE"] = "DOUBLE";
  BAR_TYPE_START2["REPEAT"] = "REPEAT";
  BAR_TYPE_START2["NONE"] = "NONE";
  return BAR_TYPE_START2;
})(BAR_TYPE_START || {});
var BAR_TYPE_END = /* @__PURE__ */ ((BAR_TYPE_END2) => {
  BAR_TYPE_END2["STANDARD"] = "STANDARD";
  BAR_TYPE_END2["DOUBLE"] = "DOUBLE";
  BAR_TYPE_END2["END"] = "END";
  BAR_TYPE_END2["REPEAT"] = "REPEAT";
  return BAR_TYPE_END2;
})(BAR_TYPE_END || {});
var Bar = class _Bar {
  _ts;
  _content = [];
  _staff;
  _typeStart;
  _typeEnd;
  _autoFill = true;
  constructor(params = {}) {
    if (params.autoFill !== void 0) this.autoFill = params.autoFill;
    this.timeSignature = params.timeSignature ?? new TimeSignature();
    this.content = params.content ?? [];
    this.staff = params.staff ?? "TREBLE" /* TREBLE */;
    this.typeStart = params.typeStart ?? "STANDARD" /* STANDARD */;
    this.typeEnd = params.typeEnd ?? "STANDARD" /* STANDARD */;
    if (this.autoFill) this.fillEmptySpace();
  }
  // getters & setters
  get timeSignature() {
    return this._ts;
  }
  set timeSignature(timeSignature) {
    if (!(timeSignature instanceof TimeSignature)) {
      throw new Error(`Trying to set a bar Time signature with something other than a Time Signature : ${JSON.stringify(timeSignature)}`);
    } else {
      this._ts = timeSignature;
    }
  }
  get content() {
    return this._content;
  }
  set content(content) {
    if (!Array.isArray(content)) {
      throw new Error(`Tying to set the content of a bar with something else than an array : ${JSON.stringify(content)}`);
    }
    this._content = [];
    for (let i = 0; i < content.length; i++) {
      this.addContent(content[i], false);
    }
    if (this.autoFill) {
      this.fillEmptySpace();
    }
  }
  get staff() {
    return this._staff;
  }
  set staff(staff) {
    this._staff = staff;
  }
  get typeStart() {
    return this._typeStart;
  }
  set typeStart(typeStart) {
    this._typeStart = typeStart;
  }
  get typeEnd() {
    return this._typeEnd;
  }
  set typeEnd(typeEnd) {
    this._typeEnd = typeEnd;
  }
  get autoFill() {
    return this._autoFill;
  }
  set autoFill(autoFill) {
    this._autoFill = autoFill;
  }
  // get the current value of bar
  get value() {
    let barValue = 0;
    for (let i = 0; i < this.content.length; i++) {
      barValue += this.content[i].dottedValue;
    }
    return barValue;
  }
  // get expected bar value
  get expectedValue() {
    return this.timeSignature.beatsType / this.timeSignature.beats;
  }
  // get remaining empty space in bar
  get emptySpace() {
    return this.expectedValue - this.value;
  }
  addContent(content, fillEmptySpace = false) {
    if (this.isFull()) {
      throw new Error("Trying to add content to a bar that is already full. Try modifyContent instead.");
    }
    if (_Bar.isBarContent(content)) {
      if (content.value <= this.emptySpace) {
        this._content.push(content);
      } else {
        throw new Error(`Trying to add a content with a note value greater than the remaining space in bar. ${JSON.stringify(content)}`);
      }
    } else {
      throw new Error(`Trying to add a content to a bar that either is not a Note, Chord or Rest or : ${JSON.stringify(content)}`);
    }
    if (fillEmptySpace) {
      this.fillEmptySpace();
    }
    return this;
  }
  // return old content
  modifyContent(contentIndex, newContent) {
    if (this.content[contentIndex] !== void 0) {
      this.content[contentIndex] = newContent;
      this.content.splice(contentIndex + 1);
      if (this.autoFill) {
        this.fillEmptySpace();
      }
      return this.content[contentIndex];
    } else {
      throw new Error(`Trying to modify content at index : ${contentIndex} in Bar ${JSON.stringify(this)} with content ${JSON.stringify(this.content)}.`);
    }
  }
  fillEmptySpace() {
    return _Bar.fillEmptySpace(this);
  }
  isFull() {
    return _Bar.isFull(this);
  }
  // fill empty space with rests
  static fillEmptySpace(bar) {
    if (bar.isFull()) return bar;
    const rests = [];
    let restsValue = 0;
    while (restsValue < bar.emptySpace) {
      rests.unshift(Rest.findLargest(bar.emptySpace - restsValue));
      restsValue = rests.map((r) => r.value).reduce((p, r) => p + r, 0);
    }
    for (let i = 0; i < rests.length; i++) {
      bar.addContent(rests[i], false);
    }
    return bar;
  }
  static isFull(bar) {
    return bar.value === bar.expectedValue;
  }
  static isBarContent(content) {
    return content instanceof Note2 || content instanceof Rest || content instanceof Chord;
  }
};

// src/class/Score.ts
var SCORE_STAFF = /* @__PURE__ */ ((SCORE_STAFF2) => {
  SCORE_STAFF2["TREBLE"] = "TREBLE";
  SCORE_STAFF2["FRENCH_VIOLIN"] = "FRENCH_VIOLIN";
  SCORE_STAFF2["BASS"] = "BASS";
  SCORE_STAFF2["BARITONE_F"] = "BARITONE_F";
  SCORE_STAFF2["BARITONE_C"] = "BARITONE_C";
  SCORE_STAFF2["SUB_BASS"] = "SUB_BASS";
  SCORE_STAFF2["ALTO"] = "ALTO";
  SCORE_STAFF2["TABLATURE"] = "TABLATURE";
  SCORE_STAFF2["MEZZO_SOPRANO"] = "MEZZO_SOPRANO";
  SCORE_STAFF2["SOPRANO"] = "SOPRANO";
  SCORE_STAFF2["NEUTRAL"] = "NEUTRAL";
  return SCORE_STAFF2;
})(SCORE_STAFF || {});
var Score = class {
  _ts;
  _staff;
  _bars;
  // key signature
  _ks;
  constructor(params = {}) {
    this.timeSignature = params.timeSignature ?? new TimeSignature({});
    this.staff = params.staff ?? "TREBLE" /* TREBLE */;
    this.bars = params.measures ?? params.bars ?? [];
    this.keySignature = params.keySignature ?? new Scale({
      key: new Note2()
    });
  }
  // getters & setters
  get timeSignature() {
    return this._ts;
  }
  set timeSignature(ts) {
    this._ts = ts;
  }
  get staff() {
    return this._staff;
  }
  set staff(staff) {
    if (Object.keys(SCORE_STAFF).indexOf(staff) > -1) {
      this._staff = staff;
    } else {
      throw new Error(`Clef on new score can only be one of ${Object.keys(SCORE_STAFF).join(", ")}, you tried to set it to : ${staff}`);
    }
  }
  get bars() {
    return this._bars;
  }
  set bars(bars) {
    this._bars = bars;
  }
  get measures() {
    return this._bars;
  }
  set measures(measures) {
    this._bars = measures;
  }
  get keySignature() {
    return this._ks;
  }
  set keySignature(scale) {
    this._ks = scale;
  }
  get defaultNoteValue() {
    return this.timeSignature.beatsType;
  }
  get lastBar() {
    if (this.bars.length === 0) {
      throw new Error("Score has no bar.");
    }
    return this.bars[this.bars.length - 1];
  }
  /**
   * Add bar to the current score.
   * @param - No field is mandatory
   */
  addBar({
    typeStart = "STANDARD" /* STANDARD */,
    typeEnd = "STANDARD" /* STANDARD */,
    content = []
  } = {}) {
    this.bars.push(new Bar({
      timeSignature: this.timeSignature,
      content,
      typeStart: typeStart ?? "STANDARD" /* STANDARD */,
      typeEnd: typeEnd ?? "STANDARD" /* STANDARD */,
      staff: this.staff
    }));
    return this.lastBar;
  }
  addContent(content) {
    try {
      this.lastBar.addContent(content, true);
    } catch (err) {
      try {
        this.addBar({
          typeStart: "STANDARD" /* STANDARD */,
          typeEnd: "STANDARD" /* STANDARD */,
          content: [content]
        });
      } catch (err2) {
        throw new Error(`Trying to add content ${JSON.stringify(content)} to Score. ${JSON.stringify(err2)}`);
      }
    }
  }
  modifyContent(bar, contentIndex, newContent) {
    try {
      if (this.bars[bar] !== void 0) {
        this.bars[bar].modifyContent(contentIndex, newContent);
      } else {
        throw new Error(`Trying to modify bar number ${bar} in the score. There is no bar at this index.`);
      }
    } catch (err) {
      console.log(err);
    }
  }
};
export {
  ACCIDENTAL,
  ACCIDENTALS,
  Accidental,
  BAR_TYPE_END,
  BAR_TYPE_START,
  BASE_FREQUENCY,
  BEATS_TYPE,
  Bar,
  Chord,
  EXTENDED_CHORDS,
  INTERVALS,
  Interval,
  NOTES,
  NOTE_VALUES,
  Note2 as Note,
  Pitch,
  Rest,
  SCALES,
  SCORE_STAFF,
  Scale,
  Score,
  TRIADS,
  TimeSignature
};
