import { GoogleGenerativeAI } from '@google/generative-ai';
// import fs from 'fs'; // Removed because 'fs' is not available in the browser

export const getOpenAIData = async (
  key: string,
  file: File,
  prompt: string
) => {
  const ai = new GoogleGenerativeAI(key);

  // Read file as base64 in the browser
  const fileData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get only the base64 string
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const contents = [
    {
      role: 'user',
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: file.type || 'application/pdf',
            data: fileData,
          },
        },
      ],
    },
  ];

  const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent({ contents });

  // Depending on the SDK version, the response structure may differ
  // Adjust the following line if needed
  if (result.response && typeof result.response.text === 'function') {
    const text = await result.response.text();
    console.log(text);
  } else {
    console.log('No text response found.');
  }
};
