# AstroPlayground

RESTful .NET Core 8 API for natal chart calculation. Returns planet positions and house cusps based on date, time, and place of birth.

## Project Structure

```
astro-playground/        ← ASP.NET Core Web API
  Controllers/           ← HTTP layer only
  src/
    AstroPlayground.Core/   ← Domain / business logic (class library)
      Calculators/       ← IPlanetCalculator, IHouseCalculator, SwissEphemerisCalculator
      Dtos/              ← ChartRequest
      HouseSystems/      ← IHouseSystemResolver, HouseSystemResolver
      Models/            ← Planet, ZodiacSign, PlanetPosition, HousePosition, NatalChart
      Services/          ← IAstrologyService, AstrologyService
      Utilities/         ← JulianDayConverter

../astro-tests/
  AstroPlayground.Tests/  ← xUnit + FluentAssertions integration tests
```

## Run the API

```sh
cd astro-playground
dotnet run
```

Swagger UI: `http://localhost:5XXX/swagger`

## Example Request

```http
POST /api/astrology/chart
Content-Type: application/json

{
  "dateOfBirth": "1972-03-13",
  "timeOfBirth": "18:35:00",
  "utcOffsetHours": 3,
  "latitude": 50.45,
  "longitude": 30.52,
  "placeOfBirth": "Kiev, Ukraine",
  "houseSystem": "Placidus"
}
```

## Supported House Systems

| Value | System |
|---|---|
| `Placidus` | Placidus (default) |
| `EqualHouses` | Equal Houses |
| `Koch` | Koch |
| `Regiomontanus` | Regiomontanus |
| `Campanus` | Campanus |
| `WholeSign` | Whole Sign |

## Run Tests

```sh
cd ../astro-tests/AstroPlayground.Tests
dotnet test
```

Tests validate real-world birth data (13 Mar 1972, Kiev, 18:35 MSK):

- Sun in Pisces ~23°
- Moon in Aquarius ~28°
- Mercury in Aries ~11°
- Venus in Taurus ~7°
- Mars in Taurus ~21°
- ASC, MC populated
- All 12 houses present for every house system

## Tech Stack

- .NET 8, ASP.NET Core
- [SwissEphNet](https://github.com/ygrenier/SwissEphNet) — Swiss Ephemeris, Moshier algorithm (no file dependencies)
- xUnit + FluentAssertions for tests
- Swagger / OpenAPI
