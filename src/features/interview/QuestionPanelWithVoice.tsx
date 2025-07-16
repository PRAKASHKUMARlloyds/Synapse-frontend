import { QuestionPanel } from './QuestionPanel';
import { VoiceSynthesizer } from './VoiceSynthesizer';

export function QuestionWithVoice({ question }: { question: string }) {
  return (
    <div>
      <QuestionPanel question={question} />
      <VoiceSynthesizer text={question} />
    </div>
  );
}