import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import SplitPane from 'react-split-pane';
import Button from '@mui/material/Button';
import EditorNav from './EditorNav';
import ConsoleComp from './Console';
import './css/editor.css';

interface Output {
  logs: string[];
  result: string;
  error: string;
}

const CodeEditor: React.FC = () => {
  const [editorFlag, setEditorFlag] = useState<boolean>(false);
  const [editorBtnName, setEditorBtnName] = useState<string>('Open Code Editor');
  const [codeValue, setCodeValue] = useState<string>('');
  const [splitSize, setSplitSize] = useState<number>(window.innerWidth);
  const [Technology, setTechnology] = useState<string>('javascript');
  const [defLang, setDefLang] = useState<string>('javascript');
  const [editorTheme, setEditorTheme] = useState<string>('vs-dark');
  const [outputVal, setOutput] = useState<Output>({ logs: [], result: '', error: '' });
  const [minimize, setMinimize] = useState<boolean>(true);

  const openEditor = (): void => {
    const editorContainer = document.getElementsByClassName('editor-container')[0] as HTMLElement;
    if (editorFlag) {
      editorContainer.style.display = 'none';
      setEditorFlag(false);
      setSplitSize((window.innerWidth > 992) ? window.innerWidth : window.innerHeight);
      setEditorBtnName('Open Code Editor');
    } else {
      editorContainer.style.display = 'block';
      setEditorFlag(true);
      setSplitSize((window.innerWidth > 992) ? 0.5 * window.innerWidth : 0.8 * window.innerHeight);
      setEditorBtnName('Close Code Editor');
    }
  };

  const handleEditorChange = (value: string | undefined): void => {
    setCodeValue(value ?? '');
  };

  const handleTechChange = (value: string): void => {
    setTechnology(value);
    setDefLang('javascript');
  };

  const handleThemeChange = (value: string): void => {
    setEditorTheme(value);
  };

  const execute = (code: string): void => {
    const logs: string[] = [];
    const originalLog = console.log;

    console.log = (...args: unknown[]) => {
      logs.push(args.join(' '));
    };

    try {
      const result = new Function(code)();
      const error = '';
      setOutput({ logs, result: String(result), error });
    } catch (err: any) {
      const result = '';
      const error = err.message;
      setOutput({ logs, result, error });
    }

    console.log = originalLog;
    setMinimize(false);
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
    <div>
      <nav></nav>
      <div>
        <SplitPane
          split={(window.innerWidth >= 992) ? 'vertical' : 'horizontal'}
          defaultSize={splitSize}
        >
          <div className="question">
            <Button
              variant="contained"
              id="editor-toggle-button"
              color="success"
              onClick={openEditor}
            >
              {editorBtnName}
            </Button>

            <div className="editor-container">
              <EditorNav
                code={codeValue}
                tech={Technology}
                changeTech={handleTechChange}
                theme={editorTheme}
                changeTheme={handleThemeChange}
                execute={execute}
              />

              <SplitPane
                split="horizontal"
                defaultSize={minimize ? 0.94 * window.innerHeight : 0.65 * window.innerHeight}
              >
                <div style={{ height: '94vh', width: '100vw' }}>
                  <Editor
                    height="94vh"
                    width="100vw"
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
                </div>
                <ConsoleComp
                  output={outputVal}
                  minimize={minimize}
                  changeMinimize={setMinimize}
                />
              </SplitPane>
            </div>
          </div>
        </SplitPane>
      </div>
    </div>
  );
};

export default CodeEditor;
