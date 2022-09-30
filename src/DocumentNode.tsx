import { Handle, Node, Position } from 'react-flow-renderer'
import { FileInfo, useStore } from './store'
import Tiptap from './Tiptap/Tiptap'
import icons from './icons'

export function DocumentNode({ data, selected, ...props }: Node<FileInfo>) {
  const { editFile, removeFilesFromCanvas } = useStore()

  return (
    <>
      <div
        className={`bg-white p-3 rounded-md border-2 ${
          selected ? 'border-gray-700' : 'border-gray-300'
        } w-[20vw]`}
      >
        {/* Header */}
        <div className="border-b-2 border-gray-200">
          <button
            onClick={() => removeFilesFromCanvas([data.fileId])}
            className="text-gray-700 hover:text-red-800"
          >
            <span className="sr-only">Delete</span>
            <icons.Delete className="w-[1em] " />
          </button>
        </div>

        {/* Hacky way of showing arrows: opacity = 0 on handles. W/o handles react-flow doesn't render edges */}
        <Handle
          type="source"
          position={Position.Right}
          style={{ opacity: 0 }}
          hidden={true}
        />
        <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />

        <pre className="text-lg">{data.fileName}</pre>

        <Tiptap
          content={data.content}
          onChange={(content) =>
            editFile({
              fileId: data.fileId,
              content,
            })
          }
        />
      </div>
    </>
  )
}
