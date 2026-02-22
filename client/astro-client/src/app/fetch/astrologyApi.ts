import type { ChartRequest, NatalChart, PlanetPosition, HousePosition } from '../api/types';
import { Planet, ZodiacSign } from '../api/types';

const API_BASE = 'http://localhost:5180';

/** The .NET API serializes C# enums as strings. Convert them to numeric enum values. */
function normalizePlanet(v: unknown): Planet {
  if (typeof v === 'number') return v as Planet;
  return Planet[v as keyof typeof Planet];
}

function normalizeSign(v: unknown): ZodiacSign {
  if (typeof v === 'number') return v as ZodiacSign;
  return ZodiacSign[v as keyof typeof ZodiacSign];
}

function normalizePlanetPosition(p: PlanetPosition): PlanetPosition {
  return { ...p, planet: normalizePlanet(p.planet), sign: normalizeSign(p.sign) };
}

function normalizeHousePosition(h: HousePosition): HousePosition {
  return { ...h, sign: normalizeSign(h.sign) };
}

function normalizeChart(chart: NatalChart): NatalChart {
  return {
    ...chart,
    planets: chart.planets.map(normalizePlanetPosition),
    houses: chart.houses.map(normalizeHousePosition),
    ascendant: normalizeHousePosition(chart.ascendant),
    midHeaven: normalizeHousePosition(chart.midHeaven),
  };
}

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

  const raw = await response.json() as NatalChart;
  return normalizeChart(raw);
}
