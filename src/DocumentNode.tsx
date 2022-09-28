import { Handle, Node, Position } from 'react-flow-renderer'
import { FileInfo, useStore } from './store'
import Tiptap from './Tiptap'

export function DocumentNode({ data, selected, ...props }: Node<FileInfo>) {
  const { editFile } = useStore()

  return (
    <>
      <div
        style={{
          background: 'white',
          borderRadius: '.35em',
          border: selected ? '2px solid #333' : '2px solid #888',
          padding: '1em',
          fontSize: '.7rem',
          width: '20vw',
        }}
      >
        <Handle
          type="source"
          position={Position.Right}
          style={{ opacity: 0 }}
        />
        <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
        <pre>{data.fileName}</pre>
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
