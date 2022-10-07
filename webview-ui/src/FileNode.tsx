import { Handle, Node, Position } from 'react-flow-renderer'
import { FileInfo, useStore } from './store'
import Tiptap from './Tiptap/Tiptap'
import icons from './icons'
import { useState } from 'react'
import { formatFilePath } from './utilities/formatFilePath'
import { vscode } from './utilities/vscode'

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
          fullScreen ? 'fixed w-[100vw] h-[100vw] left-0 top-0' : 'w-64'
        }`}
      >
        {/* Header */}
        <div className="border-b-2 pb-2 border-gray-200 flex gap-4 justify-between items-center">
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

        <div className="pt-3">
          <button
            className="text-base font-mono overflow-hidden underline flex items-center gap-1 w-full text-left"
            onClick={() => [
              vscode.postMessage({
                type: 'open-file',
                path: data.filePath,
              }),
            ]}
            title={`Open file ${data.filePath}`}
          >
            <svg
              className="w-[1.5em] text-slate-900"
              viewBox="0 0 28 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.75 2.25C7.82174 2.25 6.9315 2.61875 6.27513 3.27513C5.61875 3.9315 5.25 4.82174 5.25 5.75V23.25C5.25 24.1783 5.61875 25.0685 6.27513 25.7249C6.9315 26.3813 7.82174 26.75 8.75 26.75H19.25C20.1783 26.75 21.0685 26.3813 21.7249 25.7249C22.3813 25.0685 22.75 24.1783 22.75 23.25V9.9745C22.7494 9.27854 22.4724 8.61131 21.98 8.1195L16.8823 3.01825C16.6384 2.77453 16.3489 2.58125 16.0303 2.44943C15.7117 2.31761 15.3703 2.24984 15.0255 2.25H8.75ZM7 5.75C7 5.28587 7.18437 4.84075 7.51256 4.51256C7.84075 4.18437 8.28587 4 8.75 4H14V8.375C14 9.07119 14.2766 9.73887 14.7688 10.2312C15.2611 10.7234 15.9288 11 16.625 11H21V23.25C21 23.7141 20.8156 24.1592 20.4874 24.4874C20.1592 24.8156 19.7141 25 19.25 25H8.75C8.28587 25 7.84075 24.8156 7.51256 24.4874C7.18437 24.1592 7 23.7141 7 23.25V5.75ZM20.6378 9.25H16.625C16.3929 9.25 16.1704 9.15781 16.0063 8.99372C15.8422 8.82962 15.75 8.60706 15.75 8.375V4.36225L20.6378 9.25Z"
                fill="#111827"
              />
            </svg>

            <span className="whitespace-nowrap text-slate-600">
              {formatFilePath(data.filePath)}
            </span>
          </button>

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
