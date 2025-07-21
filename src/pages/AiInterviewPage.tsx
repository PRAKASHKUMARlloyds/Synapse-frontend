import { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  Alert,
  Collapse,
  CircularProgress,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import useAudioToText from '../hooks/useAudioToText';
import { addAnswer } from '../redux/interviewSlice';
import { useSpeechSynthesizer } from '../hooks/useSpeechSynthesizer';
import { useRandomQuestions } from '../hooks/useRandomQuestions';

import reactQuestions from '../data/question_answer/react.json';
import jsQuestions from '../data/question_answer/js.json';
import nodejsQuestions from '../data/question_answer/nodejs.json';
import { evaluateInterview } from '../services/evaluate';

type Question = {
  id?: number;
  question: string;
  answer?: string;
  category: string;
  difficulty?: string;
};

export default function AiInterviewPage() {
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<'smalltalk' | 'interview'>('smalltalk');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [question, setQuestion] = useState<Question | string>('');
  const [silentTimer, setSilentTimer] = useState<NodeJS.Timeout | null>(null);
  const [interviewComplete, setInterviewComplete] = useState(false);

  const dispatch = useDispatch();
  const { speak } = useSpeechSynthesizer();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening,
  } = useAudioToText();

  const interviewQuestions = useRandomQuestions(
    reactQuestions,
    jsQuestions,
    nodejsQuestions
  );

  const smallTalks = [
    'Hi! Good Morning. How are you today?',
    'Are you comfortable? Shall we begin shortly?',
  ];

  useEffect(() => {
    if (interviewComplete) {
      evaluateInterview();
    }
  }, [interviewComplete]);

  useEffect(() => {
    if (!started) return;

    const startInteraction = (text: string) => {
      setQuestion(text);
      resetTranscript();
      speak(text, () => {
        startListening();
        resetSilentTimer();
      });
    };

    if (phase === 'smalltalk') {
      if (currentIndex >= smallTalks.length) {
        setPhase('interview');
        setCurrentIndex(0);
        return;
      }
      startInteraction(smallTalks[currentIndex]);
    }

    if (phase === 'interview') {
      if (currentIndex >= interviewQuestions.length) {
        stopListening();
        setInterviewComplete(true);
        setQuestion('');
        return;
      }
      const q = interviewQuestions[currentIndex];
      setQuestion(q);
      resetTranscript();
      startInteraction(typeof q === 'string' ? q : q.question);
    }
  }, [started, currentIndex, phase, interviewQuestions]);

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

  const recordAnswerAndAdvance = () => {
    stopListening();
    if (question && transcript) {
      if (phase === 'interview' && typeof question !== 'string') {
        dispatch(addAnswer({ question: question.question, answer: transcript }));
      }
    }
    setCurrentIndex((prev) => prev + 1);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        Your browser doesn’t support speech recognition.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" color="primary" gutterBottom>
        🎙️ AI Interview Assistant
      </Typography>

      {!started ? (
        <Box textAlign="center" mt={2}>
          <Button variant="contained" color="primary" onClick={() => setStarted(true)}>
            Start Interview
          </Button>
        </Box>
      ) : (
        <>
          {typeof question !== 'string' || question.trim() !== '' ? (
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {phase === 'smalltalk' ? '🗨️ Small Talk:' : '❓ Question:'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {typeof question === 'string' ? question : question.question}
              </Typography>
            </Paper>
          ) : null}

          {!interviewComplete && (
            <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Your Answer
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {transcript || (listening ? '🎧 Listening...' : 'Start speaking to answer')}
              </Typography>
              <Typography variant="caption">
                <strong>Listening:</strong> {listening ? 'Yes' : 'No'}
              </Typography>
            </Paper>
          )}

          {interviewComplete && (
            <Alert severity="success" sx={{ mt: 2 }}>
              ✅ Interview complete. Thank you!
            </Alert>
          )}
        </>
      )}
    </Box>
  );
}