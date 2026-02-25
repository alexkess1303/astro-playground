import { Planet, ZodiacSign } from '../api/types';

export const ZODIAC_GLYPHS: Record<ZodiacSign, string> = {
  [ZodiacSign.Aries]:       '♈︎',
  [ZodiacSign.Taurus]:      '♉︎',
  [ZodiacSign.Gemini]:      '♊︎',
  [ZodiacSign.Cancer]:      '♋︎',
  [ZodiacSign.Leo]:         '♌︎',
  [ZodiacSign.Virgo]:       '♍︎',
  [ZodiacSign.Libra]:       '♎︎',
  [ZodiacSign.Scorpio]:     '♏︎',
  [ZodiacSign.Sagittarius]: '♐︎',
  [ZodiacSign.Capricorn]:   '♑︎',
  [ZodiacSign.Aquarius]:    '♒︎',
  [ZodiacSign.Pisces]:      '♓︎',
};

export const ZODIAC_NAMES: Record<ZodiacSign, string> = {
  [ZodiacSign.Aries]: 'Ari',
  [ZodiacSign.Taurus]: 'Tau',
  [ZodiacSign.Gemini]: 'Gem',
  [ZodiacSign.Cancer]: 'Can',
  [ZodiacSign.Leo]: 'Leo',
  [ZodiacSign.Virgo]: 'Vir',
  [ZodiacSign.Libra]: 'Lib',
  [ZodiacSign.Scorpio]: 'Sco',
  [ZodiacSign.Sagittarius]: 'Sag',
  [ZodiacSign.Capricorn]: 'Cap',
  [ZodiacSign.Aquarius]: 'Aqu',
  [ZodiacSign.Pisces]: 'Pis',
};

export const PLANET_GLYPHS: Record<Planet, string> = {
  [Planet.Sun]: '☉',
  [Planet.Moon]: '☽',
  [Planet.Mercury]: '☿',
  [Planet.Venus]: '♀',
  [Planet.Mars]: '♂',
  [Planet.Jupiter]: '♃',
  [Planet.Saturn]: '♄',
  [Planet.Uranus]: '⛢',
  [Planet.Neptune]: '♆',
  [Planet.Pluto]: '♇',
  [Planet.NorthNode]: '☊',
  [Planet.Chiron]: '⚷',
};

export const PLANET_NAMES: Record<Planet, string> = {
  [Planet.Sun]: 'Sun',
  [Planet.Moon]: 'Moon',
  [Planet.Mercury]: 'Mercury',
  [Planet.Venus]: 'Venus',
  [Planet.Mars]: 'Mars',
  [Planet.Jupiter]: 'Jupiter',
  [Planet.Saturn]: 'Saturn',
  [Planet.Uranus]: 'Uranus',
  [Planet.Neptune]: 'Neptune',
  [Planet.Pluto]: 'Pluto',
  [Planet.NorthNode]: 'Node',
  [Planet.Chiron]: 'Chiron',
};

/** Colors used for zodiac sign segments on the wheel */
export const ZODIAC_ELEMENT_COLORS: Record<ZodiacSign, string> = {
  // Fire — pale red
  [ZodiacSign.Aries]: '#ffe0e0',
  [ZodiacSign.Leo]: '#ffe0e0',
  [ZodiacSign.Sagittarius]: '#ffe0e0',
  // Earth — pale tan
  [ZodiacSign.Taurus]: '#f0ead2',
  [ZodiacSign.Virgo]: '#f0ead2',
  [ZodiacSign.Capricorn]: '#f0ead2',
  // Air — pale yellow
  [ZodiacSign.Gemini]: '#fffde0',
  [ZodiacSign.Libra]: '#fffde0',
  [ZodiacSign.Aquarius]: '#fffde0',
  // Water — pale blue
  [ZodiacSign.Cancer]: '#ddeeff',
  [ZodiacSign.Scorpio]: '#ddeeff',
  [ZodiacSign.Pisces]: '#ddeeff',
};
