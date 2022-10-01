import Placeholder from '@tiptap/extension-placeholder'
import {
  BubbleMenu,
  EditorContent,
  JSONContent,
  useEditor,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
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
  const parentRef = useRef()
  const store = useStore()
  const editor = useEditor({
    extensions: [
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
      // @TODO: debug why opening on click isn't working (doesn't work on the docs either - https://tiptap.dev/api/marks/link)
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-underline text-blue-700',
        },
      }),
      // Mention.configure({
      //   HTMLAttributes: {
      //     class: 'bg-gray-50 px-1 font-semibold',
      //     onClick: () => console.info('HEREE'),
      //   },
      //   suggestion: mentionSuggestion(store),
      // }),
    ],
    content,
  })

  useEffect(() => {
    if (editor) {
      console.log({ update: editor.getJSON() })
      onChange?.(editor.getJSON())
    }
  }, [editor?.state])

  return (
    <div className="relative" ref={parentRef}>
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{
            duration: 100,
            appendTo: parentRef?.current,
          }}
          pluginKey={MENU_KEY}
        >
          <div className="bg-white border-2 border-gray-100 rounded-sm px-2 py-1 flex gap-2 items-center relative z-50">
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
