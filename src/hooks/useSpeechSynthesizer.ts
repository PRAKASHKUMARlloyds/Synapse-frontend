import { useEffect } from 'react';

export function useSpeechSynthesizer() {
  const speak = (text: string, onEnd?: () => void) => {
    const synth = window.speechSynthesis;

    synth.cancel(); // clear queue & stop any ongoing speech

    const utter = new SpeechSynthesisUtterance(text);

    utter.onstart = () => {
      console.log('[TTS] Speaking:', text);
    };

    utter.onend = () => {
      console.log('[TTS] Finished speaking');
      onEnd?.();
    };

    utter.onerror = (err) => {
      console.error('[TTS] Error:', err);
      onEnd?.(); // still proceed to next step
    };

    const play = () => synth.speak(utter);

    if (synth.getVoices().length > 0) {
      play();
    } else {
      // fallback if voices are not yet loaded
      const handleVoicesChanged = () => {
        play();
        synth.removeEventListener('voiceschanged', handleVoicesChanged);
      };
      synth.addEventListener('voiceschanged', handleVoicesChanged);
    }
  };

  const cancel = () => {
    window.speechSynthesis.cancel();
  };

  useEffect(() => {
    return () => {
      cancel(); // cleanup on unmount
    };
  }, []);

  return { speak, cancel };
}
