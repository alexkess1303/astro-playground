using AstroPlayground.Models;
using AstroPlayground.Models.HouseSystems;

namespace AstroPlayground.Api.HouseSystems;

/// <inheritdoc />
public sealed class HouseSystemResolver : IHouseSystemResolver
{
    // Swiss Ephemeris house system codes
    private static readonly Dictionary<HouseSystemType, char> Map = new()
    {
        { HouseSystemType.Placidus,      'P' },
        { HouseSystemType.EqualHouses,   'E' },
        { HouseSystemType.Koch,          'K' },
        { HouseSystemType.Regiomontanus, 'R' },
        { HouseSystemType.Campanus,      'C' },
        { HouseSystemType.WholeSign,     'W' },
    };

    public char Resolve(HouseSystemType houseSystemType)
    {
        if (!Map.TryGetValue(houseSystemType, out var code))
            throw new ArgumentOutOfRangeException(nameof(houseSystemType),
                $"Unsupported house system: {houseSystemType}");
        return code;
    }
}
