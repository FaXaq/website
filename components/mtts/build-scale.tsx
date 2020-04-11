import { useTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'
import { Note, Scale, NOTES, ACCIDENTALS, Accidental, ACCIDENTAL } from 'mtts'
import MultiSelector from '../multi-selector'

function BuildScale () {
  const { t } = useTranslation()
  const [accidental, setAccidental] = useState(new Accidental())
  const [note, setNote] = useState(new Note({ name: 'C', accidental }))
  const [scale, setScale] = useState(new Scale({ key: note }))
  const [possibleAccidentals] = useState(
    ACCIDENTALS.filter(a => !a.includes('DOUBLE'))
  )

  useEffect(() => {
    setScale(
      new Scale({
        key: new Note({ name: note.name, accidental: accidental })
      })
    )
  }, [note])

  useEffect(() => {
    setNote(new Note({ name: note.name, accidental: accidental }))
  }, [accidental])

  const notesInScale = scale.notes.map((sn, i) => (
    <li className="pr-4" key={`note-${i}`}>
      <span>{t(`mtts.notes.${sn.name}`)} </span>
      <span>
        {sn.hasAccidental() &&
          sn.accidental.semitones !== 0
          ? t(`mtts.accidentals.${sn.accidental.name}`)
          : ''}
      </span>
    </li>
  ))

  const chordsInScale = scale.scaleChords.map((sc, i) => (
    <li key={`scale-chord-${i}`}>
      <span>
        {t(`mtts.notes.${sc.root.name}`)}{' '}
        {sc.root.hasAccidental() && sc.root.accidental.semitones !== 0
          ? t(`mtts.accidentals.${sc.root.accidental.name}`)
          : ''}{' '}
        {sc.notation}
      </span>
      <ul className="flex">
        {sc.notes.map(n => (
          <li className="px-2" key={n.name}>
            {t(`mtts.notes.${n.name}`)}{' '}
            {n.hasAccidental() && n.accidental.semitones !== 0
              ? t(`mtts.accidentals.${n.accidental.name}`)
              : ''}
          </li>
        ))}
      </ul>
    </li>
  ))

  return (
    <div>
      <h3 className="text-4xl text-mtts-dark-violet">
        {t('mtts.components.buildScale.title')}
      </h3>
      <h5 className="text-2xl text-mtts-dark-violet py-2">
        {t('mtts.components.buildScale.selectNote')}
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
        toText={noteName => t(`mtts.notes.${noteName}`)}
      />
      <h5 className="text-2xl text-mtts-dark-violet py-2">
        {t('mtts.components.buildScale.addAccidental')}
      </h5>
      <MultiSelector
        elements={possibleAccidentals}
        selected={accidental.name}
        setSelected={name =>
          setAccidental(new Accidental({ semitones: ACCIDENTAL[name] }))
        }
        toText={accidentalName => t(`mtts.accidentals.${accidentalName}`)}
      />
      <h5 className="text-2xl text-mtts-dark-violet py-2">
        {t('mtts.components.buildScale.scaleTitle')}
      </h5>
      <ul className="flex">{notesInScale}</ul>
      <h5 className="text-2xl text-mtts-dark-violet py-2">
        {t('mtts.components.buildScale.scaleChordsTitle')}
      </h5>
      <ul>{chordsInScale}</ul>
    </div>
  )
}

export default BuildScale
