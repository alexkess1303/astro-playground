export enum Planet {
  Sun = 0,
  Moon = 1,
  Mercury = 2,
  Venus = 3,
  Mars = 4,
  Jupiter = 5,
  Saturn = 6,
  Uranus = 7,
  Neptune = 8,
  Pluto = 9,
  NorthNode = 10,
}

export enum ZodiacSign {
  Aries = 0,
  Taurus = 1,
  Gemini = 2,
  Cancer = 3,
  Leo = 4,
  Virgo = 5,
  Libra = 6,
  Scorpio = 7,
  Sagittarius = 8,
  Capricorn = 9,
  Aquarius = 10,
  Pisces = 11,
}

export enum HouseSystemType {
  EqualHouses = 'EqualHouses',
  Placidus = 'Placidus',
  Koch = 'Koch',
  Regiomontanus = 'Regiomontanus',
  Campanus = 'Campanus',
  WholeSign = 'WholeSign',
}

export interface PlanetPosition {
  planet: Planet;
  sign: ZodiacSign;
  degreeInSign: number;
  minute: number;
  second: number;
  absoluteDegree: number;
  isRetrograde: boolean;
}

export interface HousePosition {
  houseNumber: number;
  sign: ZodiacSign;
  degreeInSign: number;
  minute: number;
  absoluteDegree: number;
}

export interface NatalChart {
  planets: PlanetPosition[];
  houses: HousePosition[];
  ascendant: HousePosition;
  midHeaven: HousePosition;
  houseSystem: HouseSystemType;
}

export interface ChartRequest {
  dateOfBirth: string;
  timeOfBirth: string;
  utcOffsetHours: number;
  latitude: number;
  longitude: number;
  placeOfBirth?: string;
  houseSystem: HouseSystemType;
}
