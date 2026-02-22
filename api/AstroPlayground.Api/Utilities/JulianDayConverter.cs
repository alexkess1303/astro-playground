namespace AstroPlayground.Api.Utilities;

/// <summary>Converts date/time values to Julian Day Number (UT), as required by the Swiss Ephemeris.</summary>
public static class JulianDayConverter
{
    /// <summary>
    /// Converts a local birth date/time to Julian Day UT using a pure mathematical formula.
    /// Avoids creating SwissEph instances that would corrupt global native-library state via swe_close().
    /// </summary>
    /// <param name="date">Date of birth (local).</param>
    /// <param name="time">Time of birth (local).</param>
    /// <param name="utcOffsetHours">UTC offset of the birth location in decimal hours.</param>
    public static double ToJulianDayUt(DateOnly date, TimeOnly time, double utcOffsetHours)
    {
        double localHour = time.Hour + time.Minute / 60.0 + time.Second / 3600.0;
        double utHour = localHour - utcOffsetHours;

        int year = date.Year;
        int month = date.Month;
        int day = date.Day;

        if (utHour < 0)
        {
            utHour += 24;
            var previous = date.AddDays(-1);
            year = previous.Year;
            month = previous.Month;
            day = previous.Day;
        }
        else if (utHour >= 24)
        {
            utHour -= 24;
            var next = date.AddDays(1);
            year = next.Year;
            month = next.Month;
            day = next.Day;
        }

        // Standard Gregorian → Julian Day Number (integer part)
        int a = (14 - month) / 12;
        int y = year + 4800 - a;
        int m = month + 12 * a - 3;
        int jdn = day + (153 * m + 2) / 5 + 365 * y + y / 4 - y / 100 + y / 400 - 32045;

        // Julian Day = JDN + fractional day (noon = 0.0, so subtract 0.5 for midnight offset)
        return jdn - 0.5 + utHour / 24.0;
    }
}
