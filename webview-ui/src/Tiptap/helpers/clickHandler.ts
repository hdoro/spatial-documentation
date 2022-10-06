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
      // @TODO: debug why this isn't being fired from editors inside the canvas
      /**
       *
       * ProseMirror use the mouseDown handler, which is somehow blocked by ReactFlow's onmousedown on `.react-flow__node react-flow__node-file nopan selectable`.
       * When I remove the listener on RF, this `handleClick` works.
       * This is weird, because RF's handler has `useCapture: false` and it's higher up in the bubbling flow.
       *
       * The same happens in TipTap's documentation, but I think that's due to another root issue, perhaps the fact that the editor is rendered inside an iframe.
       */
      handleClick: (view, pos, event) => {
        console.log('click', {
          view,
          pos,
          event,
          test: event.getModifierState('Control'),
        })
        // event.stopPropagation()
        const attrs = getAttributes(view.state, options.type.name)
        const link = (event.target as HTMLElement)?.closest('a')

        // @TODO: only fire when user is pressing CTRL (Win/Linux) or CMD (Mac) - could use the is-hotkey package w/ event.getModifierState?
        if (link && attrs.href && (event.metaKey || event.ctrlKey)) {
          window.open(attrs.href, attrs.target)

          return true
        }

        return false
      },

      // Registers a `click` event, not `mousedown`
      handleDOMEvents: {
        click: (view, event) => {
          console.log('click handler (handleDOMEvents)', { view, event })
        },
      },
    },
  })
}
