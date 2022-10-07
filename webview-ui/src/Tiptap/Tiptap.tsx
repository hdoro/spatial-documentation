import Placeholder from '@tiptap/extension-placeholder'
import {
  BubbleMenu,
  EditorContent,
  JSONContent,
  useEditor,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { LinkMark } from './LinkMark'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { lowlight } from 'lowlight/lib/core'
import { PluginKey } from 'prosemirror-state'
import { useEffect, useRef } from 'react'
import { useStore } from '../store'
import SlashCommands from './SlashCommands'

const MENU_KEY = new PluginKey('floatingMenu')

const Tiptap = ({
  onChange,
  content,
}: {
  content?: JSONContent
  onChange?: (content: JSONContent) => void
}) => {
  const parentRef = useRef<HTMLDivElement>()
  const store = useStore()
  const editor = useEditor({
    extensions: [
      LinkMark.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-underline text-blue-700',
        },
      }),
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-2 border-gray-600 pl-2 py-1',
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'bg-gray-900 h-[1px] my-2',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-3',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-3',
          },
        },
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: 'About this code...',
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-100 p-3 text-sm',
        },
        defaultLanguage: 'javascript',
      }),
      SlashCommands,
    ],
    content,
  })

  useEffect(() => {
    if (editor) {
      // console.log({ update: editor.getJSON() })
      onChange?.(editor.getJSON())
    }
  }, [editor?.state])

  return (
    <div className="relative mt-3" ref={parentRef as any}>
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{
            duration: 100,
            appendTo: parentRef?.current,
          }}
          pluginKey={MENU_KEY}
        >
          <div className="bg-white border-2 border-gray-100 rounded-sm py-1 flex gap-2 items-center relative z-50">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`${
                editor.isActive('bold') ? 'font-bold' : ''
              } hover:bg-gray-100`}
            >
              bold
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`${
                editor.isActive('italic') ? 'font-bold' : ''
              } hover:bg-gray-100`}
            >
              italic
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`${
                editor.isActive('strike') ? 'font-bold' : ''
              } hover:bg-gray-100`}
            >
              strike
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`${
                editor.isActive('code') ? 'font-bold' : ''
              } hover:bg-gray-100`}
            >
              Code
            </button>
            {/* <button
              onClick={() =>
                editor.chain().focus().toggleLink({ href: '' }).run()
              }
              className={`${
                editor.isActive('link') ? 'font-bold' : ''
              } hover:bg-gray-100`}
            >
              Link
            </button> */}
          </div>
        </BubbleMenu>
      )}
      <EditorContent
        editor={editor}
        className="tiptap"
        style={{
          cursor: 'text',
        }}
      />
    </div>
  )
}

export default Tiptap
