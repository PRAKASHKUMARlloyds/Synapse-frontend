import axios from 'axios';
import type { RootState } from '../store';
import store from '../store';
import { setEvaluation } from '../redux/interviewSlice';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // or hardcode for testing
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

/**
 * Get the answers from the Redux store
 */
function getAnswersFromStore() {
  const state = store.getState() as RootState;
  return state.interview.answers || [];
}

function extractJSON(text: string): string {
  const cleaned = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    return match[0]; // just return the JSON string
  }
  throw new Error('No valid JSON found in response.');
}



/**
 * Format Q&A pairs into a single evaluation prompt
 */
function buildPrompt(answers: { question: string; answer: string }[]): string {
  const body = answers
    .map(
      (item, idx) =>
        `Q${idx + 1}: ${item.question}\nA${idx + 1}: ${item.answer}`
    )
    .join('\n\n');

  return `
Evaluate the following answers to an interview.

Instructions:
- Provide a total score out of 100.
- Give a brief feedback summary.
- Respond strictly in this JSON format:

{
  "score": number,
  "feedback": "string"
}

Here are the answers:
${body}
`;
}

/**
 * Send Q&A to Gemini and save result locally
 */
export async function evaluateInterview() {
  const answers = getAnswersFromStore();

  console.log('[Evaluate] Answers to evaluate:', answers);

  if (answers.length === 0) {
    console.warn('[Evaluate] No answers found in store.');
    return null;
  }

  const prompt = buildPrompt(answers);

  try {
    const res = await axios.post(
      `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const textResponse = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      console.error('[Evaluate] No valid response from Gemini');
      return null;
    }

    console.log('[Evaluate] Gemini response:', textResponse);

     const cleanJsonString = extractJSON(textResponse);

    const parsed = JSON.parse(cleanJsonString);

    const result = {
      ...parsed,
      status: parsed.score >= 80 ? 'pass' : 'fail'
    };

    localStorage.setItem('ai_interview_result', JSON.stringify(result));

    console.log('[Evaluation Result]', result);

    store.dispatch(setEvaluation(result));

    return result;
  } catch (err) {
    console.error('[Evaluate] Error during evaluation', err);
    return null;
  }
}
