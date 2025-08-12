'use client'

import { Badge, List } from '@chakra-ui/react'
import React from 'react'
import { LuCircleX } from 'react-icons/lu'

interface TagsProps {
  tags: string[],
  removable?: boolean,
  onDelete?: (tag: string) => any | Promise<any>,
  onClick?: (tag: string) => any | Promise<any>
}

const Tags = ({ tags, removable = false, onDelete, onClick }: TagsProps) => {
  if (tags.length === 0) {
    return
  }

  function handleOnClick (tag) {
    if (!onClick) {
      console.warn('no onClick handle for', tags)
      return
    }

    return onClick(tag)
  }

  return (
    <List.Root variant="plain" display="flex" flexDirection="row" gap={2}>
      {tags.map(tag => (
        <List.Item key={tag}>
          <Badge onClick={() => handleOnClick(tag)} cursor="pointer">
            {tag}
            {removable && (
              <LuCircleX onClick={() => onDelete(tag)} cursor="pointer">
              x
              </LuCircleX>
            )}
          </Badge>
        </List.Item>
      ))}
    </List.Root>
  )
}

export default Tags
