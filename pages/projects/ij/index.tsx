import React from 'react'
import dynamic from 'next/dynamic'
import { getCellHeaderTitle } from '../../../helpers/projects/ij/cellHeader'

const IJInput = dynamic(
  () => import('../../../components/ij/input'),
  { ssr: false }
)

function IJ () {
  const cellNumbers = 50
  const matrix: Array<Array<string>> = []

  for (let i = 0; i < cellNumbers; i++) {
    matrix.push(Array(cellNumbers).fill(''))
  }

  matrix[0] = matrix[0].map((_, index) => getCellHeaderTitle(index))

  return <div className="w-screen h-screen">
    <table className="w-full h-full">
      <thead>
        <tr>
          {matrix[0].map(column => <th className="border" key={`header-${column}`}>{column}</th>)}
        </tr>
      </thead>
      <tbody onClick={(e) => { console.log(e.target) }}>
        {matrix.map((line, lineIndex) =>
          <tr key={`line-${lineIndex}`} data-line data-row={lineIndex}>
            {line.map((cell, cellIndex) => (
              <td className="border" key={`cell-${lineIndex}-${cellIndex}`} data-row={lineIndex} data-col={cellIndex} data-cell>
                <IJInput
                  i={lineIndex}
                  j={cellIndex}
                  getValue={(e) => Promise.resolve('')}
                  setValue={(i, j, value) => Promise.resolve(true)}
                />
              </td>
            ))}
          </tr>
        )}
      </tbody>
    </table>
  </div>
}

export default IJ
