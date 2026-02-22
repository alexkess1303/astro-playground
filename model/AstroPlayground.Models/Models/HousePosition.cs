namespace AstroPlayground.Models;

/// <summary>Represents the cusp position of an astrological house.</summary>
public record HousePosition(
    int HouseNumber,
    ZodiacSign Sign,
    int DegreeInSign,
    int Minute,
    double AbsoluteDegree
);
