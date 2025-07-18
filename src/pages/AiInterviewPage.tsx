import { useEffect, useState } from 'react';
import { VoiceSynthesizer } from '../features/interview/VoiceSynthesizer';
import useAudioToText from '../hooks/useAudioToText';

const questions = [
  "What is your greatest strength?",
  "Describe a challenge you've faced at work and how you overcame it.",
  "Where do you see yourself in five years?",
  "Why should we hire you?",
  "Tell me about a time you worked in a team."
];

export default function AiInterviewPage() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [question, setQuestion] = useState('');
  const [silentTimer, setSilentTimer] = useState<NodeJS.Timeout | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening,
  } = useAudioToText();

  useEffect(() => {
    if (started) {
      loadQuestion(currentIndex);
    }
    return () => {
      if (silentTimer) clearTimeout(silentTimer);
    };
  }, [started, currentIndex]);

  const loadQuestion = (index: number) => {
    if (index < questions.length) {
      setQuestion(questions[index]);
      resetTranscript(); 
      setIsSpeaking(true); // tell app we’re speaking now
    } else {
      setQuestion('Interview complete. Thank you!');
      stopListening();
    }
  };

  const resetSilentTimer = () => {
    if (silentTimer) clearTimeout(silentTimer);
    const timer = setTimeout(() => {
      console.log('No answer after 10 seconds. Moving to next question...');
      nextQuestion();
    }, 10000);
    setSilentTimer(timer);
  };

  useEffect(() => {
    if (listening && transcript) {
      resetSilentTimer(); 
    }
  }, [transcript]);

  const nextQuestion = () => {
    stopListening(); // stop mic before next question
    setCurrentIndex((prev) => prev + 1);
  };

  if (!browserSupportsSpeechRecognition) {
    return <p className="text-red-600 p-4">Your browser doesn’t support speech recognition.</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">AI Interview Assistant</h1>

      {!started ? (
        <button
          onClick={() => {
            setStarted(true);
          }}
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

          {isSpeaking && (
            <VoiceSynthesizer
              text={question}
              onEnd={() => {
                console.log("TTS done, start listening");
                setIsSpeaking(false);
                startListening();
                resetSilentTimer();
              }}
            />
          )}

          {question && question !== 'Interview complete. Thank you!' && (
            <div className="bg-white border p-3 rounded">
              <strong>Your Answer:</strong>
              <p>{transcript || (isSpeaking ? 'Listening will start shortly...' : 'Start speaking to see text here.')}</p>
              <p><strong>Listening:</strong> {listening ? 'Yes' : 'No'}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
