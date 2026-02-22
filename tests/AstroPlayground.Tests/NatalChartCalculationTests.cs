using AstroPlayground.Api.Calculators;
using AstroPlayground.Api.HouseSystems;
using AstroPlayground.Api.Services;
using AstroPlayground.Models;
using AstroPlayground.Models.Dtos;
using AstroPlayground.Models.Services;
using FluentAssertions;
using Xunit.Abstractions;

namespace AstroPlayground.Tests;

/// <summary>
/// Integration tests for natal chart calculations using real-world birth data.
/// Expected values verified against multiple trusted astrology sources.
/// </summary>
public class NatalChartCalculationTests(ITestOutputHelper output)
{
    // ── Shared fixture ────────────────────────────────────────────────────

    private static IAstrologyService CreateService()
    {
        var resolver = new HouseSystemResolver();
        var calculator = new SwissEphemerisCalculator(resolver);
        return new AstrologyService(calculator, calculator);
    }

    private static ChartRequest KievMarch1972(HouseSystemType houseSystem) => new()
    {
        DateOfBirth = new DateOnly(1972, 3, 13),
        TimeOfBirth = new TimeOnly(18, 35, 0),
        UtcOffsetHours = 3,   // Kiev used Moscow Time (UTC+3) in March 1972
        Latitude = 50.45,
        Longitude = 30.52,
        PlaceOfBirth = "Kiev, Ukraine",
        HouseSystem = houseSystem
    };

    // ── Planet position tests ─────────────────────────────────────────────

    [Fact]
    public void Kiev1972_Sun_ShouldBeInPisces_Around23Degrees()
    {
        var chart = CreateService().Calculate(KievMarch1972(HouseSystemType.Placidus));

        var sun = chart.Planets.Single(p => p.Planet == Planet.Sun);

        sun.Sign.Should().Be(ZodiacSign.Pisces);
        sun.DegreeInSign.Should().BeInRange(22, 24);
    }

    [Fact]
    public void Kiev1972_Moon_ShouldBeInAquarius_Around28Degrees()
    {
        var chart = CreateService().Calculate(KievMarch1972(HouseSystemType.Placidus));

        var moon = chart.Planets.Single(p => p.Planet == Planet.Moon);

        moon.Sign.Should().Be(ZodiacSign.Aquarius);
        moon.DegreeInSign.Should().BeInRange(27, 29);
    }

    [Fact]
    public void Kiev1972_Mercury_ShouldBeInAries_Around11Degrees()
    {
        var chart = CreateService().Calculate(KievMarch1972(HouseSystemType.Placidus));

        var mercury = chart.Planets.Single(p => p.Planet == Planet.Mercury);

        mercury.Sign.Should().Be(ZodiacSign.Aries);
        mercury.DegreeInSign.Should().BeInRange(10, 12);
    }

    [Fact]
    public void Kiev1972_Venus_ShouldBeInTaurus()
    {
        var chart = CreateService().Calculate(KievMarch1972(HouseSystemType.Placidus));

        var venus = chart.Planets.Single(p => p.Planet == Planet.Venus);

        // Venus was at ~7° Taurus on 13 March 1972
        venus.Sign.Should().Be(ZodiacSign.Taurus);
        venus.DegreeInSign.Should().BeInRange(6, 8);
    }

    [Fact]
    public void Kiev1972_Mars_ShouldBeInTaurus()
    {
        var chart = CreateService().Calculate(KievMarch1972(HouseSystemType.Placidus));

        var mars = chart.Planets.Single(p => p.Planet == Planet.Mars);

        // Mars was at ~21° Taurus on 13 March 1972
        mars.Sign.Should().Be(ZodiacSign.Taurus);
        mars.DegreeInSign.Should().BeInRange(20, 22);
    }

    // ── Chart structure tests ─────────────────────────────────────────────

    [Fact]
    public void ChartShouldContainAllPlanets()
    {
        var chart = CreateService().Calculate(KievMarch1972(HouseSystemType.Placidus));

        chart.Planets.Select(p => p.Planet)
            .Should().BeEquivalentTo(Enum.GetValues<Planet>());
    }

    [Fact]
    public void ChartShouldContain12Houses()
    {
        var chart = CreateService().Calculate(KievMarch1972(HouseSystemType.Placidus));

        chart.Houses.Should().HaveCount(12);
        chart.Houses.Select(h => h.HouseNumber)
            .Should().BeEquivalentTo(Enumerable.Range(1, 12));
    }

    [Fact]
    public void AscendantAndMidHeavenShouldBePopulated()
    {
        var chart = CreateService().Calculate(KievMarch1972(HouseSystemType.Placidus));

        chart.Ascendant.Should().NotBeNull();
        chart.MidHeaven.Should().NotBeNull();
        chart.Ascendant.AbsoluteDegree.Should().BeInRange(0, 360);
        chart.MidHeaven.AbsoluteDegree.Should().BeInRange(0, 360);
    }

    // ── House system tests ────────────────────────────────────────────────

    [Theory]
    [InlineData(HouseSystemType.Placidus)]
    [InlineData(HouseSystemType.EqualHouses)]
    [InlineData(HouseSystemType.Koch)]
    [InlineData(HouseSystemType.WholeSign)]
    [InlineData(HouseSystemType.Regiomontanus)]
    [InlineData(HouseSystemType.Campanus)]
    public void AllHouseSystems_ShouldProduceValidChart(HouseSystemType houseSystem)
    {
        var chart = CreateService().Calculate(KievMarch1972(houseSystem));

        chart.HouseSystem.Should().Be(houseSystem);
        chart.Houses.Should().HaveCount(12);
        chart.Planets.Should().NotBeEmpty();
    }

    [Fact]
    public void Placidus_And_EqualHouses_ShouldProduceDifferentHouseCusps()
    {
        var placidus = CreateService().Calculate(KievMarch1972(HouseSystemType.Placidus));
        var equal    = CreateService().Calculate(KievMarch1972(HouseSystemType.EqualHouses));

        var placidusHouse2 = placidus.Houses.Single(h => h.HouseNumber == 2).AbsoluteDegree;
        var equalHouse2    = equal.Houses.Single(h => h.HouseNumber == 2).AbsoluteDegree;

        placidusHouse2.Should().NotBeApproximately(equalHouse2, 1.0);
    }

    // ── Retrograde tests ──────────────────────────────────────────────────

    [Fact]
    public void SunAndMoon_ShouldNeverBeRetrograde()
    {
        var chart = CreateService().Calculate(KievMarch1972(HouseSystemType.Placidus));

        chart.Planets.Where(p => p.Planet is Planet.Sun or Planet.Moon)
            .Should().AllSatisfy(p => p.IsRetrograde.Should().BeFalse());
    }

    [Fact]
    public void SunAndMoon_PrintAll()
    {
        var chart = CreateService().Calculate(KievMarch1972(HouseSystemType.Placidus));

        foreach (var planet in chart.Planets)
        {
            output.WriteLine($"{planet.Planet,-12} | Sign: {planet.Sign,-12} | Degree: {planet.DegreeInSign:F2}° | Absolute: {planet.AbsoluteDegree:F2}° | Retrograde: {planet.IsRetrograde}");
        }

        chart.Planets.Where(p => p.Planet is Planet.Sun or Planet.Moon)
            .Should().AllSatisfy(p => p.IsRetrograde.Should().BeFalse());
    }
}
