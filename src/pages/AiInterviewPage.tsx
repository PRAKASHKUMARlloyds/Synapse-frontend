import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useAudioToText from '../hooks/useAudioToText';
import { addAnswer } from '../redux/interviewSlice';
import { useSpeechSynthesizer } from '../hooks/useSpeechSynthesizer';
import { useRandomQuestions } from '../hooks/useRandomQuestions';

import reactQuestions from '../data/question_answer/react.json';
import jsQuestions from '../data/question_answer/js.json';
import nodejsQuestions from '../data/question_answer/nodejs.json';
import { evaluateInterview } from '../services/evaluate';
import CodeEditor from '../components/editorComponents/CodeEditor';
import { Button } from '@mui/material';

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
    "Hi! Good Morning. How are you today?",
    "Are you comfortable? Shall we begin shortly?"
  ];

  useEffect(() => {
    if (interviewComplete) {
      evaluateInterview();
    }
  }, [interviewComplete]);

  useEffect(() => {
    if (!started) return;

    if (phase === 'smalltalk') {
      if (currentIndex >= smallTalks.length) {
        // Done with smalltalk — move to interview phase
        setPhase('interview');
        setCurrentIndex(0);
        return;
      }

      const text = smallTalks[currentIndex];
      setQuestion(text);
      resetTranscript();

      speak(text, () => {
        console.log('[SmallTalk] TTS finished, start listening');
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
      setQuestion(q);
      resetTranscript();

      const text = typeof q === 'string' ? q : q.question;

      speak(text, () => {
        console.log('[Interview] TTS finished, start listening');
        startListening();
        resetSilentTimer();
      });
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
      console.log('No answer after 10 seconds. Moving to next question…');
      recordAnswerAndAdvance();
    }, 10000);
    setSilentTimer(timer);
  };

  const recordAnswerAndAdvance = () => {
    stopListening();

    if (question && transcript) {
      if (phase === 'smalltalk' && typeof question === 'string') {
        console.log('[SmallTalk] Answer:', transcript);
      } else if (phase === 'interview' && typeof question !== 'string') {
        dispatch(addAnswer({ question: question.question, answer: transcript }));
      }
    }

    setCurrentIndex((prev) => prev + 1);
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
      {/* <CodeEditor/> */}

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
            <div className="bg-white border p-3 rounded">
              <strong>Your Answer:</strong>
              <p>
                {transcript ||
                  (listening ? 'Listening…' : 'Start speaking to see text here.')}
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
}
