import { GoogleGenAI, createPartFromUri } from '@google/genai';

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
  skills: any;
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

/** Local alias for whatever createPartFromUri actually returns */
type FilePart = ReturnType<typeof createPartFromUri>;

/** Analyze one resume with Gemini */
async function analyzeOne(file: File, techStacks: string[]): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  // upload
  const blob = new Blob([file], { type: file.type || 'application/pdf' });
  const uploaded = await ai.files.upload({
    file: blob,
    config: { displayName: file.name },
  });

  // poll until ready
  let info = await ai.files.get({ name: uploaded.name });
  while (info.state === 'PROCESSING') {
    await new Promise((r) => setTimeout(r, 2000));
    info = await ai.files.get({ name: uploaded.name });
  }

  if (info.state === 'FAILED') {
    throw new Error('Resume upload/processing failed');
  }

  // build strict JSON-only prompt
  const prompt = `
You are a JSON-only generator. Never prepend or append any text—output raw JSON.

Analyze this resume for the following tech stacks: ${techStacks.join(', ')}.

1. Extract relevant experiences and list matching skills.
2. Rate proficiency for each tech from 1 to 5.
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
      "negativeStatements": string[],
    },
    ...
  ]
}
  `.trim();

  // assemble payload
  const contents: Array<string | FilePart> = [prompt];
  if (info.uri && info.mimeType) {
    contents.push(createPartFromUri(info.uri, info.mimeType));
  }

  // call Gemini
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents,
  });
  console.debug('Gemini raw:', response.text);

  // extract & parse
  const jsonText = extractJSON(response.text);
  try {
    return JSON.parse(jsonText) as AnalysisResult;
  } catch (err) {
    console.error('❌ Invalid JSON; got:', jsonText);
    throw new Error(`AI returned invalid JSON:\n${response.text}`);
  }
}

/** Public API: analyze many files + reshape for our table */
export async function analyzeResumes(
  files: FileList,
  techStacks: string[]
): Promise<ResumeResult[]> {
  const out: ResumeResult[] = [];

  for (const file of Array.from(files)) {
    const { relevancy, technologies } = await analyzeOne(file, techStacks);

    // flatten positives
    const positives = technologies.flatMap((t) => t.positiveStatements);

    // average 1–5 → scale to 0–10
    const avgProf = technologies.reduce((sum, t) => sum + t.proficiency, 0) / technologies.length;
    const rating = Math.round((avgProf / 5) * 10);

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
