import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAudioToText from '../hooks/useAudioToText';
import { addAnswer, setCandidateEmail } from '../redux/interviewSlice';
import { useSpeechSynthesizer } from '../hooks/useSpeechSynthesizer';
import { useRandomQuestions } from '../hooks/useRandomQuestions';

import reactQuestions from '../data/question_answer/react.json';
import jsQuestions from '../data/question_answer/js.json';
import nodejsQuestions from '../data/question_answer/nodejs.json';
import jsCodingQuestions from '../data/question_answer/js_coding.json';

import { evaluateInterview } from '../services/evaluate';
import { Button, Typography, Paper, Box } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';

type Question = {
  id?: number;
  question: string;
  answer?: string;
  category: string;
  difficulty?: string;
};

interface AiInterviewPageProps {
  submittedCode: string;
  align?: "center" | "left";
  onInterviewComplete?: () => void;
}

export const AiInterviewPage: React.FC<AiInterviewPageProps> = ({
  submittedCode,
  align,
  onInterviewComplete,
}) => {
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<'smalltalk' | 'interview'>('smalltalk');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [question, setQuestion] = useState<Question | string>('');
  const [silentTimer, setSilentTimer] = useState<NodeJS.Timeout | null>(null);
  const [codingTimer, setCodingTimer] = useState<NodeJS.Timeout | null>(null);
  const [interviewComplete, setInterviewComplete] = useState(false);

  const dispatch = useDispatch();
  const { speak } = useSpeechSynthesizer();
  const userEmail = useSelector((state: any) => state.authentiction.user?.email);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening,
  } = useAudioToText();

  const randomQuestions = useRandomQuestions(
    reactQuestions,
    jsQuestions,
    nodejsQuestions
  );

  const interviewQuestions = [
    ...randomQuestions,
    jsCodingQuestions.js_coding[0] // coding question at the end
  ];

  const smallTalks = [
    "Hi! Good Morning. How are you today?",
    "Are you comfortable? Shall we begin shortly?"
  ];

  useEffect(() => {
    if (interviewComplete) {
      dispatch(setCandidateEmail(userEmail));
      evaluateInterview();
      if (onInterviewComplete) onInterviewComplete();
    }
  }, [dispatch, interviewComplete, userEmail, onInterviewComplete]);

  useEffect(() => {
    if (
      started &&
      phase === 'interview' &&
      isCodingQuestion() &&
      submittedCode.trim()
    ) {
      console.log("Detected submitted code for coding question, dispatching.");
      recordCodingAnswer(submittedCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedCode]);

  useEffect(() => {
    if (!started) return;

    if (phase === 'smalltalk') {
      if (currentIndex >= smallTalks.length) {
        setPhase('interview');
        setCurrentIndex(0);
        return;
      }

      const text = smallTalks[currentIndex];
      setQuestion(text);
      resetTranscript();

      speak(text, () => {
        startListening();
        resetSilentTimer();
      });
    }

    if (phase === 'interview') {
      if (currentIndex >= interviewQuestions.length) {
        setQuestion('Interview complete. Thank you!');
        setInterviewComplete(true);
        return;
      }

      const q = interviewQuestions[currentIndex];
      const text = typeof q === 'string' ? q : q.question;

      setQuestion(q);
      resetTranscript();

      speak(text, () => {
        startListening();
        if (isCodingQuestion()) {
          startCodingTimer();
        } else {
          resetSilentTimer();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, currentIndex, phase]);

  useEffect(() => {
    if (listening && transcript) {
      resetSilentTimer();
    }
  }, [transcript]);

  const resetSilentTimer = () => {
    if (silentTimer) clearTimeout(silentTimer);
    const timer = setTimeout(() => {
      recordAnswerAndAdvance();
    }, 10000);
    setSilentTimer(timer);
  };

  const startCodingTimer = () => {
    if (codingTimer) clearTimeout(codingTimer);
    const timer = setTimeout(() => {
      console.log('1 minute passed. Submitting whatever code is present.');
      recordCodingAnswer(submittedCode || '');
    }, 60000);
    setCodingTimer(timer);
  };

  const isCodingQuestion = () => {
    return currentIndex === interviewQuestions.length - 1;
  };

  const recordAnswerAndAdvance = () => {
    stopListening();
    if (silentTimer) clearTimeout(silentTimer);

    if (phase === 'smalltalk' && typeof question === 'string') {
      console.log('[SmallTalk] Answer:', transcript);
    } else if (phase === 'interview' && typeof question !== 'string') {
      if (isCodingQuestion()) {
        recordCodingAnswer(submittedCode || '');
        return;
      } else {
        dispatch(addAnswer({ question: question.question, answer: transcript }));
      }
    }

    setCurrentIndex(prev => prev + 1);
  };

  const recordCodingAnswer = (code: string) => {
    if (codingTimer) clearTimeout(codingTimer);
    const q = interviewQuestions[currentIndex];
    if (typeof q !== 'string' && code.trim()) {
      dispatch(addAnswer({ question: q.question, answer: code }));
      setCurrentIndex(prev => prev + 1);
    }
  };


  // Mic button state
  const [micEnabled, setMicEnabled] = useState(false);

  // Mic button handler
  const handleMicClick = () => {
    if (!micEnabled) {
      setMicEnabled(true);
      startListening();
    } else {
      setMicEnabled(false);
      stopListening();
    }
  };
  // Accept an optional prop to control alignment (center or left)
  // You can pass this from UserDashboard based on editor state
  // Example: <AiInterviewPage submittedCode={submittedCode} align={isEditorOpen ? "left" : "center"} />
  const alignment = typeof align === "string" ? align : "center";

  if (!browserSupportsSpeechRecognition) {
    return (
      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center', color: 'error.main' }}>
        <Typography variant="h6">
          Your browser doesn’t support speech recognition.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box
      className="p-6"
      sx={{
        maxWidth: 480,
        mx: alignment === "center" ? "auto" : 0,
        ml: alignment === "left" ? 0 : "auto",
        mr: alignment === "left" ? "auto" : "auto",
        spaceY: 6,
        transition: "margin 0.3s",
      }}
    >
      {/* Header with mic button next to title */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#1976d2", fontSize: 32 }}>
            AI Interview Assistant
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 16 }}>
            Answer questions by speaking or coding. Click the mic to start/stop listening.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color={micEnabled ? "primary" : "inherit"}
          sx={{
            minWidth: 0,
            borderRadius: "50%",
            width: 56,
            height: 56,
            ml: 2,
            background: micEnabled ? "#e3f2fd" : "#f5f5f5",
            boxShadow: micEnabled ? "0 0 8px #2196F3" : "none",
            display: started ? "inline-flex" : "none"
          }}
          onClick={handleMicClick}
          disabled={!started}
        >
          {listening ? (
            <MicIcon sx={{ color: "#2196F3", fontSize: 32 }} />
          ) : (
            <MicOffIcon sx={{ color: "#757575", fontSize: 32 }} />
          )}
        </Button>
        {micEnabled && listening && (
          <GraphicEqIcon sx={{ color: "#2196F3", fontSize: 32, animation: "wave 1s infinite", ml: 1 }} />
        )}
        <style>
          {`
            @keyframes wave {
              0% { opacity: 0.5; transform: scaleY(1); }
              50% { opacity: 1; transform: scaleY(1.3); }
              100% { opacity: 0.5; transform: scaleY(1); }
            }
          `}
        </style>
      </Box>

      {!started ? (
        <Button
          variant="contained"
          sx={{
            mr: 2,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            color: "white",
            fontWeight: "bold",
            px: 3,
            py: 1,
            borderRadius: 2,
            boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)"
          }}
          onClick={() => setStarted(true)}
        >
          Start Interview
        </Button>
      ) : (
        <>
          {started && (
            <>
              {/* Compact question panel */}
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: '#f7fafc',
                  maxWidth: 520,
                  minWidth: 320,
                  mx: "auto",
                  maxHeight: 64,
                  minHeight: 44,
                  overflowY: 'auto',
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: 17, mr: 1 }}>
                  {phase === 'smalltalk' ? 'Small Talk:' : 'Question:'}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 16 }}>
                  {typeof question === 'string' ? question : question.question}
                </Typography>
              </Paper>

              {/* Compact answer panel */}
              {question !== 'Interview complete. Thank you!' && (
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    mb: 2,
                    maxWidth: 520,
                    minWidth: 380,
                    mx: "auto",
                    maxHeight: 80,
                    minHeight: 50,
                    overflowY: 'auto',
                    fontSize: 15,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: 15, mr: 1 }}>
                    Your Answer:
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: 15 }}>
                    {isCodingQuestion()
                      ? submittedCode || '(waiting for code submission)'
                      : transcript || (!listening ? 'Start speaking to see text here.' : 'Listening…')}
                  </Typography>
                </Paper>
              )}

              {/* Completion message */}
              {question === 'Interview complete. Thank you!' && (
                <Paper elevation={3} sx={{ p: 3, mt: 2, textAlign: 'center', bgcolor: '#e8f5e9', borderRadius: 2 }}>
                  <Typography variant="h6" color="success.main" fontWeight="bold">
                    🎉 Interview Complete!
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Thank you for participating. Your responses have been submitted.
                  </Typography>
                </Paper>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};
