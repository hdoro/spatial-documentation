import React, { useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  NodeTypes,
  ReactFlowProvider,
} from "react-flow-renderer";
import { DocumentNode } from "./DocumentNode";

import Sidebar from "./Sidebar";
import { useStore } from "./store";

const nodeTypes: NodeTypes = { document: DocumentNode as any };

const DnDFlow = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addFilesToCanvas,
    setReactFlowInstance,
    reactFlowInstance,
  } = useStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowWrapper?.current) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const fileId = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof fileId === "undefined" || !fileId) {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      addFilesToCanvas([
        {
          fileId,
          position,
        },
      ]);
    },
    [reactFlowInstance]
  );

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            nodeTypes={nodeTypes}
            // Read-only connections
            nodesConnectable={false}
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;
