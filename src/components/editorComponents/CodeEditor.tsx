// import React, { useEffect } from "react";
// import Editor from "@monaco-editor/react";
// // import { SplitPane } from '@rexxars/react-split-pane';
// import SplitPane, { Pane } from 'react-split-pane-next';
// import { useState } from "react";
// import Button from "@mui/material/Button";
// import EditorNav from "./EditorNav";
// import ConsoleComp from "./Console";
// import './CSS/editor.css';

// interface Output {
//   logs: string[];
//   result: string;
//   error: string;
// }

// const CodeEditor: React.FC = () => {
//   const [editorFlag, setEditorFlag] = useState<boolean>(false);
//   const [editorBtnName, setEditorBtnName] = useState<string>("Open Code Editor");
//   const [codeValue, setCodeValue] = useState<string>("");
//   const [splitSize, setSplitSize] = useState<number>(window.innerWidth);
//   const [defLang, setDefLang] = useState<string>("javascript");
//   const [Technology, setTechnology] = useState<string>("javascript");
//   const [editorTheme, setEditorTheme] = useState<string>("vs-dark");
//   const [outputVal, setOutput] = useState<Output>({ logs: [], result: '', error: '' });
//   const [minimize, setMinimize] = useState<boolean>(true);

//   const openEditor = (): void => {
//     const editorContainer = document.getElementsByClassName("editor-container")[0] as HTMLElement;
//     if (editorFlag) {
//       editorContainer.style.display = 'none';
//       setEditorFlag(false);
//       setSplitSize((window.innerWidth >= 992) ? window.innerWidth : window.innerHeight);
//       setEditorBtnName("Open Code Editor");
//     } else {
//       editorContainer.style.display = 'block';
//       setEditorFlag(true);
//       setSplitSize((window.innerWidth >= 992) ? 0.5 * window.innerWidth : 0.3 * window.innerHeight);
//       setEditorBtnName("Close Code Editor");
//     }
//   };

//   const handleEditorChange = (value: string | undefined): void => {
//     setCodeValue(value ?? "");
//   };

//   const handleTechChange = (value: string): void => {
//     setTechnology(value);
//     setDefLang("javascript");
//   };

//   const handleThemeChange = (value: string): void => {
//     setEditorTheme(value);
//   };

//   const execute = (code: string): void => {
//     const logs: string[] = [];
//     const originalLog = console.log;

//     console.log = (...args: unknown[]) => {
//       logs.push(args.join(' '));
//     };

//     try {
//       const result = new Function(code)();
//       const error = "";
//       setOutput({ logs, result: String(result), error });
//     } catch (err: any) {
//       const error = err.message;
//       const result = "";
//       setOutput({ logs, result, error });
//     }

//     console.log = originalLog;
//     setMinimize(false);
//   };

//   // useEffect(() => {
//   //   const handleContextMenu = (e: MouseEvent): void => {
//   //     e.preventDefault();
//   //   };

//   //   const handleKeyDown = (e: KeyboardEvent): void => {
//   //     if (e.ctrlKey || e.altKey) {
//   //       e.preventDefault();
//   //     }
//   //   };

//   //   document.addEventListener('contextmenu', handleContextMenu);
//   //   document.addEventListener('keydown', handleKeyDown);

//   //   return () => {
//   //     document.removeEventListener('contextmenu', handleContextMenu);
//   //     document.removeEventListener('keydown', handleKeyDown);
//   //   };
//   // }, []);

//   return (
//     <div>
//       <nav></nav>
//       <div>
//         <SplitPane
//           split={window.innerWidth >= 992 ? "vertical" : "horizontal"}
//           defaultSize={splitSize}
//         >
//           <div className="question">
//             <Button
//               variant="contained"
//               id="editor-toggle-button"
//               color="success"
//               onClick={openEditor}
//             >
//               {editorBtnName}
//             </Button>
//           </div>
//           <div className="editor-container">
//             <EditorNav
//               code={codeValue}
//               tech={Technology}
//               changeTech={handleTechChange}
//               theme={editorTheme}
//               changeTheme={handleThemeChange}
//               execute={execute}
//             />
//             <SplitPane
//               split="horizontal"
//               defaultSize={minimize ? 0.94 * window.innerHeight : 0.65 * window.innerHeight}
//             >
//               <div style={{ height: minimize ? "94vh" : "65vh" }}>
//                 <Editor
//                   height="94vh"
//                   width="100vw"
//                   language={defLang}
//                   defaultValue="// Start coding here"
//                   theme={editorTheme}
//                   onChange={handleEditorChange}
//                   options={{
//                     minimap: { enabled: false },
//                     automaticLayout: true,
//                     contextmenu: false
//                   }}
//                 />
//               </div>
//               <ConsoleComp
//                 output={outputVal}
//                 minimize={minimize}
//                 changeMinimize={setMinimize}
//               />
//             </SplitPane>
//           </div>
//         </SplitPane>
//       </div>
//     </div>
//   );
// };

// export default CodeEditor;




import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Button, Box } from "@mui/material";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import type { ImperativePanelHandle } from "react-resizable-panels";

import EditorNav from "./EditorNav";
import ConsoleComp from "./Console";
import AiInterviewPage from "../../pages/AiInterviewPage";
import UserDashboard from "../../pages/UserDashboard";

interface Output {
  logs: string[];
  result: string;
  error: string;
}

const CodeEditor: React.FC = () => {
  const [editorFlag, setEditorFlag] = useState(false);
  const [editorBtnName, setEditorBtnName] = useState("Open Code Editor");
  const [codeValue, setCodeValue] = useState("");
  const [defLang, setDefLang] = useState("javascript");
  const [Technology, setTechnology] = useState("javascript");
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [outputVal, setOutput] = useState<Output>({
    logs: [],
    result: "",
    error: "",
  });
  const [minimize, setMinimize] = useState(true);
  const panelRef = useRef<ImperativePanelHandle>(null);
  const consolePanelRef = useRef<ImperativePanelHandle>(null);

  const openEditor = (): void => {
    setEditorFlag((prev) => {
      const next = !prev;
      setEditorBtnName(next ? "Close Code Editor" : "Open Code Editor");
      if(next){
        if(panelRef.current) panelRef.current.expand();
      }
      else{
        if(panelRef.current) panelRef.current.collapse();
      }
      return next;
    });
  };

  const handleEditorChange = (value: string | undefined): void => {
    setCodeValue(value ?? "");
  };

  const handleTechChange = (value: string): void => {
    setTechnology(value);
    setDefLang("javascript");
  };

  const handleThemeChange = (value: string): void => {
    setEditorTheme(value);
  };

  const execute = (code: string): void => {
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
    setMinimize(false);
  };

  useEffect(() => {
    if(panelRef.current){
      panelRef.current.collapse();
    }
  }, []);

  useEffect(() => {
    if(minimize){
      if(consolePanelRef.current) consolePanelRef.current.collapse();
    }
    else{
      if(consolePanelRef.current) consolePanelRef.current.expand();
    }
  }, [minimize]);
  

  return (
    <Box sx={{ height: "100vh", width: "calc(100vw - 120px)" }}>
      <PanelGroup
        direction={window.innerWidth >= 992 ? "horizontal" : "vertical"}
      >
        {/* Left/Top Panel - Question Area */}
        <Panel defaultSize={50}>
          <Box display="flex" width="100%">
          <Box
            sx={{
              width: editorFlag ? '60%' : '70%',
              transition: 'width 0.3s ease',
              overflow: 'auto',
            }}
          >
        <UserDashboard setCode={setCodeValue} />
      </Box>
          <Box sx={{ p: 2, flex: 1 }}>
            <Button
              variant="contained"
              color="success"
              onClick={openEditor}
              sx={{ float: "right", mb: 2 }}
            >
              {editorBtnName}
            </Button>
          </Box>
        </Box>
        </Panel>

        <PanelResizeHandle style={{ background: "#ccc", width: "6px" }} />

        {/* Right/Bottom Panel - Editor and Console */}
        <Panel defaultSize={50} ref={panelRef} collapsible={true} collapsedSize={0}>
          {editorFlag && (
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <EditorNav
                code={codeValue}
                tech={Technology}
                changeTech={handleTechChange}
                theme={editorTheme}
                changeTheme={handleThemeChange}
                execute={execute}
              />

              <PanelGroup direction="vertical">
                <Panel defaultSize={100}>
                  <Editor
                    height="100%"
                    width="100%"
                    language={defLang}
                    defaultValue="// Start coding here"
                    theme={editorTheme}
                    value={codeValue}
                    onChange={handleEditorChange}
                    options={{
                      minimap: { enabled: false },
                      automaticLayout: true,
                      contextmenu: false,
                    }}
                  />
                </Panel>

                <PanelResizeHandle style={{ background: "#ccc", height: "6px" }} />

                <Panel defaultSize={50} ref={consolePanelRef} collapsible={true} collapsedSize={0} style={{ height: "100%" }}>
                  <ConsoleComp
                    output={outputVal}
                    minimize={minimize}
                    changeMinimize={setMinimize}
                  />
                </Panel>
              </PanelGroup>
            </Box>
          )}
        </Panel>
      </PanelGroup>
    </Box>
  );
};

export default CodeEditor;
