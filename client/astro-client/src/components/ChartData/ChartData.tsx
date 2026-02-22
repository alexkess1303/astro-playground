import type { NatalChart, PlanetPosition } from '../../app/api/types';
import type { ChartRequest } from '../../app/api/types';
import { PLANET_NAMES, ZODIAC_NAMES } from '../../app/utils/zodiacGlyphs';
import { Planet, ZodiacSign } from '../../app/api/types';
// Helper to map string to enum value
function planetStringToEnum(str: string): Planet | undefined {
  return (Object.entries(Planet).find(([k, v]) => v === str) ?? [])[1] as Planet | undefined;
}

function signStringToEnum(str: string): ZodiacSign | undefined {
  return (Object.entries(ZodiacSign).find(([k, v]) => v === str) ?? [])[1] as ZodiacSign | undefined;
}
import {
  getElementCounts,
  getModalityCounts,
  getPolarityCounts,
  type Element,
  type Modality,
} from '../../app/utils/astroStats';
import styles from './ChartData.module.scss';

interface ChartDataProps {
  chart: NatalChart;
  birthData: ChartRequest;
}

/** Format position as "9Can59" or "9Can59R" */
function formatPosition(p: PlanetPosition): string {
  const sign = ZODIAC_NAMES[p.sign];
  const deg = String(p.degreeInSign).padStart(1, '');
  const min = String(p.minute).padStart(2, '0');
  return `${deg}${sign}${min}${p.isRetrograde ? 'R' : ''}`;
}

/** Format date as "Mon. Mar 13, 1972" */
function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Format coordinates as "50°27'N 30°31'E" */
function formatCoords(lat: number, lon: number): string {
  const latD = Math.floor(Math.abs(lat));
  const latM = Math.round((Math.abs(lat) - latD) * 60);
  const lonD = Math.floor(Math.abs(lon));
  const lonM = Math.round((Math.abs(lon) - lonD) * 60);
  return `${latD}°${String(latM).padStart(2, '0')}${lat >= 0 ? 'N' : 'S'} ${lonD}°${String(lonM).padStart(2, '0')}${lon >= 0 ? 'E' : 'W'}`;
}

const ELEMENTS: Element[] = ['Fire', 'Earth', 'Air', 'Water'];
const MODALITIES: Modality[] = ['Cardinal', 'Fixed', 'Mutable'];

export default function ChartData({ chart, birthData }: ChartDataProps) {
  const elCounts  = getElementCounts(chart.planets, chart.ascendant, chart.midHeaven);
  const modCounts = getModalityCounts(chart.planets, chart.ascendant, chart.midHeaven);
  const polCounts = getPolarityCounts(chart.planets);

  console.log('chart.planets:', chart.planets);

  return (
    <div className={styles.panel}>
      {/* ── Birth info header ──────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerLine}>{birthData.placeOfBirth}</div>
        <div className={styles.headerLine}>{formatDate(birthData.dateOfBirth)}</div>
        <div className={styles.headerLine}>
          {birthData.timeOfBirth.slice(0, 5)}
          {birthData.utcOffsetHours >= 0 ? ` (+${birthData.utcOffsetHours}:00 GMT)` : ` (${birthData.utcOffsetHours}:00 GMT)`}
        </div>
        <div className={styles.headerLine}>{formatCoords(birthData.latitude, birthData.longitude)}</div>
      </div>

      {/* ── Natal Planets ──────────────────────────────── */}
      <div className={styles.sectionTitle}>Natal Planets</div>
      <table className={styles.planetsTable}>
        <tbody>
          {chart.planets.map((p) => {
            // Convert string planet/sign to enum value for lookup
            const planetEnum = typeof p.planet === 'string' ? Planet[p.planet as keyof typeof Planet] : p.planet;
            const signEnum = typeof p.sign === 'string' ? ZodiacSign[p.sign as keyof typeof ZodiacSign] : p.sign;
            return (
              <tr key={p.planet} className={p.isRetrograde ? styles.retroRow : ''}>
                <td className={styles.planetName}>
                  {p.planet}
                </td>
                <td className={styles.planetPos}>{formatPosition({ ...p, sign: signEnum })}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Statistics ─────────────────────────────────── */}
      <div className={styles.sectionTitle}>Statistics</div>

      <table className={styles.statsTable}>
        <tbody>
          {ELEMENTS.map((el) => {
            const notes: string[] = [];
            if (elCounts.ascElement === el) notes.push('ASC');
            if (elCounts.mcElement === el)  notes.push('MC');
            return (
              <tr key={el}>
                <td className={styles.statLabel}>{el}</td>
                <td className={styles.statCount}>{elCounts[el]}</td>
                <td className={styles.statNote}>{notes.join(' ')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <table className={styles.statsTable}>
        <tbody>
          {MODALITIES.map((mod) => {
            const notes: string[] = [];
            if (modCounts.ascModality === mod) notes.push('ASC');
            if (modCounts.mcModality === mod)  notes.push('MC');
            return (
              <tr key={mod}>
                <td className={styles.statLabel}>{mod}</td>
                <td className={styles.statCount}>{modCounts[mod]}</td>
                <td className={styles.statNote}>{notes.join(' ')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <table className={styles.statsTable}>
        <tbody>
          <tr>
            <td className={styles.statLabel}>Positive</td>
            <td className={styles.statCount}>{polCounts.Positive}</td>
            <td className={styles.statNote}></td>
          </tr>
          <tr>
            <td className={styles.statLabel}>Negative</td>
            <td className={styles.statCount}>{polCounts.Negative}</td>
            <td className={styles.statNote}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
