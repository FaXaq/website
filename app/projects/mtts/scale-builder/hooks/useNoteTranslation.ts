import { Note } from "mtts"
import { useTranslation } from "react-i18next"

export function useNoteTranslation() {
  const { t } = useTranslation()

  return {
    translateNote(note: Note) {
      return t(`mtts.notes.${note.name}`) + (note.accidental.semitones !== 0 ? t(`mtts.accidentals.${note.accidental.name}`) : '')
    }
  }
}