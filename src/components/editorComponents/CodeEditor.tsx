import React, { useState } from "react";
import { Box } from "@mui/material";
import Editor from "@monaco-editor/react";
import EditorNav from "./EditorNav";
import ConsoleComp from "./Console";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

interface Output {
  logs: string[];
  result: string;
  error: string;
}

interface CodeEditorProps {
  onSubmit: (code: string) => void;
}


const CodeEditor: React.FC<CodeEditorProps> = ({ onSubmit }) => {
  const [codeValue, setCodeValue] = useState("// Start coding here");
  const [tech, setTech] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [output, setOutput] = useState<Output>({ logs: [], result: "", error: "" });
  const [consoleVisible, setConsoleVisible] = useState(false);

  const handleCodeSubmit = () => {
    onSubmit(codeValue);
  };

  const handleEditorChange = (value: string | undefined) => {
    setCodeValue(value ?? "");
  };

  const handleTechChange = (value: string) => setTech(value);
  const handleThemeChange = (value: string) => setTheme(value);

  const execute = (code: string) => {
    const logs: string[] = [];
    const originalLog = console.log;

    console.log = (...args: unknown[]) => {
      logs.push(args.join(" "));
    };

    try {
      const result = new Function(code)();
      setOutput({ logs, result: String(result), error: "" });
    } catch (err: any) {
      setOutput({ logs, result: "", error: err.message });
    }

    console.log = originalLog;
    setConsoleVisible(true);
  };

  return (
    <Box sx={{ height: "70vh", width: "100%" }}>
      <PanelGroup direction="vertical" style={{ height: "100%" }}>
        <Panel defaultSize={80}>
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <EditorNav
              code={codeValue}
              tech={tech}
              theme={theme}
              changeTech={handleTechChange}
              changeTheme={handleThemeChange}
              execute={execute}
              onSubmit={handleCodeSubmit}
            />
            <Editor
              height="100%"
              language={tech}
              value={codeValue}
              onChange={handleEditorChange}
              theme={theme}
              options={{
                minimap: { enabled: false },
                automaticLayout: true,
                contextmenu: false,
              }}
            />
          </Box>
        </Panel>

        <PanelResizeHandle style={{ height: "6px", background: "#ccc", cursor: "row-resize" }} />

        <Panel defaultSize={20}>
          {consoleVisible && (
            <ConsoleComp
              output={output}
              minimize={!consoleVisible}
              changeMinimize={(val) => setConsoleVisible(!val)} consolePanelRef={null}            />
          )}
        </Panel>
      </PanelGroup>
    </Box>
  );
};

export default CodeEditor;
