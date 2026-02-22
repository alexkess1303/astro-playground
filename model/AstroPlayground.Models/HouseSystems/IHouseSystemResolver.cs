using AstroPlayground.Models;

namespace AstroPlayground.Models.HouseSystems;

/// <summary>Maps domain HouseSystemType to the Swiss Ephemeris single-char house system code.</summary>
public interface IHouseSystemResolver
{
    char Resolve(HouseSystemType houseSystemType);
}
