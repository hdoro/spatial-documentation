import { JSONContent } from '@tiptap/react'
import { ReactFlowInstance, XYPosition } from 'react-flow-renderer'
import create from 'zustand'
import { vscode } from './utilities/vscode'

// @TODO: rename to "document"?
export interface FileInfo {
  fileId: string
  filePath: string
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
  setFiles: (files: FileInfo[]) => void
}

const INITIAL_STATE: StoreState = {
  files: [],
  reactFlowInstance: null,
  setFiles() {},
  editFile() {},
  setReactFlowInstance() {},
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useStore = create<StoreState>((set, get) => ({
  ...INITIAL_STATE,
  setFiles: (files) => {
    set({
      files,
    })
  },
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
    vscode.postMessage({
      type: 'persist-data',
      files: get().files,
    })
  },
  setReactFlowInstance: (instance) =>
    set({
      reactFlowInstance: instance,
    }),
}))
