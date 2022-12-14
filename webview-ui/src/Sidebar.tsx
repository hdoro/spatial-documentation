import { useMemo } from 'react'
import { useStore } from './store'
import { formatFilePath } from './utilities/formatFilePath'
import { vscode } from './utilities/vscode'

export default () => {
  const { files } = useStore()

  const unaddedFiles = useMemo(
    () => files.filter((file) => !file.position),
    [files],
  )

  return (
    <aside className="flex-[1_0_150px] md:max-w-xs md:h-full flex flex-col gap-5 text-slate-600 text-xs pt-4 px-3 bg-white sm:border-t sm:border-t-slate-200 md:border-t-0 md:border-l md:border-l-slate-200">
      <div className="order-2 md:-order-1 text-xs flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-900 py-3 px-2 rounded-md">
        <svg className="w-[4em]" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            d="M7.998 2.001c-1.229 0-2.35.481-3.168 1.31c-.798.81-1.29 1.937-1.33 3.233l-.001.019v.02c.057 1.236.655 2.324 1.737 3.454l.702 2.941l.007.022c.1.297.292.544.534.717c.251.18.558.282.883.282l1.384-.004l.021-.002a1.51 1.51 0 0 0 .84-.345c.231-.194.406-.46.48-.774l.796-3.05c1.034-.994 1.618-2.144 1.618-3.437a4.318 4.318 0 0 0-1.32-3.102a4.55 4.55 0 0 0-3.183-1.284ZM5.543 4.013A3.414 3.414 0 0 1 7.998 3a3.55 3.55 0 0 1 2.486 1a3.318 3.318 0 0 1 1.017 2.386c0 .991-.453 1.926-1.404 2.805l-.108.1L9.543 11H6.494l-.349-1.464l-.097-.1C5 8.372 4.548 7.48 4.499 6.557c.038-1.048.434-1.925 1.044-2.543ZM6.733 12h2.55l-.165.627l-.003.013a.445.445 0 0 1-.15.24a.509.509 0 0 1-.267.115L7.361 13a.516.516 0 0 1-.3-.095a.457.457 0 0 1-.162-.206L6.732 12Z"
          ></path>
        </svg>
        <div>
          <h2>Drag these files into the canvas to document them</h2>

          <button
            onClick={() => vscode.postMessage({ type: 'persist-data', files })}
            className="mt-2 border border-sky-500 px-2 py-1 rounded-md text-sky-900 font-semibold hover:bg-sky-100 hover:border-sky-700"
          >
            Persist data
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {unaddedFiles.map((file) => (
          <div
            key={file.fileId}
            className="px-1 py-2 text-slate-800 bg-white border border-transparent hover:border-slate-500 hover:bg-slate-50 rounded-md font-mono cursor-grab overflow-hidden"
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', file.fileId)
              event.dataTransfer.effectAllowed = 'move'
            }}
            draggable
          >
            <span className="whitespace-nowrap">
              {formatFilePath(file.filePath)}
            </span>
          </div>
        ))}
      </div>
    </aside>
  )
}
