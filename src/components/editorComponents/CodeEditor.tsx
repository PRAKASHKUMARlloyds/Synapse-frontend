import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import Editor from "@monaco-editor/react";
import EditorNav from "./EditorNav";
import ConsoleComp from "./Console";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import type{ImperativePanelHandle} from "react-resizable-panels";

interface Output {
  logs: string[];
  result: string;
  error: string;
}

interface CodeEditorProps {
  onSubmit: (code: string) => void;
}


const CodeEditor: React.FC<CodeEditorProps> = ({ onSubmit }) => {
  // Made a change
  const [codeValue, setCodeValue] = useState("// Start coding here");
  const [tech, setTech] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [output, setOutput] = useState<Output>({ logs: [], result: "", error: "" });
  const [consoleVisible, setConsoleVisible] = useState(false);

  const consolePanelRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    if(consolePanelRef.current){
      if(consoleVisible){
        consolePanelRef.current.expand();
      }
      else{
        consolePanelRef.current.collapse();
      }
    }
  }, [consoleVisible]);

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

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent): void => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.ctrlKey || e.altKey) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

        <Panel defaultSize={20} ref={consolePanelRef} collapsible={true} collapsedSize={0}>
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
