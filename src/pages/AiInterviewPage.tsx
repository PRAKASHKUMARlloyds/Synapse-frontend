import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addAnswer, setCandidateEmail } from '../redux/interviewSlice';
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
  imageReady,
}) => {
  const dispatch = useDispatch();
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<'smalltalk' | 'interview'>('smalltalk');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [question, setQuestion] = useState<Question | string>('');
  const [silentTimer, setSilentTimer] = useState<NodeJS.Timeout | null>(null);
  const [codingTimer, setCodingTimer] = useState<NodeJS.Timeout | null>(null);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [showTranscription, setShowTranscription] = useState(true); // Default ON
  const [questionTranscription, setQuestionTranscriptionState] = useState('');

  const { speak } = useSpeechSynthesizer();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening,
  } = useAudioToText();

   const userEmail = useSelector((state: any) => state.authentiction.user?.email);

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
    if (interviewComplete){
       dispatch(setCandidateEmail(userEmail));
       evaluateInterview();
    }
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

    // When a new question is asked, update the question transcription
    const runInteraction = (text: string) => {
      // Trigger lipsync and transcription immediately
      setQuestionTranscriptionState(text);
      onReadQuestion?.(text);

      // Delay only the voice (speak) so lipsync and voice start together
      setTimeout(() => {
        speak(text, () => {
          resetTranscript();
          startListening();
          isCodingQuestion() ? startCodingTimer() : resetSilentTimer();
        });
      }, 1000); // Delay voice by 1 second (adjust as needed)
    };

    if (phase === 'smalltalk') {
      if (currentIndex >= smallTalks.length) {
        setPhase('interview');
        setCurrentIndex(0);
        return;
      }
      const text = smallTalks[currentIndex];
      setQuestion(text);
      runInteraction(text);
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
      runInteraction(text);
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
        maxWidth: 600,
        mx: 'auto',
      }}
    >
      <CardContent>
        {/* Centered Title */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            🧠 Experience the AI Interview
          </Typography>
        </Box>

        {/* Buttons row: left and right alignment, closer together */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2, // Add gap between buttons
            mb: 3,
            flexWrap: 'wrap',
          }}
        >
          {/* Start Interview Button */}
          <Button
            variant="contained"
            disabled={started || loading}
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
              minWidth: 160,
            }}
            onClick={async () => {
              await onStartInterview?.();
              setStarted(true);
            }}
          >
            {loading ? 'Connecting...' : 'Start Interview'}
          </Button>

          {/* Transcription Toggle or Coding Info Button */}
          {isCodingQuestion() && !interviewComplete ? (
            <Button
              variant="outlined"
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                minWidth: 160,
              }}
              disabled
            >
              Hide Answer Transcription
            </Button>
          ) : (
            <Button
              variant={showTranscription ? "outlined" : "contained"}
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                minWidth: 160,
              }}
              onClick={() => setShowTranscription((prev) => !prev)}
              disabled={interviewComplete}
            >
              {showTranscription ? 'Hide Transcription' : 'Show Transcription'}
            </Button>
          )}
        </Box>

        {/* Interview content */}
        {!started ? (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Click "Start Interview" to begin your AI-powered interview session.
          </Typography>
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

            {/* Show transcription only if interview is not complete and not coding question */}
            {showTranscription && !interviewComplete && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Question:
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {questionTranscription}
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  Your Answer:
                </Typography>
                {isCodingQuestion() ? (
                  <Typography variant="body2" color="warning.main">
                    Please open the code editor and submit your code answer.
                  </Typography>
                ) : (
                  <Typography variant="body2">
                    {transcript}
                  </Typography>
                )}
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};