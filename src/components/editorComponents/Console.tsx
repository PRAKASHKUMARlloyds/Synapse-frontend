import React, { useEffect } from "react";
import { Box, Container, IconButton } from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import type { ImperativePanelHandle } from "react-resizable-panels";

interface OutputType {
  logs: string[];
  result: string;
  error: string;
}

interface ConsoleCompProps {
  minimize: boolean;
  changeMinimize: (val: boolean) => void;
  output: OutputType;
  consolePanelRef: React.RefObject<ImperativePanelHandle> | null;
}

const boxStyle: React.CSSProperties = {
  backgroundColor: "#f4f4f4",
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "10px",
  marginBottom: "10px",
  overflowY: "auto",
  fontFamily: "monospace",
  whiteSpace: "pre-wrap",
  marginLeft: "3vw",
  marginRight: "3vw",
  wordBreak: "break-word",
};

const ConsoleComp: React.FC<ConsoleCompProps> = ({
  minimize,
  changeMinimize,
  output,
  consolePanelRef,
}) => {
  // collapse/expand the panel according to minimize
  useEffect(() => {
    if (!consolePanelRef?.current) return;

    if (minimize) {
      consolePanelRef.current.collapse();
    } else {
      consolePanelRef.current.expand();
    }
  }, [minimize, consolePanelRef]);

  return (
    <Box
      className="consolecomp"
      sx={{
        height: "100%",
        overflowY: "auto",
        overflowX: "auto",
        textAlign: "left",
        backgroundColor: "#116307ff",
      }}
    >
      <Container sx={{ py: 1 }}>
        <IconButton
          aria-label="close"
          id="minimize-btn"
          onClick={() => changeMinimize(true)}
          color="error"
          sx={{ float: "right" }}
        >
          <CancelRoundedIcon />
        </IconButton>
      </Container>

      <Box className="output-display" sx={{ px: 2, pb: 2 }}>
        <h4 style={{ marginLeft: "3vw", color: "white" }}>Logs :</h4>
        <div style={boxStyle}>
          {output.logs.length > 0 ? (
            output.logs.map((log, key) => <div key={key}>{log}</div>)
          ) : (
            <div>No logs</div>
          )}
        </div>

        <h4 style={{ marginLeft: "3vw", color: "white" }}>Output :</h4>
        <div style={boxStyle}>
          {output.result ? (
            <div>{output.result}</div>
          ) : output.error ? (
            <div style={{ color: "red" }}>Error: {output.error}</div>
          ) : (
            <div>No output</div>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default ConsoleComp;
