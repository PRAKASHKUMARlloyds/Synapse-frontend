import { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  Fade,
  CircularProgress,
} from '@mui/material';
import ChatInterface from '../pages/ChatInterface';
import { AiInterviewPage } from './AiInterviewPage';
import CodeEditor from '../components/editorComponents/CodeEditor';
import { useStreamingClient } from '../components/streaming/useStreamingClient';

export default function UserDashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [submittedCode, setSubmittedCode] = useState('');
  const [pendingScriptText, setPendingScriptText] = useState('');
  const [questionReceivedAt, setQuestionReceivedAt] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isInterviewLoading, setIsInterviewLoading] = useState(false);

  const {
    streamVideoRef,
    connect,
    startTextStream,
    destroy,
    status,
    isStreamReady,
    streamEvent,
  } = useStreamingClient();

  const handleStartInterview = useCallback(async () => {
    setIsInterviewLoading(true);
    try {
      await connect();
    } finally {
      setIsInterviewLoading(false);
    }
  }, [connect]);

  const handleReadQuestion = useCallback(
    (questionText: string) => {
      setQuestionReceivedAt(Date.now());
      setIsSpeaking(true);

      if (isStreamReady) {
        startTextStream({
          type: 'text',
          input: questionText,
          provider: { type: 'microsoft', voice_id: 'en-US-AndrewNeural' },
          ssml: true,
        });
      } else {
        setPendingScriptText(questionText);
      }
    },
    [isStreamReady, startTextStream]
  );

  useEffect(() => {
    if (isStreamReady && pendingScriptText) {
      setIsSpeaking(true);
      startTextStream({
        type: 'text',
        input: pendingScriptText,
        provider: { type: 'microsoft', voice_id: 'en-US-AndrewNeural' },
        ssml: true,
      });
      setPendingScriptText('');
    }
  }, [isStreamReady, pendingScriptText]);

  useEffect(() => {
    if (streamEvent === 'done') {
      setTimeout(() => setIsSpeaking(false), 300);
    }
  }, [streamEvent]);

  useEffect(() => {
    const video = streamVideoRef.current;
    if (video?.srcObject) {
      video.play().catch((err) => {
        console.warn('🎥 Video play failed:', err.message);
      });
    }
  }, [status.streaming]);

  const handleCodeSubmit = (code: string) => {
    const responseTime = Date.now() - questionReceivedAt;
    console.log(`⏱️ Response Time: ${responseTime}ms`);
    setSubmittedCode(code);
  };

  return (
    <Box sx={{ height: '100vh', bgcolor: '#f2f6fc', overflowY: 'auto' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          🎯 AI Interview Interface
        </Typography>
        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            alignItems: 'flex-start',
          }}
        >
          <Paper
            elevation={4}
            sx={{
              width: 400,
              height: 400,
              flexShrink: 0,
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              background: '#000',
            }}
          >
            {
             !status.streaming && <img src="/alex_v2_idle_image.png"
              alt="Logo" 
              width={400} 
              height={400}  
               style={{
                borderRadius: 4,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}/>
            }       
            <video
              ref={streamVideoRef}
              width={400}
              height={400}
              autoPlay
              muted
              playsInline
              style={{
                borderRadius: 4,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Fade in={true}>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: 'rgba(255,255,255,0.8)',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" fontWeight={500} color="text.primary">
                  {isSpeaking ? '🗣️ Speaking...' : '🎙️ Listening...'}
                </Typography>
              </Box>
            </Fade>
          </Paper>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                color={isChatOpen ? 'error' : 'primary'}
                onClick={() => setIsChatOpen((prev) => !prev)}
                sx={{ fontWeight: 600, borderRadius: 2 }}
              >
                {isChatOpen ? 'Close Chat' : 'Open Chat'}
              </Button>
              <Button
                variant="contained"
                color={isEditorOpen ? 'error' : 'success'}
                onClick={() => setIsEditorOpen((prev) => !prev)}
                sx={{ fontWeight: 600, borderRadius: 2 }}
              >
                {isEditorOpen ? 'Close Editor' : 'Open Editor'}
              </Button>
            </Box>

            <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
              <AiInterviewPage
                submittedCode={submittedCode}
                onReadQuestion={handleReadQuestion}
                onStartInterview={handleStartInterview}
                loading={isInterviewLoading}
              />
              {isChatOpen && (
                <Box sx={{ mt: 3 }}>
                  <ChatInterface />
                </Box>
              )}
            </Paper>
          </Box>
        </Box>

        {isEditorOpen && (
          <Box
            sx={{
              mt: 4,
              borderRadius: 3,
              bgcolor: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: '0.3s ease',
            }}
          >
            <CodeEditor onSubmit={handleCodeSubmit} />
          </Box>
        )}
      </Container>
    </Box>
  );
}