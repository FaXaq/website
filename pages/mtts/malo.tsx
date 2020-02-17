import { NextPage } from "next";
import { NOTES, Note, Pitch } from "mtts";
import Tile from "../../components/mtts/malo/tile";
import { useState } from "react";
import TileLine from "../../components/mtts/malo/tile-line";
import TileContainer from "../../components/mtts/malo/tile-container";

const Malo: NextPage = () => {
  const [basePitch] = useState(0);
  const tileLines = [];

  for (let i = 0; i < 8; i++) {
    const currentPitch = basePitch + i;
    const notesForPitch = NOTES.map(n => (
      <Tile
        note={new Note({ name: n, pitch: new Pitch({ value: currentPitch }) })}
        key={`tile-${n}-${currentPitch}`}
      ></Tile>
    ));

    tileLines.push(<TileLine tiles={notesForPitch} />);
  }
  return <TileContainer tileLines={tileLines} />;
};

export default Malo;
