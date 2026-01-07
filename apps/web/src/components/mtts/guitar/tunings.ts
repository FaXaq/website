import { Note } from "@repo/mtts";
import z from "zod/v3";

export const ZodTuningName = z.enum(["guitar_std", "guitar_drop_d", "bass_std", "bass_drop_d"]);
export type TTuningName = z.infer<typeof ZodTuningName>;

export const ZodInstrumentName = z.enum(["guitar", "bass"]);
export type TInstrumentName = z.infer<typeof ZodInstrumentName>;

export interface ITuning {
  name: TTuningName;
  strings: {
    order: number;
    note: Note;
  }[];
  instrument: TInstrumentName;
}

export const TUNINGS: { [key in TTuningName]: ITuning } = {
  "guitar_std": {
    name: "guitar_std",
    strings: [
      { order: 0, note: Note.fromSPN("E4") },
      { order: 1, note: Note.fromSPN("B3") },
      { order: 2, note: Note.fromSPN("G3") },
      { order: 3, note: Note.fromSPN("D3") },
      { order: 4, note: Note.fromSPN("A2") },
      { order: 5, note: Note.fromSPN("E2") },
    ],
    instrument: "guitar"
  },
  "guitar_drop_d": {
    name: "guitar_drop_d",
    strings: [
      { order: 0, note: Note.fromSPN("E4") },
      { order: 1, note: Note.fromSPN("B3") },
      { order: 2, note: Note.fromSPN("G3") },
      { order: 3, note: Note.fromSPN("D3") },
      { order: 4, note: Note.fromSPN("A2") },
      { order: 5, note: Note.fromSPN("D2") },
    ],
    instrument: "guitar"
  },
  "bass_std": {
    name: "bass_std",
    strings: [
      { order: 0, note: Note.fromSPN("G2") },
      { order: 1, note: Note.fromSPN("D2") },
      { order: 2, note: Note.fromSPN("A1") },
      { order: 3, note: Note.fromSPN("E1") },
    ],
    instrument: "bass"
  },
  "bass_drop_d": {
    name: "bass_drop_d",
    strings: [
      { order: 0, note: Note.fromSPN("G2") },
      { order: 1, note: Note.fromSPN("D2") },
      { order: 2, note: Note.fromSPN("A1") },
      { order: 3, note: Note.fromSPN("E1") },
    ],
    instrument: "bass"
  },
};
