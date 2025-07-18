import { useEffect } from "react";

export function VoiceSynthesizer({
  text,
  onEnd,
}: {
  text: string;
  onEnd?: () => void;
}) {
  useEffect(() => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);

    utter.onend = () => {
      console.log('Finished speaking');
      if (onEnd) onEnd();
    };

    synth.speak(utter);

    return () => {
      synth.cancel(); // cleanup if unmounted early
    };
  }, [text, onEnd]);

  return null; // no UI
}
