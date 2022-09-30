import { JSONContent } from '@tiptap/react'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  ReactFlowInstance,
  XYPosition,
} from 'react-flow-renderer'
import create from 'zustand'
import { persist } from 'zustand/middleware'

export interface FileInfo {
  fileId: string
  fileName: string
  content?: JSONContent
  references?: string[]
}

export type StoreState = {
  nodes: Node<FileInfo>[]
  unaddedFiles: FileInfo[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  editFile: (
    updatedFile: Partial<Omit<FileInfo, 'fileId'>> & Pick<FileInfo, 'fileId'>,
  ) => void
  addFilesToCanvas: (
    nodes: {
      fileId: FileInfo['fileId']
      position: XYPosition
    }[],
  ) => void
  removeFilesFromCanvas: (nodeIds: FileInfo['fileId'][]) => void
  reactFlowInstance: ReactFlowInstance | null
  setReactFlowInstance: (instance: ReactFlowInstance) => void
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useStore = create(
  persist<StoreState>(
    (set, get) => ({
      nodes: [
        {
          id: 'asjd912390',
          type: 'document',
          data: {
            fileId: 'asjd912390',
            fileName: 'index.tsx',
          },
          position: { x: 250, y: 5 },
        },
      ],
      unaddedFiles: [
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
      edges: [],
      addFilesToCanvas: (newFiles = []) => {
        const curState = get()
        const newFileIds = newFiles.map((f) => f.fileId)
        const newNodes = newFiles
          .map((newFile) => {
            const fileData = curState.unaddedFiles.find(
              (unaddedFile) => unaddedFile.fileId === newFile?.fileId,
            )

            if (!newFile || !curState.reactFlowInstance || !fileData?.fileId) {
              return
            }

            return {
              id: fileData?.fileId,
              type: 'document',
              position: curState.reactFlowInstance.project(newFile.position),
              data: fileData,
            }
          })
          .filter((node) => !!node?.id) as StoreState['nodes']

        const edges = [...curState.nodes, ...newNodes].reduce(
          (edges, curNode, index, arr) => {
            return [
              ...edges,
              {
                source: curNode.id,
                target: arr[index + 1]?.id,
                // Create the id from (...)
                id: `${curNode.id}--${arr[index + 1]?.id}`,
              },
            ].filter((edge) => !!edge.target)
          },
          [] as Edge[],
        )

        set({
          nodes: [...curState.nodes, ...newNodes],
          edges,
          // @TODO: auto-parse unadded & added files based on database query
          unaddedFiles: curState.unaddedFiles.filter(
            (file) => !newFileIds.includes(file.fileId),
          ),
        })
      },
      editFile: (updatedFile) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.data.fileId !== updatedFile.fileId) return node

            return {
              ...node,
              data: {
                ...node.data,
                ...updatedFile,
              },
            }
          }),
        })
      },
      removeFilesFromCanvas: (nodeIds) => {
        const inCanvas = get().nodes.filter(
          (node) => !nodeIds.includes(node.id),
        )
        const offCanvas = get().nodes.filter((node) =>
          nodeIds.includes(node.id),
        )
        set({
          nodes: inCanvas,
          unaddedFiles: [
            ...get().unaddedFiles,
            ...offCanvas.map((item) => item.data),
          ],
        })
      },
      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        })
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        })
      },
      onConnect: (connection: Connection) => {
        set({
          edges: addEdge(connection, get().edges),
        })
      },
      reactFlowInstance: null,
      setReactFlowInstance: (instance) =>
        set({
          reactFlowInstance: instance,
        }),
    }),
    {
      name: 'docs-storage',
    },
  ),
)
