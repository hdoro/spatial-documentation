import { Extension, Editor, Range } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance } from 'tippy.js'
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import uFuzzy from '@leeoniya/ufuzzy'
import { CommandsList } from './CommandsList'

export const COMMANDS: {
  title: string
  id: string
  onTrigger: (editor: Editor, range: Range) => void
  isActive: (editor: Editor) => boolean
  // @TODO: icons & better layout
  // icon: JSX.Element
}[] = [
  {
    title: 'Text',
    id: 'paragraph',
    onTrigger: (editor) => editor.chain().focus().clearNodes().run(),
    // @TODO: ensure only paragraph is set
    isActive: (editor) => editor.isActive('paragraph'),
  },
  {
    title: 'Heading 1',
    id: 'h1',
    onTrigger: (editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
  },
  {
    title: 'Heading 2',
    id: 'h2',
    onTrigger: (editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
  },
  {
    title: 'Heading 3',
    id: 'h3',
    onTrigger: (editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 3 }),
  },
  {
    title: 'Bullet list',
    id: 'bulletList',
    onTrigger: (editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive('bulletList'),
  },
  {
    title: 'Numbered list',
    id: 'orderedList',
    onTrigger: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive('orderedList'),
  },
  {
    title: 'Quote',
    id: 'blockquote',
    onTrigger: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive('blockquote'),
  },
  {
    title: 'Divider',
    id: 'horizontalRule',
    onTrigger: (editor) => editor.chain().focus().setHorizontalRule().run(),
    isActive: (editor) => editor.isActive('horizontalRule'),
  },
  {
    title: 'Code block',
    id: 'codeBloc',
    onTrigger: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive('codeBlock'),
  },
]

const commandsTitles = COMMANDS.map((c) => c.title)

const fuzzy = new uFuzzy()

export default Extension.create({
  name: 'commands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        // @TODO: any way to prevent suggestions for showing when you click on links, without having to enable only on start of line?
        startOfLine: true,
        command: ({ editor, range, props }) => {
          // 1. Delete the slash
          editor.commands.deleteRange(range)
          // 2. Run the command
          props.onTrigger(editor, range)
        },
        items: ({ query }) => {
          if (!query) return COMMANDS

          const filtered = fuzzy.filter(commandsTitles, query)
          const info = fuzzy.info(filtered, commandsTitles, query)
          const ordered = fuzzy.sort(info, commandsTitles, query)

          return ordered.map((index) =>
            COMMANDS.find((c) => c.title === commandsTitles[info.idx[index]]),
          )
        },
        render() {
          let reactRenderer: ReactRenderer
          let popup: Instance[]

          return {
            onStart: (props) => {
              reactRenderer = new ReactRenderer(CommandsList, {
                props,
                editor: props.editor,
              })

              if (!props.clientRect) {
                return
              }

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect as any,
                appendTo: () => document.body,
                content: reactRenderer.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              })
            },

            onUpdate(props) {
              reactRenderer?.updateProps(props)

              if (!props.clientRect) {
                return
              }

              popup?.[0]?.setProps({
                getReferenceClientRect: props.clientRect as any,
              })
            },

            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                popup[0].hide()

                return true
              }

              return (reactRenderer?.ref as any)?.onKeyDown(props)
            },

            onExit(_props) {
              popup?.[0]?.destroy()
              reactRenderer?.destroy()
            },
          }
        },
      } as SuggestionOptions<typeof COMMANDS[0]>,
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
