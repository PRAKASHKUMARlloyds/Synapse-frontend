import { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
} from "@mui/material";

import ChatInterface from "./ChatInterface";
import { AiInterviewPage } from "./AiInterviewPage";
import CodeEditor from "../components/editorComponents/CodeEditor";

export default function UserDashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [submittedCode, setSubmittedCode] = useState("");

   const handleCodeSubmit = (code: string) => {
    console.log("Submitted Code:", code);
    setSubmittedCode(code);
  };

  const handleOpenChat = () => setIsChatOpen(true);
  const handleToggleEditor = () => setIsEditorOpen((prev) => !prev);

  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "auto", // 👈 enable scrolling
        bgcolor: "#f9f9f9",
      }}
    >
      <Container maxWidth="xl" sx={{ mt: 4, position: "relative", pb: 4 }}>
        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            minHeight: "70vh",
          }}
        >
          {/* Left side */}
          <Box
            sx={{
              flex: isEditorOpen ? 0.6 : 1,
              transition: "all 0.3s ease",
              overflow: "visible", // let content grow
            }}
          >
            <Typography variant="h4" gutterBottom>
              User Dashboard
            </Typography>

            <Box sx={{ mt: 2, position: "relative", minHeight: "50px" }}>
              {!isChatOpen && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenChat}
                  sx={{ mr: 2 }}
                >
                  Open Chat
                </Button>
              )}

              {/* Editor toggle */}
              <Box sx={{ position: "absolute", top: 0, right: 0, zIndex: 10 }}>
                <Button
                  variant="contained"
                  color={isEditorOpen ? "error" : "success"}
                  onClick={handleToggleEditor}
                >
                  {isEditorOpen ? "Close" : "Open Code Editor"}
                </Button>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <AiInterviewPage submittedCode={submittedCode} />
              {isChatOpen && <ChatInterface />}
            </Box>
          </Box>

          {/* Right side: Editor */}
          {isEditorOpen && (
            <Box
              sx={{
                flex: 0.4,
                minWidth: { xs: "100%", md: "40%" },
                transition: "all 0.3s ease",
                overflow: "auto",
              }}
            >
              <CodeEditor onSubmit={handleCodeSubmit}/>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
