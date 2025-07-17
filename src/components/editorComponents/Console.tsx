import React from "react";
import { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Container, IconButton } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import "../CSS/console.css";

interface OutputType {
  logs: string[];
  result: string;
  error: string;
}

interface ConsoleCompProps {
  minimize: boolean;
  changeMinimize: (val: boolean) => void;
  output: OutputType;
}

const ConsoleComp: React.FC<ConsoleCompProps> = ({ minimize, changeMinimize, output }) => {
  useEffect(() => {
    const el = document.getElementsByClassName("consolecomp")[0] as HTMLElement | undefined;
    if (el) {
      el.style.display = minimize ? "none" : "block";
    }
  }, [minimize]);

  return (
    <div className="consolecomp">
      <span className="console-nav">
        <Container>
          <IconButton
            aria-label="close"
            id="minimize-btn"
            onClick={() => changeMinimize(true)}
            color="error"
          >
            <CloseIcon />
          </IconButton>
        </Container>
      </span>

      <br />

      <div className="output-display">
        <h4>Logs :</h4>
        {output.logs.map((log, key) => (
          <div key={key}>{log}</div>
        ))}

        <br />
        <h4>Output :</h4>
        <div>
          {output.result !== "" ? output.result : <div style={{ display: "none" }} />}
          {output.error !== "" ? (
            <div style={{ color: "red" }}>Error : {output.error}</div>
          ) : (
            <div style={{ display: "none" }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsoleComp;
