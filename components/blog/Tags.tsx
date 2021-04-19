import React from 'react'

interface TagsProps {
  tags: string[],
  removable?: boolean,
  onDelete?: (tag: string) => any | Promise<any>,
  onClick?: (tag: string) => any | Promise<any>
}

const Tags = ({ tags, removable = false, onDelete, onClick }: TagsProps) => {
  function handleOnClick (tag) {
    if (!onClick) {
      console.warn('no onClick handle for', tags)
      return
    }

    return onClick(tag)
  }

  return (
    <div>
      <ul className="flex py-4">
        {tags.map(tag => (
          <li key={tag} className="flex mr-2 cursor-pointer">
            <div className="px-2 py-1 bg-gray-500" onClick={() => handleOnClick(tag)}>
              <span>{tag}</span>
            </div>
            <button onClick={() => onDelete(tag)}>
              {removable && <span className='px-2 py-1 bg-gray-900 text-white border-none'>x</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Tags
