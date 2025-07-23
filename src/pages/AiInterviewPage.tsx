import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addAnswer } from '../redux/interviewSlice';
import { evaluateInterview } from '../services/evaluate';
import useAudioToText from '../hooks/useAudioToText';
import { useSpeechSynthesizer } from '../hooks/useSpeechSynthesizer';
import { useRandomQuestions } from '../hooks/useRandomQuestions';

import reactQuestions from '../data/question_answer/react.json';
import jsQuestions from '../data/question_answer/js.json';
import nodejsQuestions from '../data/question_answer/nodejs.json';
import jsCodingQuestions from '../data/question_answer/js_coding.json';

type Question = {
  id?: number;
  question: string;
  category: string;
  difficulty?: string;
};

interface AiInterviewPageProps {
  submittedCode: string;
  onReadQuestion?: (text: string) => void;
  onStartInterview?: () => Promise<void>;
  loading?: boolean;
  imageReady?: boolean;
}

export const AiInterviewPage: React.FC<AiInterviewPageProps> = ({
  submittedCode,
  onReadQuestion,
  onStartInterview,
  loading,
  imageReady
}) => {
  const dispatch = useDispatch();
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<'smalltalk' | 'interview'>('smalltalk');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [question, setQuestion] = useState<Question | string>('');
  const [silentTimer, setSilentTimer] = useState<NodeJS.Timeout | null>(null);
  const [codingTimer, setCodingTimer] = useState<NodeJS.Timeout | null>(null);
  const [interviewComplete, setInterviewComplete] = useState(false);

  const { speak } = useSpeechSynthesizer();
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

  const interviewQuestions = [...randomQuestions, jsCodingQuestions.js_coding[0]];
  const smallTalks = [
    'Hi! Good Morning. How are you today?',
    'Are you comfortable? Shall we begin shortly?',
  ];

  useEffect(() => {
    if (interviewComplete) evaluateInterview();
  }, [interviewComplete]);

  useEffect(() => {
    if (
      started &&
      phase === 'interview' &&
      isCodingQuestion() &&
      submittedCode.trim()
    ) {
      recordCodingAnswer(submittedCode);
    }
  }, [submittedCode]);

  useEffect(() => {
    if (!started || !imageReady) return;

    const runInteraction = (text: string) => {
      resetTranscript();
      onReadQuestion?.(text); // Trigger lip-sync immediately
      setTimeout(() => {
        speak(text); // Trigger voice after 3 seconds
      }, 3000);
      startListening();
      isCodingQuestion() ? startCodingTimer() : resetSilentTimer();
    };

    if (phase === 'smalltalk') {
      if (currentIndex >= smallTalks.length) {
        setPhase('interview');
        setCurrentIndex(0);
        return;
      }
      const text = smallTalks[currentIndex];
      setQuestion(text);
      runInteraction(text); // <--- No delay, instant trigger
    }

    if (phase === 'interview') {
      if (currentIndex >= interviewQuestions.length) {
        setQuestion('');
        setInterviewComplete(true);
        return;
      }
      const q = interviewQuestions[currentIndex];
      const text = typeof q === 'string' ? q : q.question;
      setQuestion(q);
      runInteraction(text); // <--- No delay, instant trigger
    }
  }, [started, currentIndex, phase, imageReady]);

  useEffect(() => {
    if (listening && transcript) resetSilentTimer();
  }, [transcript]);

  const resetSilentTimer = () => {
    if (silentTimer) clearTimeout(silentTimer);
    setSilentTimer(setTimeout(() => recordAnswerAndAdvance(), 10000));
  };

  const startCodingTimer = () => {
    if (codingTimer) clearTimeout(codingTimer);
    setCodingTimer(
      setTimeout(() => {
        recordCodingAnswer(submittedCode || '');
      }, 60000)
    );
  };

  const recordAnswerAndAdvance = () => {
    stopListening();
    if (silentTimer) clearTimeout(silentTimer);

    if (phase === 'smalltalk' && typeof question === 'string') {
      console.log('[SmallTalk]', transcript);
    } else if (phase === 'interview' && typeof question !== 'string') {
      isCodingQuestion()
        ? recordCodingAnswer(submittedCode || '')
        : dispatch(addAnswer({ question: question.question, answer: transcript }));
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const recordCodingAnswer = (code: string) => {
    if (codingTimer) clearTimeout(codingTimer);
    const q = interviewQuestions[currentIndex];
    if (typeof q !== 'string' && code.trim()) {
      dispatch(addAnswer({ question: q.question, answer: code }));
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const isCodingQuestion = () => currentIndex === interviewQuestions.length - 1;

  if (!browserSupportsSpeechRecognition) {
    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography color="error">
            Your browser doesn’t support speech recognition.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={6}
      sx={{
        borderRadius: 4,
        background: 'linear-gradient(180deg, #f9fbfd 0%, #f1f5f9 100%)',
        p: 4,
        boxShadow: '0px 4px 16px rgba(0,0,0,0.05)',
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          🧠 AI Interview Assistant
        </Typography>

        {!started ? (
          <Button
            variant="contained"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : null
            }
            sx={{
              background: loading
                ? 'linear-gradient(to right, #999 30%, #ccc 90%)'
                : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: loading
                ? '0 3px 5px 2px rgba(180,180,180,0.3)'
                : '0 3px 5px 2px rgba(33,203,243,.3)',
              '&:hover': {
                background: loading
                  ? 'linear-gradient(to right, #aaa 30%, #ddd 90%)'
                  : 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
              },
            }}
            onClick={async () => {
              await onStartInterview?.();
              setStarted(true);
            }}
          >
            {loading ? 'Connecting...' : 'Start Interview'}
          </Button>
        ) : (
          <>
            {interviewComplete && (
              <Typography
                sx={{
                  mt: 3,
                  bgcolor: '#e6ffed',
                  color: '#22863a',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  border: '1px solid #c3e6cb',
                }}
              >
                ✅ Interview complete. Thank you!
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};