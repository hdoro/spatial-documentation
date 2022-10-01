import { JSONContent } from '@tiptap/react'
import {
  EdgeChange,
  NodeChange,
  ReactFlowInstance,
  XYPosition,
} from 'react-flow-renderer'
import create from 'zustand'
import { persist } from 'zustand/middleware'

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

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useStore = create(
  persist<StoreState>(
    (set, get) => ({
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
      onNodesChange: (changes: NodeChange[]) => {
        console.log({ nodes: changes })
        // changes[0].
        // set({
        //   nodes: applyNodeChanges(changes, get().nodes),
        // })
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        console.log({ edges: changes })
        // set({
        //   edges: applyEdgeChanges(changes, get().edges),
        // })
      },
      reactFlowInstance: null,
      setReactFlowInstance: (instance) =>
        set({
          reactFlowInstance: instance,
        }),
    }),
    {
      name: 'docs-storage1',
    },
  ),
)
