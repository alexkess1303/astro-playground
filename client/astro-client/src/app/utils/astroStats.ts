import { ZodiacSign, Planet } from '../api/types';
import type { PlanetPosition, HousePosition } from '../api/types';

// ── Element mapping ──────────────────────────────────────────────────────────
export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';

export const SIGN_ELEMENT: Record<ZodiacSign, Element> = {
  [ZodiacSign.Aries]: 'Fire',
  [ZodiacSign.Taurus]: 'Earth',
  [ZodiacSign.Gemini]: 'Air',
  [ZodiacSign.Cancer]: 'Water',
  [ZodiacSign.Leo]: 'Fire',
  [ZodiacSign.Virgo]: 'Earth',
  [ZodiacSign.Libra]: 'Air',
  [ZodiacSign.Scorpio]: 'Water',
  [ZodiacSign.Sagittarius]: 'Fire',
  [ZodiacSign.Capricorn]: 'Earth',
  [ZodiacSign.Aquarius]: 'Air',
  [ZodiacSign.Pisces]: 'Water',
};

// ── Modality mapping ─────────────────────────────────────────────────────────
export type Modality = 'Cardinal' | 'Fixed' | 'Mutable';

export const SIGN_MODALITY: Record<ZodiacSign, Modality> = {
  [ZodiacSign.Aries]: 'Cardinal',
  [ZodiacSign.Taurus]: 'Fixed',
  [ZodiacSign.Gemini]: 'Mutable',
  [ZodiacSign.Cancer]: 'Cardinal',
  [ZodiacSign.Leo]: 'Fixed',
  [ZodiacSign.Virgo]: 'Mutable',
  [ZodiacSign.Libra]: 'Cardinal',
  [ZodiacSign.Scorpio]: 'Fixed',
  [ZodiacSign.Sagittarius]: 'Mutable',
  [ZodiacSign.Capricorn]: 'Cardinal',
  [ZodiacSign.Aquarius]: 'Fixed',
  [ZodiacSign.Pisces]: 'Mutable',
};

// ── Polarity mapping ─────────────────────────────────────────────────────────
export type Polarity = 'Positive' | 'Negative';

export const SIGN_POLARITY: Record<ZodiacSign, Polarity> = {
  [ZodiacSign.Aries]: 'Positive',
  [ZodiacSign.Taurus]: 'Negative',
  [ZodiacSign.Gemini]: 'Positive',
  [ZodiacSign.Cancer]: 'Negative',
  [ZodiacSign.Leo]: 'Positive',
  [ZodiacSign.Virgo]: 'Negative',
  [ZodiacSign.Libra]: 'Positive',
  [ZodiacSign.Scorpio]: 'Negative',
  [ZodiacSign.Sagittarius]: 'Positive',
  [ZodiacSign.Capricorn]: 'Negative',
  [ZodiacSign.Aquarius]: 'Positive',
  [ZodiacSign.Pisces]: 'Negative',
};

// ── Stats result types ───────────────────────────────────────────────────────
export interface ElementCounts {
  Fire: number;
  Earth: number;
  Air: number;
  Water: number;
  ascElement: Element;
  mcElement: Element;
}

export interface ModalityCounts {
  Cardinal: number;
  Fixed: number;
  Mutable: number;
  ascModality: Modality;
  mcModality: Modality;
}

export interface PolarityCounts {
  Positive: number;
  Negative: number;
}

export function getElementCounts(
  planets: PlanetPosition[],
  ascendant: HousePosition,
  midHeaven: HousePosition,
): ElementCounts {
  const counts: ElementCounts = {
    Fire: 0, Earth: 0, Air: 0, Water: 0,
    ascElement: SIGN_ELEMENT[ascendant.sign],
    mcElement: SIGN_ELEMENT[midHeaven.sign],
  };
  for (const p of planets) {
    counts[SIGN_ELEMENT[p.sign]]++;
  }
  return counts;
}

export function getModalityCounts(
  planets: PlanetPosition[],
  ascendant: HousePosition,
  midHeaven: HousePosition,
): ModalityCounts {
  const counts: ModalityCounts = {
    Cardinal: 0, Fixed: 0, Mutable: 0,
    ascModality: SIGN_MODALITY[ascendant.sign],
    mcModality: SIGN_MODALITY[midHeaven.sign],
  };
  for (const p of planets) {
    counts[SIGN_MODALITY[p.sign]]++;
  }
  return counts;
}

export function getPolarityCounts(planets: PlanetPosition[]): PolarityCounts {
  const counts: PolarityCounts = { Positive: 0, Negative: 0 };
  for (const p of planets) {
    counts[SIGN_POLARITY[p.sign]]++;
  }
  return counts;
}

// ── Aspects ──────────────────────────────────────────────────────────────────
export type AspectType =
  | 'Conjunction'
  | 'Opposition'
  | 'Trine'
  | 'Square'
  | 'Sextile';

export interface Aspect {
  planet1: Planet;
  planet2: Planet;
  type: AspectType;
  angle: number;
}

const ASPECT_DEFS: { type: AspectType; angle: number; orb: number }[] = [
  { type: 'Conjunction', angle: 0,   orb: 8 },
  { type: 'Opposition',  angle: 180, orb: 8 },
  { type: 'Trine',       angle: 120, orb: 8 },
  { type: 'Square',      angle: 90,  orb: 6 },
  { type: 'Sextile',     angle: 60,  orb: 6 },
];

export function getAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];
  for (let i = 0; i < planets.length; i++) {
    // Skip if planet is NorthNode
    if (planets[i].planet === Planet.NorthNode) continue;
    for (let j = i + 1; j < planets.length; j++) {
      if (planets[j].planet === Planet.NorthNode) continue;
      const diff = Math.abs(planets[i].absoluteDegree - planets[j].absoluteDegree);
      const angle = diff > 180 ? 360 - diff : diff;
      for (const def of ASPECT_DEFS) {
        if (Math.abs(angle - def.angle) <= def.orb) {
          aspects.push({
            planet1: planets[i].planet,
            planet2: planets[j].planet,
            type: def.type,
            angle,
          });
          break;
        }
      }
    }
  }
  return aspects;
}
