import type { NatalChart } from '../../app/api/types';
import {
  ZODIAC_GLYPHS,
  ZODIAC_ELEMENT_COLORS,
  PLANET_GLYPHS,
} from '../../app/utils/zodiacGlyphs';
import { getAspects, type AspectType } from '../../app/utils/astroStats';
import { ZodiacSign } from '../../app/api/types';
import styles from './Chart.module.scss';

interface ChartProps {
  chart: NatalChart;
}

// SVG geometry constants
const CX = 300;
const CY = 300;
const R_OUTER = 270;   // outer edge of zodiac ring
const R_ZODIAC = 240;  // inner edge of zodiac ring / outer edge of house ring
const R_HOUSE = 210;   // inner edge of house ring
const R_PLANET = 185;  // planet glyph radius
const R_ASPECT = 160;  // aspect lines radius
const R_CENTER = 60;   // inner circle

/** Convert ecliptic degrees to SVG angle.
 *  0° Aries is at the 9 o'clock position (left), clockwise → counter-clockwise in SVG.
 *  ASC is on the left. We rotate so that the Ascendant degree falls at 180° SVG angle (left = 9 o'clock).
 *  SVG 0° is at 3 o'clock; we offset so that 0 ecliptic = 3 o'clock when ASC=0.
 *  ascDegree shifts the wheel: ascendant lands at SVG 180°.
 */
function eclipticToSvgAngle(ecl: number, ascDegree: number): number {
  // Rotate so ASC is on the left (180°)
  const rotated = ecl - ascDegree + 180;
  // Invert because SVG Y grows downward (ecliptic is counter-clockwise but SVG arc is CW)
  return (360 - rotated) % 360;
}

function polarToXY(angleDeg: number, r: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CX + r * Math.cos(rad),
    y: CY + r * Math.sin(rad),
  };
}

function describeArc(startAngle: number, endAngle: number, r: number) {
  const s = polarToXY(startAngle, r);
  const e = polarToXY(endAngle, r);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
}

const ASPECT_COLORS: Record<AspectType, string> = {
  Conjunction: '#555',
  Opposition:  '#cc2222',
  Square:      '#cc2222',
  Trine:       '#2255cc',
  Sextile:     '#2255cc',
};

const ASPECT_DASH: Record<AspectType, string> = {
  Conjunction: '4 3',
  Opposition:  'none',
  Square:      'none',
  Trine:       'none',
  Sextile:     '5 3',
};

export default function Chart({ chart }: ChartProps) {
  const ascDeg = chart.ascendant.absoluteDegree;
  const mcDeg = chart.midHeaven.absoluteDegree;
  const aspects = getAspects(chart.planets);

  // Build zodiac segments ordered by sign index starting at Aries=0
  const zodiacSegments = Array.from({ length: 12 }, (_, i) => {
    const sign = i as ZodiacSign;
    const startEcl = i * 30;
    const endEcl = startEcl + 30;
    const startSvg = eclipticToSvgAngle(startEcl, ascDeg);
    const endSvg = eclipticToSvgAngle(endEcl, ascDeg);
    const midSvg = eclipticToSvgAngle(startEcl + 15, ascDeg);
    return { sign, startSvg, endSvg, midSvg };
  });

  // Planets sorted into de-collision buckets
  const planetAngles = chart.planets.map((p) => ({
    ...p,
    svgAngle: eclipticToSvgAngle(p.absoluteDegree, ascDeg),
  }));

  return (
    <div className={styles.wrapper}>
      <svg
        viewBox="0 0 600 600"
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Zodiac sign ring ──────────────────────────────── */}
        {zodiacSegments.map(({ sign, startSvg, endSvg, midSvg }) => {
          const outerS = polarToXY(startSvg, R_OUTER);
          const outerE = polarToXY(endSvg, R_OUTER);
          const innerS = polarToXY(endSvg, R_ZODIAC);
          const innerE = polarToXY(startSvg, R_ZODIAC);
          const path = [
            `M ${outerS.x} ${outerS.y}`,
            `A ${R_OUTER} ${R_OUTER} 0 0 1 ${outerE.x} ${outerE.y}`,
            `L ${innerS.x} ${innerS.y}`,
            `A ${R_ZODIAC} ${R_ZODIAC} 0 0 0 ${innerE.x} ${innerE.y}`,
            'Z',
          ].join(' ');
          const glyphPos = polarToXY(midSvg, (R_OUTER + R_ZODIAC) / 2);
          return (
            <g key={sign}>
              <path
                d={path}
                fill={ZODIAC_ELEMENT_COLORS[sign]}
                stroke="#888"
                strokeWidth="0.5"
              />
              <text
                x={glyphPos.x}
                y={glyphPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="14"
                fill="#333"
              >
                {ZODIAC_GLYPHS[sign]}
              </text>
            </g>
          );
        })}

        {/* ── Outer / inner circles ─────────────────────────── */}
        <circle cx={CX} cy={CY} r={R_OUTER}  fill="none" stroke="#555" strokeWidth="1.5" />
        <circle cx={CX} cy={CY} r={R_ZODIAC} fill="none" stroke="#555" strokeWidth="1"   />
        <circle cx={CX} cy={CY} r={R_HOUSE}  fill="none" stroke="#888" strokeWidth="0.8" />
        <circle cx={CX} cy={CY} r={R_ASPECT} fill="#fff" stroke="#ccc" strokeWidth="0.5" />
        <circle cx={CX} cy={CY} r={R_CENTER} fill="#f5f5f5" stroke="#aaa" strokeWidth="1" />

        {/* ── Degree tick marks on zodiac ring ─────────────── */}
        {Array.from({ length: 360 }, (_, i) => {
          const svgA = eclipticToSvgAngle(i, ascDeg);
          const isMajor = i % 5 === 0;
          const rInner = isMajor ? R_OUTER - 8 : R_OUTER - 4;
          const p1 = polarToXY(svgA, R_OUTER);
          const p2 = polarToXY(svgA, rInner);
          return (
            <line
              key={i}
              x1={p1.x} y1={p1.y}
              x2={p2.x} y2={p2.y}
              stroke="#aaa"
              strokeWidth={isMajor ? 0.8 : 0.4}
            />
          );
        })}

        {/* ── House cusp lines ──────────────────────────────── */}
        {chart.houses.map((house) => {
          const svgA = eclipticToSvgAngle(house.absoluteDegree, ascDeg);
          const inner = polarToXY(svgA, R_CENTER);
          const outer = polarToXY(svgA, R_ZODIAC);
          const isAngular = [1, 4, 7, 10].includes(house.houseNumber);
          return (
            <line
              key={house.houseNumber}
              x1={inner.x} y1={inner.y}
              x2={outer.x} y2={outer.y}
              stroke={isAngular ? '#555' : '#bbb'}
              strokeWidth={isAngular ? 1.2 : 0.7}
            />
          );
        })}

        {/* ── House numbers ─────────────────────────────────── */}
        {chart.houses.map((house, idx) => {
          const next = chart.houses[(idx + 1) % 12];
          const midEcl =
            (house.absoluteDegree +
              ((next.absoluteDegree - house.absoluteDegree + 360) % 360) / 2) %
            360;
          const midSvg = eclipticToSvgAngle(midEcl, ascDeg);
          const pos = polarToXY(midSvg, (R_HOUSE + R_ASPECT) / 2);
          return (
            <text
              key={house.houseNumber}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fill="#555"
            >
              {house.houseNumber}
            </text>
          );
        })}

        {/* ── House cusp degree labels on zodiac ring edge ─── */}
        {chart.houses.map((house) => {
          const svgA = eclipticToSvgAngle(house.absoluteDegree, ascDeg);
          const pos = polarToXY(svgA, R_ZODIAC - 12);
          return (
            <text
              key={house.houseNumber}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="7"
              fill="#666"
            >
              {house.degreeInSign}
            </text>
          );
        })}

        {/* ── Aspect lines ─────────────────────────────────── */}
        {aspects.map((asp, i) => {
          const p1 = chart.planets.find((p) => p.planet === asp.planet1)!;
          const p2 = chart.planets.find((p) => p.planet === asp.planet2)!;
          const a1 = eclipticToSvgAngle(p1.absoluteDegree, ascDeg);
          const a2 = eclipticToSvgAngle(p2.absoluteDegree, ascDeg);
          const pos1 = polarToXY(a1, R_ASPECT);
          const pos2 = polarToXY(a2, R_ASPECT);
          return (
            <line
              key={i}
              x1={pos1.x} y1={pos1.y}
              x2={pos2.x} y2={pos2.y}
              stroke={ASPECT_COLORS[asp.type]}
              strokeWidth="0.8"
              strokeDasharray={ASPECT_DASH[asp.type] === 'none' ? undefined : ASPECT_DASH[asp.type]}
              opacity="0.7"
            />
          );
        })}

        {/* ── Planet glyphs ─────────────────────────────────── */}
        {planetAngles.map((p) => {
          const pos = polarToXY(p.svgAngle, R_PLANET);
          const degPos = polarToXY(p.svgAngle, R_PLANET + 18);
          return (
            <g key={p.planet}>
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="13"
                fill="#222"
                fontWeight="bold"
              >
                {PLANET_GLYPHS[p.planet]}
              </text>
              {p.isRetrograde && (
                <text
                  x={pos.x + 8}
                  y={pos.y - 7}
                  fontSize="8"
                  fill="#cc2222"
                >
                  ℞
                </text>
              )}
              <text
                x={degPos.x}
                y={degPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="8"
                fill="#555"
              >
                {p.degreeInSign}°
              </text>
            </g>
          );
        })}

        {/* ── ASC line (horizontal) ─────────────────────────── */}
        {(() => {
          const leftPt  = polarToXY(eclipticToSvgAngle(ascDeg, ascDeg), R_ZODIAC);
          const rightPt = polarToXY(eclipticToSvgAngle(ascDeg + 180, ascDeg), R_ZODIAC);
          const labelPos = polarToXY(eclipticToSvgAngle(ascDeg, ascDeg), R_ZODIAC - 20);
          const dscPos   = polarToXY(eclipticToSvgAngle(ascDeg + 180, ascDeg), R_ZODIAC - 20);
          return (
            <g>
              <line
                x1={leftPt.x} y1={leftPt.y}
                x2={rightPt.x} y2={rightPt.y}
                stroke="#cc2222" strokeWidth="1.2"
              />
              <text x={labelPos.x} y={labelPos.y} fontSize="9" fill="#cc2222" textAnchor="middle">Asc</text>
              <text x={dscPos.x}   y={dscPos.y}   fontSize="9" fill="#cc2222" textAnchor="middle">Dsc</text>
            </g>
          );
        })()}

        {/* ── MC / IC line ──────────────────────────────────── */}
        {(() => {
          const mcPt  = polarToXY(eclipticToSvgAngle(mcDeg, ascDeg), R_ZODIAC);
          const icPt  = polarToXY(eclipticToSvgAngle(mcDeg + 180, ascDeg), R_ZODIAC);
          const mcLbl = polarToXY(eclipticToSvgAngle(mcDeg, ascDeg), R_ZODIAC - 20);
          const icLbl = polarToXY(eclipticToSvgAngle(mcDeg + 180, ascDeg), R_ZODIAC - 20);
          return (
            <g>
              <line
                x1={mcPt.x} y1={mcPt.y}
                x2={icPt.x} y2={icPt.y}
                stroke="#226622" strokeWidth="1.2"
              />
              <text x={mcLbl.x} y={mcLbl.y} fontSize="9" fill="#226622" textAnchor="middle">MC</text>
              <text x={icLbl.x} y={icLbl.y} fontSize="9" fill="#226622" textAnchor="middle">IC</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
