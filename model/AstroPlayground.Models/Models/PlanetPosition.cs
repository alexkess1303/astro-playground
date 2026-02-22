namespace AstroPlayground.Models;

/// <summary>Represents the ecliptic position of a planet in the natal chart.</summary>
public record PlanetPosition(
    Planet Planet,
    ZodiacSign Sign,
    int DegreeInSign,
    int Minute,
    int Second,
    double AbsoluteDegree,
    bool IsRetrograde
);
