using AstroPlayground.Models;
using AstroPlayground.Models.Calculators;
using AstroPlayground.Models.HouseSystems;
using SwissEphNet;

namespace AstroPlayground.Api.Calculators;

/// <summary>
/// Implements planet and house calculations using the Swiss Ephemeris library.
/// Uses the built-in Moshier ephemeris - no external data files required.
/// </summary>
public sealed class SwissEphemerisCalculator : IPlanetCalculator, IHouseCalculator, IDisposable
{
    private readonly SwissEph _swe;
    private readonly IHouseSystemResolver _houseSystemResolver;

    private static readonly Planet[] AllPlanets = Enum.GetValues<Planet>();

    // Use Moshier built-in algorithm + speed for retrograde detection
    private const int CalcFlags = SwissEph.SEFLG_MOSEPH | SwissEph.SEFLG_SPEED;

    public SwissEphemerisCalculator(IHouseSystemResolver houseSystemResolver)
    {
        _houseSystemResolver = houseSystemResolver;
        _swe = new SwissEph();
        _swe.swe_set_ephe_path(null); // null = use built-in Moshier ephemeris
    }

    /// <inheritdoc />
    public IReadOnlyList<PlanetPosition> Calculate(double julianDayUt)
    {
        var results = new List<PlanetPosition>(AllPlanets.Length);

        foreach (var planet in AllPlanets)
        {
            var position = CalculatePlanet(julianDayUt, planet);
            if (position is not null)
                results.Add(position);
        }

        return results.AsReadOnly();
    }

    /// <inheritdoc />
    public (IReadOnlyList<HousePosition> Houses, HousePosition Ascendant, HousePosition MidHeaven)
        Calculate(double julianDayUt, double latitude, double longitude, HouseSystemType houseSystem)
    {
        var cusps = new double[13];   // [1..12] = house cusps
        var ascmc = new double[10];   // [0]=ASC, [1]=MC

        char hsCode = _houseSystemResolver.Resolve(houseSystem);
        _swe.swe_houses(julianDayUt, latitude, longitude, hsCode, cusps, ascmc);

        var houses = Enumerable.Range(1, 12)
            .Select(i => DegreeToHousePosition(i, cusps[i]))
            .ToList()
            .AsReadOnly();

        var ascendant = DegreeToHousePosition(0, ascmc[0]);
        var midHeaven = DegreeToHousePosition(0, ascmc[1]);

        return (houses, ascendant, midHeaven);
    }

    private PlanetPosition? CalculatePlanet(double julianDayUt, Planet planet)
    {
        var xx = new double[6];
        var error = string.Empty;

        int seId = MapToSeId(planet);
        int ret = _swe.swe_calc_ut(julianDayUt, seId, CalcFlags, xx, ref error);

        if (ret < 0)
            return null; // Calculation failed; skip this planet

        double longitude = xx[0];       // ecliptic longitude 0..360
        double speedInLong = xx[3];     // negative speed = retrograde

        // Guard against rare Infinity/NaN from Swiss Ephemeris
        if (!double.IsFinite(longitude))
            return null;

        // The Sun and Moon never retrograde; guard against floating-point anomalies
        bool isRetrograde = planet is not (Planet.Sun or Planet.Moon) && speedInLong < 0;

        return DegreeToPlanetPosition(planet, longitude, isRetrograde);
    }

    private static PlanetPosition DegreeToPlanetPosition(Planet planet, double longitude, bool isRetrograde)
    {
        var (sign, deg, min, sec) = SplitEclipticLongitude(longitude);
        return new PlanetPosition(planet, sign, deg, min, sec, longitude, isRetrograde);
    }

    private static HousePosition DegreeToHousePosition(int houseNumber, double longitude)
    {
        var (sign, deg, min, _) = SplitEclipticLongitude(longitude);
        return new HousePosition(houseNumber, sign, deg, min, longitude);
    }

    private static (ZodiacSign Sign, int Degree, int Minute, int Second)
        SplitEclipticLongitude(double longitude)
    {
        longitude = ((longitude % 360) + 360) % 360;

        int signIndex = (int)(longitude / 30);
        double inSign = longitude % 30;
        int deg = (int)inSign;
        double minFrac = (inSign - deg) * 60;
        int min = (int)minFrac;
        int sec = (int)((minFrac - min) * 60);

        return ((ZodiacSign)signIndex, deg, min, sec);
    }

    /// <summary>Maps our Planet enum to the Swiss Ephemeris integer ID.</summary>
    private static int MapToSeId(Planet planet) => planet switch
    {
        Planet.Sun       => SwissEph.SE_SUN,
        Planet.Moon      => SwissEph.SE_MOON,
        Planet.Mercury   => SwissEph.SE_MERCURY,
        Planet.Venus     => SwissEph.SE_VENUS,
        Planet.Mars      => SwissEph.SE_MARS,
        Planet.Jupiter   => SwissEph.SE_JUPITER,
        Planet.Saturn    => SwissEph.SE_SATURN,
        Planet.Uranus    => SwissEph.SE_URANUS,
        Planet.Neptune   => SwissEph.SE_NEPTUNE,
        Planet.Pluto     => SwissEph.SE_PLUTO,
        Planet.NorthNode => SwissEph.SE_MEAN_NODE,
        _ => throw new ArgumentOutOfRangeException(nameof(planet), planet, null)
    };

    public void Dispose() => _swe.swe_close();
}
