import { Note, NOTES,Pitch } from 'mtts';

export function generatePitches (valueStart: number, valueStop: number): Pitch[] {
  const pitches: Pitch[] = [];
  for (
    let i = valueStart;
    valueStart < valueStop ? i < valueStop : i > valueStop;
    valueStart < valueStop ? i++ : i--) {
    pitches.push(new Pitch({ value: i }));
  }
  return pitches;
}

export function generateNotesForPitch (pitch: Pitch): Note[][] {
  const notes: Note[][] = [];

  for (let note = 0; note < NOTES.length; note++) {
    const currentNote = new Note({
      name: NOTES[note],
      pitch
    });

    if (!currentNote.isCorF() && notes[notes.length - 1] !== undefined) {
      notes[notes.length - 1].push(currentNote.duplicate().addFlat());
    }

    notes.push([
      currentNote
    ]);

    if (!currentNote.isBorE()) {
      notes.push([currentNote.duplicate().addSharp()]);
    }
  }

  return notes;
}

export function filterUniqueNotes (allNotes: Note[]): Note[] {
  return allNotes.reduce((uniqueNotes: Note[], currentNote: Note) => {
    return uniqueNotes.findIndex((note) => note.frequency === currentNote.frequency) > -1
      ? uniqueNotes
      : [...uniqueNotes, currentNote];
  }, []);
}
