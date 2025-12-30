import { Badge, List } from '@chakra-ui/react';
import { LuCircleX } from 'react-icons/lu';

interface TagsProps {
  tags: string[],
  removable?: boolean,
  onDelete: (tag: string) => void,
  onClick: (tag: string) => void
}

const Tags = ({ tags, removable = false, onDelete, onClick }: TagsProps) => {
  if (tags.length === 0) {
    return;
  }

  function handleOnClick(tag: string) {
    if (!onClick) {
      console.warn('no onClick handle for', tags);
      return;
    }

    return onClick(tag);
  }

  return (
    <List.Root variant="plain" display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
      {tags.map(tag => (
        <List.Item key={tag}>
          <Badge onClick={() => handleOnClick(tag)} cursor="pointer" bg="bg.emphasized">
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
  );
};

export default Tags;
