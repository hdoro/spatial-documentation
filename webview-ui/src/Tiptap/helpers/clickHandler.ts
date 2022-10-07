import type { Editor } from '@tiptap/core'
import { getAttributes } from '@tiptap/core'
import { MarkType } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'

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

          if (link && attrs.href && (event.metaKey || event.ctrlKey)) {
            window.open(attrs.href, attrs.target)

            return true
          }
        },
      },
    },
  })
}
