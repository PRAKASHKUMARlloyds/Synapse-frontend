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
import { Button } from '@mui/material';

type Question = {
  id?: number;
  question: string;
  answer?: string;
  category: string;
  difficulty?: string;
};

interface AiInterviewPageProps {
  submittedCode: string;
}

export const AiInterviewPage: React.FC<AiInterviewPageProps> = ({ submittedCode }) => {
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
    }
  }, [dispatch, interviewComplete, userEmail]);

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

  if (!browserSupportsSpeechRecognition) {
    return (
      <p className="text-red-600 p-4">
        Your browser doesn’t support speech recognition.
      </p>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">AI Interview Assistant</h1>

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
          <div className="bg-gray-100 p-4 rounded shadow">
            <strong>
              {phase === 'smalltalk' ? 'Small Talk:' : 'Question:'}
            </strong>
            <p>{typeof question === 'string' ? question : question.question}</p>
          </div>

          {question !== 'Interview complete. Thank you!' && (
            <div className="bg-white border p-3 rounded space-y-2">
              <strong>Your Answer:</strong>
              <p>
                {isCodingQuestion()
                  ? submittedCode || '(waiting for code submission)'
                  : transcript || (listening ? 'Listening…' : 'Start speaking to see text here.')}
              </p>
              <p>
                <strong>Listening:</strong> {listening ? 'Yes' : 'No'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
