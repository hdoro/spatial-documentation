import type { Editor } from '@tiptap/core'
import { getAttributes } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import { MarkType } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'
import tippy from 'tippy.js'
import { EditLink } from '../EditLink'

type ClickHandlerOptions = {
  editor: Editor
  type: MarkType
}

export function clickHandler(options: ClickHandlerOptions): Plugin {
  return new Plugin({
    key: new PluginKey('handleClickLink'),
    props: {
      // Registers a `click` event, not `mousedown` - see git history for confusing ProseMirror functionality
      handleDOMEvents: {
        click: (view, event) => {
          const attrs = getAttributes(view.state, options.type.name)
          const link = (event.target as HTMLElement)?.closest('a')

          if (!link) return

          // Open link if clicking CMD/CTRL
          if (attrs.href && (event.metaKey || event.ctrlKey)) {
            window.open(attrs.href, attrs.target)

            return true
          }

          // Or open its edit pop-up
          const reactRenderer = new ReactRenderer(EditLink, {
            props: {
              ...options,
              view,
            },
            editor: options.editor,
          })

          tippy('body', {
            getReferenceClientRect: () => link.getBoundingClientRect(),
            appendTo: () => document.body,
            content: reactRenderer.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          })
        },
      },
    },
  })
}
