import { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import ChatInterface from "./ChatInterface";
import { AiInterviewPage } from "./AiInterviewPage";
import CodeEditor from "../components/editorComponents/CodeEditor";

export default function UserDashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [submittedCode, setSubmittedCode] = useState("");
  const [interviewIsComplete, setInterviewIsComplete] = useState(false);

  const handleCodeSubmit = (code: string) => {
    setSubmittedCode(code);
  };

  const handleOpenChat = () => setIsChatOpen(true);
  const handleToggleEditor = () => setIsEditorOpen((prev) => !prev);

  // Callback for interview completion
  const handleInterviewComplete = () => setInterviewIsComplete(true);

  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "auto",
        bgcolor: "#f9f9f9",
        px: { xs: 1, md: 4 },
        py: 2,
      }}
    >
      <Container maxWidth="xl" sx={{ mt: 4, position: "relative", pb: 4 }}>
        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            minHeight: "70vh",
          }}
        >
          {/* Left side */}
          <Box
            sx={{
              flex: isEditorOpen ? 0.6 : 1,
              transition: "all 0.3s ease",
              overflow: "visible",
              bgcolor: "#fff",
              borderRadius: 2,
              boxShadow: 1,
              p: 2,
              position: "relative"
            }}
          >
            <Typography variant="h4" gutterBottom>
              Welcome to Your Interview Portal
            </Typography>
            {/* Place Open Code Editor button at top right */}
            {!isEditorOpen && (
              <Button
                variant="contained"
                color="success"
                onClick={handleToggleEditor}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  minWidth: 0,
                  p: 1.5,
                  borderRadius: "8px",
                  zIndex: 2,
                }}
              >
                Open Code Editor
              </Button>
            )}
            <Box sx={{ mt: 4 }}>
              <AiInterviewPage
                submittedCode={submittedCode}
                align={isEditorOpen ? "left" : "center"}
                onInterviewComplete={handleInterviewComplete}
              />
              {/* Show Open Chat button only after interview is complete and chat is not open */}
              {!isChatOpen && interviewIsComplete && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenChat}
                  sx={{ mt: 2 }}
                >
                  Open Chat
                </Button>
              )}
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
                bgcolor: "#fff",
                borderRadius: 2,
                boxShadow: 1,
                p: 2,
                position: "relative"
              }}
            >
              <Button
                onClick={handleToggleEditor}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  minWidth: 0,
                  p: 1,
                  borderRadius: "50%",
                  zIndex: 2,
                }}
                color="error"
              >
                <CloseIcon />
              </Button>
              <CodeEditor onSubmit={handleCodeSubmit}/>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
