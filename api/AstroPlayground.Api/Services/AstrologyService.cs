using AstroPlayground.Api.Utilities;
using AstroPlayground.Models;
using AstroPlayground.Models.Calculators;
using AstroPlayground.Models.Dtos;
using AstroPlayground.Models.Services;

namespace AstroPlayground.Api.Services;

/// <inheritdoc />
public sealed class AstrologyService : IAstrologyService
{
    private readonly IPlanetCalculator _planetCalculator;
    private readonly IHouseCalculator _houseCalculator;

    public AstrologyService(IPlanetCalculator planetCalculator, IHouseCalculator houseCalculator)
    {
        _planetCalculator = planetCalculator;
        _houseCalculator = houseCalculator;
    }

    /// <inheritdoc />
    public NatalChart Calculate(ChartRequest request)
    {
        double julianDayUt = JulianDayConverter.ToJulianDayUt(
            request.DateOfBirth,
            request.TimeOfBirth,
            request.UtcOffsetHours);

        var planets = _planetCalculator.Calculate(julianDayUt);

        var (houses, ascendant, midHeaven) = _houseCalculator.Calculate(
            julianDayUt,
            request.Latitude,
            request.Longitude,
            request.HouseSystem);

        return new NatalChart(planets, houses, ascendant, midHeaven, request.HouseSystem);
    }
}
