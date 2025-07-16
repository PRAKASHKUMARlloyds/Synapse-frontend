import { useEffect } from "react";

export function VoiceSynthesizer({ text }: { text: string }) {
  useEffect(() => {
    const synth = window.speechSynthesis;
    synth.cancel(); // Stop any ongoing speech

    if (text) {
      const utter = new SpeechSynthesisUtterance(text);
      synth.speak(utter);
    }

    // Optional: cleanup to cancel speech when component unmounts
    return () => {
      synth.cancel();
    };
  }, [text]);

  return null;
}