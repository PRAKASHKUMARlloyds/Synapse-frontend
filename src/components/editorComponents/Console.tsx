import React from "react";
import { useEffect } from "react";
// import CloseIcon from "@mui/icons-material/Close";
import { Container, IconButton, Box } from "@mui/material";
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import type {ImperativePanelHandle} from 'react-resizable-panels';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
// import "../CSS/console.css";

interface OutputType {
  logs: string[];
  result: string;
  error: string;
}

interface ConsoleCompProps {
  minimize: boolean;
  changeMinimize: (val: boolean) => void;
  output: OutputType;
  consolePanelRef:  React.RefObject<ImperativePanelHandle> | null
}

const boxStyle = {
  backgroundColor: "#f4f4f4",
  // backgroundColor: "#9aeb90ff",
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "10px",
  marginBottom: "10px",
  overflowY: "auto",
  fontFamily: "monospace",
  whiteSpace: "pre-wrap" as const,
  marginLeft: "3vw",
  marginRight: "3vw",
  wordBreak: "break-word",
  overflow: "auto",
  overflowX: "hidden",
} as React.CSSProperties;;

const ConsoleComp: React.FC<ConsoleCompProps> = ({ minimize, changeMinimize, output, consolePanelRef }) => {

  useEffect(() => {
    if(consolePanelRef.current){
      consolePanelRef.current.collapse();
    }
  },[]);

  useEffect(() => {
    const el = document.getElementsByClassName("consolecomp")[0] as HTMLElement | undefined;
    if (el) {
      el.style.display = minimize ? "none" : "block";
    }
  }, [minimize]);

  return (
    // <div className="consolecomp">
    <Box className="consolecomp" sx={{ height: "100%", overflowY: "auto", overflowX: "auto", textAlign: "left", backgroundColor: "#116307ff" }}>
      <span className="console-nav">
        <Container>
          <IconButton
            aria-label="close"
            id="minimize-btn"
            onClick={() => changeMinimize(true)}
            color="error"
            style={{float: "right"}}
          >
            <CancelRoundedIcon />
          </IconButton>
        </Container>
      </span>

      <br />

      <div className="output-display">
        <h4 style={{marginLeft: "3vw", color: "white"}}>Logs :</h4>
        <div style={boxStyle}>
          {output.logs.map((log, key) => (
            <div key={key}>{log}</div>
          ))}
        </div>

        <br />
        <h4 style={{marginLeft: "3vw", color: "white"}}>Output :</h4>
        <div style={boxStyle}>
          {output.result !== "" ? output.result : <div style={{ display: "none" }} />}
          {output.error !== "" ? (
            <div style={{ color: "red" }}>Error : {output.error}</div>
          ) : (
            <div style={{ display: "none" }} />
          )}
        </div>
      </div>
    {/* </div> */}
    </Box>
  );
};

export default ConsoleComp;
