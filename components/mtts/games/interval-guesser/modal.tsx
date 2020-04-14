import React from 'react'

interface IntervalGuesserModalProps {
  isShowing: boolean
  children?: JSX.Element | JSX.Element[]
  onClose: (...e: any) => any
  hasWon: boolean
}

const IntervalGuesserModal = ({ isShowing, onClose, hasWon }: IntervalGuesserModalProps) => {
  return isShowing
    ? (
      <>
        <div
          className="modal-overlay absolute inset-0 opacity-25 bg-mtts-dark-violet"
          onClick={() => onClose()}
        >
        </div>
        <div className="w-1/2 h-1/2 absolute top-0 left-0 bg-mtts-white rounded center-absolute">
          <p>{ hasWon ? 'Well done !' : 'Booooo' }</p>
        </div>
      </>
    ) : null
}

export default IntervalGuesserModal
