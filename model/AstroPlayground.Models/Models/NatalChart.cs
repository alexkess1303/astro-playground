namespace AstroPlayground.Models;

/// <summary>The complete calculated natal chart containing planets and houses.</summary>
public record NatalChart(
    IReadOnlyList<PlanetPosition> Planets,
    IReadOnlyList<HousePosition> Houses,
    HousePosition Ascendant,
    HousePosition MidHeaven,
    HouseSystemType HouseSystem
);
