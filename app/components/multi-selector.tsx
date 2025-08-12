'use client'

import React from 'react'

interface MultiSelectorProps<T> {
  selected: T;
  setSelected: (e: T) => void;
  elements: T[];
  toText?: (e: T) => string;
}

function MultiSelector<T> (props: MultiSelectorProps<T>) {
  const elementsList = []
  for (let i = 0; i < props.elements.length; i++) {
    const element = props.elements[i]

    elementsList.push(
      <li
        onClick={() => props.setSelected(element)}
        key={`multi-selector-${element}`}
      >
        {props.toText ? props.toText(element) : element}
      </li>
    )
  }
  return (
    <div>
      <ul >{elementsList}</ul>
    </div>
  )
}

export default MultiSelector
