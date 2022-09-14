import { Box, Modal, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { marked } from "marked";
import { useState } from "react";
import { Handle, Node, Position } from "react-flow-renderer";
import { FileInfo, useStore } from "./store";

export function DocumentNode({ data, selected, ...props }: Node<FileInfo>) {
  const [status, setStatus] = useState("idle");
  const { removeFilesFromCanvas } = useStore();

  return (
    <>
      <div
        style={{
          background: "white",
          borderRadius: ".35em",
          border: selected ? "2px solid #333" : "2px solid #888",
          padding: "1em",
          fontSize: ".7rem",
        }}
      >
        <Handle
          type="source"
          position={Position.Right}
          style={{ opacity: 0 }}
        />
        <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
        <pre>{data.fileName}</pre>
        {data.contents && (
          <div
            dangerouslySetInnerHTML={{ __html: marked.parse(data.contents) }}
          ></div>
        )}
        {selected && (
          <div className="card--actions">
            <Button
              variant="outlined"
              onClick={() => {
                removeFilesFromCanvas([data.fileId]);
              }}
              color="error"
            >
              Remove
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setStatus("editing");
              }}
              color="primary"
            >
              Edit
            </Button>
          </div>
        )}
        <Modal
          open={status === "editing"}
          onClose={() => setStatus("idle")}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edição aqui!
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              (explicação do arquivo)
            </Typography>
          </Box>
        </Modal>
      </div>
    </>
  );
}
