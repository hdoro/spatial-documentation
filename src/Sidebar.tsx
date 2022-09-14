import { useStore } from "./store";

export default () => {
  const { unaddedFiles } = useStore();
  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      {unaddedFiles.map((file) => (
        <div
          key={file.fileId}
          className="dndnode"
          onDragStart={(event) => {
            event.dataTransfer.setData("application/reactflow", file.fileId);
            event.dataTransfer.effectAllowed = "move";
          }}
          draggable
        >
          {file.fileName}
        </div>
      ))}
    </aside>
  );
};
