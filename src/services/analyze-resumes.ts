import { GoogleGenAI, createPartFromUri, type Part } from '@google/genai';

/** Matches your Gemini JSON schema */
export interface AnalysisDetail {
  name: string;
  proficiency: number;
  matchingSkills: string[];
  positiveStatements: string[];
  negativeStatements: string[];
}

export interface AnalysisResult {
  relevancy: number;
  technologies: AnalysisDetail[];
}

/** Our UI-friendly row type */
export interface ResumeResult {
  skills?: any;
  name: string;
  relevance: number;
  positives: string[];
  rating: number;
  details: AnalysisDetail[];
}

/** Helper: grab the first JSON block */
function extractJSON(raw: string): string {
  const match = raw.match(/[\[{][\s\S]*[\]}]/);
  return match ? match[0] : raw;
}

/** Analyze one resume with Gemini — now with retry + clamp */
async function analyzeOne(file: File, techStacks: string[]): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
  const ai = new GoogleGenAI({ apiKey });

  // Upload
  const blob = new Blob([file], { type: file.type || 'application/pdf' });
  const uploaded = await ai.files.upload({
    file: blob,
    config: { displayName: file.name },
  });

  if (!uploaded.name) throw new Error('Uploaded file does not have a valid name.');

  // Poll until ready
  let info = await ai.files.get({ name: uploaded.name });
  while (info.state === 'PROCESSING') {
    await new Promise((r) => setTimeout(r, 2000));
    info = await ai.files.get({ name: uploaded.name });
  }

  if (info.state === 'FAILED') throw new Error('Resume upload/processing failed.');

  // Build JSON-only prompt
  const prompt = `
You are a JSON-only generator. Never prepend or append any text—output raw JSON.

Analyze this resume for the following tech stacks: ${techStacks.join(', ')}.

1. Extract relevant experiences and list matching skills.
2. Rate proficiency for each tech from 1 to 10.
3. Compute an overall relevancy percentage (0–100).
4. For each tech, identify positive statements and negative statements.

Return exactly one JSON object with this schema, no backticks, no extra commentary:

{
  "relevancy": number,
  "technologies": [
    {
      "name": string,
      "proficiency": number,
      "matchingSkills": string[],
      "positiveStatements": string[],
      "negativeStatements": string[]
    }
  ]
}
`.trim();

  const contents: Part[] = [{ text: prompt }];
  if (info.uri && info.mimeType) {
    contents.push(createPartFromUri(info.uri, info.mimeType));
  }

  // ✅ Retry logic for 503/overload errors
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents,
      });

      const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      console.debug('Gemini raw:', text);

      const jsonText = extractJSON(text);
      return JSON.parse(jsonText) as AnalysisResult;
    } catch (error: any) {
      const isRetryable = error?.error?.code === 503 || error?.message?.includes('UNAVAILABLE');
      if (isRetryable && attempt < 3) {
        console.warn(`Gemini overloaded (attempt ${attempt}), retrying in 3s...`);
        await new Promise((r) => setTimeout(r, 3000));
      } else {
        console.error('❌ Gemini API Error:', error);
        throw new Error(`Gemini analysis failed: ${error.message || 'Unknown error'}`);
      }
    }
  }

  throw new Error('Max retries exceeded. Gemini model may be down.');
}

/** Analyze multiple resumes and reshape for table display */
export async function analyzeResumes(
  files: FileList,
  techStacks: string[]
): Promise<ResumeResult[]> {
  const out: ResumeResult[] = [];

  for (const file of Array.from(files)) {
    const { relevancy, technologies } = await analyzeOne(file, techStacks);

    const positives = technologies.flatMap((t) => t.positiveStatements);

    // ✅ Average proficiencies, clamp rating to max 10
    const avgProf = technologies.reduce((sum, t) => sum + t.proficiency, 0) / technologies.length;
    const rating = Math.min(Math.round(avgProf), 10); // Ensures no 14/10

    out.push({
      name: file.name,
      relevance: relevancy,
      positives,
      rating,
      details: technologies,
    });
  }

  return out;
}
