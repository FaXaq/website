import { Note } from "mtts";
import { useState } from "react";

interface TileProps {
  note: Note;
}

const Tile = ({ note }: TileProps) => {
  const [playing, setPlaying] = useState(false);
  function playNote(note: Note) {
    // create web audio api context
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // create Oscillator node
    var oscillator = audioCtx.createOscillator();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(note.frequency, audioCtx.currentTime); // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    setPlaying(true);
    setTimeout(() => {
      oscillator.stop();
      setPlaying(false);
    }, 1000);
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
