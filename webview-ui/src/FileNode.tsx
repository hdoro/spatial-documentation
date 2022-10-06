import { Handle, Node, Position } from 'react-flow-renderer'
import { FileInfo, useStore } from './store'
import Tiptap from './Tiptap/Tiptap'
import icons from './icons'
import { useState } from 'react'

export function FileNode({ data, selected, ...props }: Node<FileInfo>) {
  const [fullScreen, setFullScreen] = useState(false)
  const { editFile } = useStore()

  return (
    <>
      <div
        className={`bg-white p-3 rounded-md border-2 ${
          selected ? 'border-gray-700' : 'border-gray-300'
        } ${
          // @TODO: implement full screen - probably need a portal, reach for headless UI
          fullScreen ? 'fixed w-[100vw] h-[100vw] left-0 top-0' : 'w-[20vw]'
        }`}
      >
        {/* Header */}
        <div className="border-b-2 pb-2 px-2 border-gray-200 flex gap-4 justify-between items-center">
          <div className="flex gap-2 items-center">
            <button
              onClick={() =>
                editFile({
                  fileId: data.fileId,
                  folded: !(data.folded || false),
                })
              }
              className="text-gray-700 hover:text-gray-900"
            >
              <span className="sr-only">Fold card</span>
              <icons.Fold
                className={`w-[1em] ${data.folded ? 'rotate-180' : ''}`}
              />
            </button>
            <button
              onClick={() => setFullScreen(!fullScreen)}
              className="text-gray-700 hover:text-gray-900"
            >
              <span className="sr-only">
                {fullScreen ? 'Minimize card' : 'View card in full screen'}
              </span>
              {fullScreen ? (
                <icons.Minimize className="w-[1em] " />
              ) : (
                <icons.FullScreen className="w-[1em] " />
              )}
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() =>
                editFile({ fileId: data.fileId, position: undefined })
              }
              className="text-gray-700 hover:text-red-800"
            >
              <span className="sr-only">Delete</span>
              <icons.Delete className="w-[1em] " />
            </button>
          </div>
        </div>

        {/* Hacky way of showing arrows: opacity = 0 on handles. W/o handles react-flow doesn't render edges */}
        <Handle
          type="source"
          position={Position.Right}
          style={{ opacity: 0 }}
          hidden={true}
        />
        <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />

        <div className="px-2 pt-2">
          <pre className="text-lg">{data.fileName}</pre>

          {data.folded && !fullScreen ? null : (
            <Tiptap
              content={data.content}
              onChange={(content) =>
                editFile({
                  fileId: data.fileId,
                  content,
                })
              }
            />
          )}
        </div>
      </div>
    </>
  )
}
