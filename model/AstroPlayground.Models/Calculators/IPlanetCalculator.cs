using AstroPlayground.Models;

namespace AstroPlayground.Models.Calculators;

public interface IPlanetCalculator
{
    /// <summary>Calculates ecliptic positions for all planets at a given Julian Day (UT).</summary>
    IReadOnlyList<PlanetPosition> Calculate(double julianDayUt);
}
