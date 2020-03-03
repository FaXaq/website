import { Note } from "mtts";
import { useState } from "react";
import { Synth, Frequency, Time } from "tone";

interface TileProps {
  note: Note;
}

const Tile = ({ note }: TileProps) => {
  const [playing, setPlaying] = useState(false);
  function playNote(note: Note) {
    const t = new Synth().toMaster();
    t.triggerAttackRelease(note.frequency, 1);
    setPlaying(true);
    setTimeout(() => setPlaying(false), 1000);
  }

  const classes = ["flex-grow", "border"];

  if (playing) {
    classes.push("bg-black text-white");
  }

  return (
    <div className={classes.join(" ")} onClick={() => playNote(note)}>
      {note.name}
      {note.pitch.value}
    </div>
  );
};

export default Tile;
