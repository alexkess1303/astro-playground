import type { ChartRequest, NatalChart } from '../api/types';

const API_BASE = 'http://localhost:5180';

export async function fetchNatalChart(request: ChartRequest): Promise<NatalChart> {
  const response = await fetch(`${API_BASE}/api/astrology/chart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Server error ${response.status}: ${text}`);
  }

  return response.json() as Promise<NatalChart>;
}
