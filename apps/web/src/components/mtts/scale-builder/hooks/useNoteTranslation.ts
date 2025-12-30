import type { Note } from "@repo/mtts";

import { m } from "@/paraglide/messages";

export function useNoteTranslation() {
  return {
    translateNote(note: Note, showNatural: boolean = false) {
      let noteName = note.name;
      switch (note.name) {
        case 'C':
          noteName = m['mtts_notes_C']();
          break;
        case 'D':
          noteName = m['mtts_notes_D']();
          break;
        case 'E':
          noteName = m['mtts_notes_E']();
          break;
        case 'F':
          noteName = m['mtts_notes_F']();
          break;
        case 'G':
          noteName = m['mtts_notes_G']();
          break;
        case 'A':
          noteName = m['mtts_notes_A']();
          break;
        case 'B':
          noteName = m['mtts_notes_B']();
          break;
        default:
          break;
      }

      switch (note.accidental.name) {
        case 'DOUBLE_FLAT':
          noteName += m['mtts_accidentals_DOUBLE_FLAT']();
          break;
        case 'FLAT':
          noteName += m['mtts_accidentals_FLAT']();
          break;
        case 'NATURAL':
          if (showNatural) {
            noteName += m['mtts_accidentals_NATURAL']();
          }
          break;
        case 'SHARP':
          noteName += m['mtts_accidentals_SHARP']();
          break;
        case 'DOUBLE_SHARP':
          noteName += m['mtts_accidentals_DOUBLE_SHARP']();
          break;
        default:
          break;
      }

      return noteName;
    }
  };
}