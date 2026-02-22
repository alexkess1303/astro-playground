using System.ComponentModel.DataAnnotations;

namespace AstroPlayground.Models.Dtos;

/// <summary>Input DTO for natal chart calculation.</summary>
public class ChartRequest
{
    /// <example>1972-03-13</example>
    [Required]
    public DateOnly DateOfBirth { get; init; }

    /// <example>18:35:00</example>
    [Required]
    public TimeOnly TimeOfBirth { get; init; }

    /// <summary>UTC offset in hours (e.g. 3 for Kiev / Moscow Time in 1972).</summary>
    /// <example>3</example>
    [Required, Range(-14, 14)]
    public double UtcOffsetHours { get; init; }

    /// <summary>Geographic latitude in decimal degrees (positive = North).</summary>
    /// <example>50.45</example>
    [Required, Range(-90, 90)]
    public double Latitude { get; init; }

    /// <summary>Geographic longitude in decimal degrees (positive = East).</summary>
    /// <example>30.52</example>
    [Required, Range(-180, 180)]
    public double Longitude { get; init; }

    /// <summary>Optional display name for the place of birth.</summary>
    /// <example>Kiev, Ukraine</example>
    public string? PlaceOfBirth { get; init; }

    /// <example>Placidus</example>
    [Required]
    public HouseSystemType HouseSystem { get; init; } = HouseSystemType.Placidus;
}
