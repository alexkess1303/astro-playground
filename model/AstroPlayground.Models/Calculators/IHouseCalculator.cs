using AstroPlayground.Models;

namespace AstroPlayground.Models.Calculators;

public interface IHouseCalculator
{
    /// <summary>Calculates house cusps for the given location, Julian Day (UT), and house system.</summary>
    (IReadOnlyList<HousePosition> Houses, HousePosition Ascendant, HousePosition MidHeaven)
        Calculate(double julianDayUt, double latitude, double longitude, HouseSystemType houseSystem);
}
