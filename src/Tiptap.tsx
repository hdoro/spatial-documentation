import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

const Tiptap = ({
  onChange,
  content,
}: {
  content?: JSONContent
  onChange?: (content: JSONContent) => void
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'About this code...',
      }),
    ],
    content,
  })

  useEffect(() => {
    if (editor) {
      onChange?.(editor.getJSON())
    }
  }, [editor?.state])

  return (
    <EditorContent
      editor={editor}
      className="tiptap"
      style={{
        cursor: 'text',
      }}
    />
  )
}

export default Tiptap
