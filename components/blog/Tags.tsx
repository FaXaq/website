import React from 'react'

interface TagsProps {
  tags: string[]
}

const Tags = ({ tags }: TagsProps) => {
  return (
    <div>
      <ul className="flex py-4">
        {tags.map(tag => <li key={tag} className="px-2 py-1 mr-2 bg-gray-500">{tag}</li>)}
      </ul>
    </div>
  )
}

export default Tags
