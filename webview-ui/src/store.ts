import { JSONContent } from '@tiptap/react'
import { ReactFlowInstance, XYPosition } from 'react-flow-renderer'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { vscode } from './utilities/vscode'

// @TODO: rename to "document"?
export interface FileInfo {
  fileId: string
  fileName: string
  content?: JSONContent
  references?: string[]
  folded?: boolean
  position?: XYPosition
  mentions?: FileInfo['fileId'][]
}

export type StoreState = {
  files: FileInfo[]
  editFile: (
    updatedFile: Partial<Omit<FileInfo, 'fileId'>> & Pick<FileInfo, 'fileId'>,
  ) => void
  reactFlowInstance: ReactFlowInstance | null
  setReactFlowInstance: (instance: ReactFlowInstance) => void
}

const INITIAL_STATE: StoreState = {
  files: [
    {
      fileId: 'asjd912390',
      fileName: 'index.tsx',
      position: { x: 250, y: 5 },
    },
    {
      fileId: 'asjasdd912390',
      fileName: 'App.tsx',
    },
    {
      fileId: 'aasdksjasdd9123390',
      fileName: 'queries.ts',
    },
    {
      fileId: 'aasdksjasdd912390',
      fileName: 'Sidebar.tsx',
    },
    {
      fileId: 'aasdasdg1ksjasdd912390',
      fileName: 'package.json',
    },
  ],
  reactFlowInstance: null,
  editFile() {},
  setReactFlowInstance() {},
}

const VERSION = 0

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useStore = create(
  persist<StoreState>(
    (set, get) => ({
      ...INITIAL_STATE,
      editFile: (updatedFile) => {
        set({
          files: get().files.map((file) => {
            if (file.fileId !== updatedFile.fileId) return file

            return {
              ...file,
              ...updatedFile,
            }
          }),
        })
      },
      setReactFlowInstance: (instance) =>
        set({
          reactFlowInstance: instance,
        }),
    }),
    {
      name: 'spatial-docs',
      version: VERSION,
      // @TODO: can we prevent having to do serialize/deserialize the state twice?
      // Zustand requires strings but vscode.get/setState already work with parsed JSON values
      getStorage: () => {
        function getVsStorage(name: string) {
          return (
            vscode.getState() || {
              [name]: {
                state: INITIAL_STATE,
                version: VERSION,
              },
            }
          )
        }

        return {
          getItem(name) {
            const storage = getVsStorage(name)
            return JSON.stringify(storage[name])
          },
          setItem(name, value) {
            const storage = getVsStorage(name)
            vscode.setState({
              ...storage,
              [name]: {
                version: VERSION,
                state: JSON.parse(value)?.state as StoreState,
              },
            })
          },
          removeItem(name) {
            const storage = getVsStorage(name)
            delete storage[name]
            vscode.setState(storage)
          },
        }
      },
    },
  ),
)
