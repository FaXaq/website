import React, { useRef, useState } from "react";

interface EditableTextProps {
  value: string,
  updateValue: (value: string) => void
}

export default function EditableText({ value, updateValue }: EditableTextProps) {
  const inputRef = useRef<HTMLInputElement>(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  function startEditing() {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current.focus();
      inputRef.current.select();
    }, 25);
  }

  return (<>
    {!isEditing && <p onDoubleClick={() => startEditing()}>{value}</p> }
    {isEditing && (
      <input

        ref={inputRef}
        onBlur={() => setIsEditing(false)}
        value={value}
        onChange={(e) => updateValue(e.target.value)}
      />
    )}
  </>
  );
}