import axios from 'axios';
import userCredentials from '../data/user-credentials.json';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getCandidateResults() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/retrieve-results`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const results = response.data;

    // build a map of email → name for quick lookup
    const emailToNameMap = new Map<string, string>();
    for (const user of userCredentials.users) {
      emailToNameMap.set(user.email, user.name);
    }

    // augment each result with `name`
    const enrichedResults = results.map((entry: any) => ({
      ...entry,
      name: emailToNameMap.get(entry.email) || 'Unknown',
    }));

    return enrichedResults;
  } catch (error) {
    console.error('[getCandidateResults] Failed to fetch evaluations:', error);
    throw error;
  }
}
