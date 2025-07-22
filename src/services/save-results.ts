import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Submit evaluation data to backend
 * 
 * @param data - The evaluation data (email, name, score, feedback)
 * @returns Promise with the server response
 */
export async function sendEvaluationToBackend(data: {
  email: string;
  name?: string;
  score: number;
  feedback: string;
  status: 'pass' | 'fail';
}) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/save-info`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('[sendEvaluationToBackend] Failed:', error);
    throw error;
  }
}