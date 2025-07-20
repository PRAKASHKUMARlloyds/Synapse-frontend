import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useAudioToText from '../hooks/useAudioToText';
import { addAnswer } from '../redux/interviewSlice';
import { useSpeechSynthesizer } from '../hooks/useSpeechSynthesizer';

const questions = [
  "What is your greatest strength?",
  "Describe a challenge you've faced at work and how you overcame it.",
  "Where do you see yourself in five years?",
];

export default function AiInterviewPage() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [question, setQuestion] = useState('');
  const [silentTimer, setSilentTimer] = useState<NodeJS.Timeout | null>(null);

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

  // Uncomment if you want to log the logged-in user
  //  const loggedInUser = useSelector(
  //     (state: RootState) => state.authentiction
  //   );
  
  //   useEffect(() => {
  //   console.log('loggedInUser:', loggedInUser);
  //   }, [loggedInUser]);

  useEffect(() => {
    if (!started) return;

    if (currentIndex >= questions.length) {
      setQuestion("Interview complete. Thank you!");
      return;
    }

    const q = questions[currentIndex];
    setQuestion(q);
    resetTranscript();

    speak(q, () => {
      console.log('TTS finished, start listening');
      startListening();
      resetSilentTimer();
    });
  }, [started, currentIndex]);

  useEffect(() => {
    if (listening && transcript) {
      resetSilentTimer();
    }
  }, [transcript]);

  const resetSilentTimer = () => {
    if (silentTimer) clearTimeout(silentTimer);
    const timer = setTimeout(() => {
      console.log("No answer after 10 seconds. Moving to next question…");
      recordAnswerAndAdvance();
    }, 10000);
    setSilentTimer(timer);
  };

  const recordAnswerAndAdvance = () => {
    stopListening();
    if (question && transcript && question !== 'Interview complete. Thank you!') {
      dispatch(addAnswer({ question, answer: transcript }));
    }
    setCurrentIndex(prev => prev + 1);
  };

  if (!browserSupportsSpeechRecognition) {
    return <p className="text-red-600 p-4">Your browser doesn’t support speech recognition.</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">AI Interview Assistant</h1>


      {!started ? (
        <button
          onClick={() => setStarted(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Start Interview
        </button>
      ) : (
        <>
          <div className="bg-gray-100 p-4 rounded shadow">
            <strong>Question:</strong>
            <p>{question}</p>
          </div>

          {question && question !== 'Interview complete. Thank you!' && (
            <div className="bg-white border p-3 rounded">
              <strong>Your Answer:</strong>
              <p>
                {transcript || (listening ? 'Listening…' : 'Start speaking to see text here.')}
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
