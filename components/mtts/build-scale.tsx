import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Note, Scale, NOTES, ACCIDENTALS, Accidental, ACCIDENTAL } from "mtts";
import MultiSelector from "../multi-selector";

function BuildScale() {
  const { t } = useTranslation();
  const [accidental, setAccidental] = useState(new Accidental());
  const [note, setNote] = useState(new Note({ name: "C", accidental }));
  const [scale, setScale] = useState(new Scale({ key: note }));
  const [possibleAccidentals] = useState(
    ACCIDENTALS.filter(a => !a.includes("DOUBLE"))
  );

  useEffect(() => {
    setScale(
      new Scale({
        key: new Note({ name: note.name, accidental: accidental })
      })
    );
  }, [note]);

  useEffect(() => {
    setNote(new Note({ name: note.name, accidental: accidental }));
  }, [accidental]);

  const notesInScale = [];

  for (let i = 0; i < scale.notes.length; i++) {
    notesInScale.push(
      <li className="pr-4">
        <span>{t(`notes.${scale.notes[i].name}`)} </span>
        <span>
          {scale.notes[i].hasAccidental() &&
          scale.notes[i].accidental.semitones != 0
            ? t(`accidentals.${scale.notes[i].accidental.name}`)
            : ""}
        </span>
      </li>
    );
  }

  const chordsInScale = [];

  for (let i = 0; i < scale.scaleChords.length; i++) {
    const chord = scale.scaleChords[i];
    chordsInScale.push(
      <li>
        <span>
          {t(`notes.${chord.root.name}`)}{" "}
          {chord.root.hasAccidental() && chord.root.accidental.semitones != 0
            ? t(`accidentals.${chord.root.accidental.name}`)
            : ""}{" "}
          {chord.notation}
        </span>
        <ul className="flex">
          {chord.notes.map(n => (
            <li className="px-2">
              {t(`notes.${n.name}`)}{" "}
              {n.hasAccidental() && n.accidental.semitones != 0
                ? t(`accidentals.${n.accidental.name}`)
                : ""}
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <div>
      <h3 className="text-4xl text-mtts-dark-violet">
        {t("pages.mtts.buildScale.title")}
      </h3>
      <h5 className="text-2xl text-mtts-dark-violet py-2">
        {t("pages.mtts.buildScale.selectNote")}
      </h5>
      <MultiSelector
        elements={NOTES}
        selected={note.name}
        setSelected={name =>
          setNote(
            new Note({
              name
            })
          )
        }
        toText={noteName => t(`notes.${noteName}`)}
      />
      <h5 className="text-2xl text-mtts-dark-violet py-2">
        {t("pages.mtts.buildScale.addAccidental")}
      </h5>
      <MultiSelector
        elements={possibleAccidentals}
        selected={accidental.name}
        setSelected={name =>
          setAccidental(new Accidental({ semitones: ACCIDENTAL[name] }))
        }
        toText={accidentalName => t(`accidentals.${accidentalName}`)}
      />
      <h5 className="text-2xl text-mtts-dark-violet py-2">
        {t("pages.mtts.buildScale.scaleTitle")}
      </h5>
      <ul className="flex">{notesInScale}</ul>
      <h5 className="text-2xl text-mtts-dark-violet py-2">
        {t("pages.mtts.buildScale.scaleChordsTitle")}
      </h5>
      <ul>{chordsInScale}</ul>
    </div>
  );
}

export default BuildScale;
