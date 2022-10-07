import type { Editor } from '@tiptap/core'
import { forwardRef } from 'react'
import { getAttributes } from '@tiptap/core'
import { MarkType } from 'prosemirror-model'

export const EditLink = forwardRef<
  any,
  {
    editor: Editor
    view: any
    type: MarkType
  }
>((props, ref) => {
  const attrs = getAttributes(props.view.state, props.type.name)
  const href = attrs.href || ''

  return (
    <div
      className="overflow-hidden relative z-50 bg-white rounded-md text-sm shadow-sm p-2 border-2 border-slate-300"
      ref={ref as any}
    >
      <label className="flex flex-col gap-1">
        <div className="text-xs text-semibold text-slate-600">Link target</div>
        <input
          name="link-target"
          type="string"
          className="text-slate-800 border border-slate-100 p-1"
          value={href}
          onChange={(e) => {
            const newHref = e.currentTarget.value
            // @TODO: properly edit link's HREF
            props.editor.chain().focus().toggleLink({ href: newHref })
          }}
        ></input>
      </label>
    </div>
  )
})
