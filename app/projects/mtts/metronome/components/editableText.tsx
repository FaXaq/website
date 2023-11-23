import React, { useRef, useState } from "react"

interface EditableTextProps {
  value: string,
  updateValue: (value: string) => void
}

export default function EditableText({ value, updateValue }: EditableTextProps) {
  const inputRef = useRef<HTMLInputElement>()
  const [isEditing, setIsEditing] = useState<boolean>(false)

  function startEditing() {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current.focus()
      inputRef.current.select()
    }, 25)
  }

  return (<>
    {!isEditing && <p onDoubleClick={() => startEditing()}>{value}</p> }
    {isEditing && (
      <input
        className="text-center block w-full h-full bg-mtts-white text-mtts-dark-violet border-transparent focus:outline-none"
        ref={inputRef}
        onBlur={() => setIsEditing(false)}
        value={value}
        onChange={(e) => updateValue(e.target.value)}
      />
    )}
  </>
  )
}