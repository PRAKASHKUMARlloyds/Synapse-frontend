import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getCandidateResults() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/retrieve-results`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('[getEvaluations] Failed to fetch evaluations:', error);
    throw error;
  }
}
