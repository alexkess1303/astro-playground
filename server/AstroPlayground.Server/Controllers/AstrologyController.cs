using AstroPlayground.Models.Dtos;
using AstroPlayground.Models.Services;
using Microsoft.AspNetCore.Mvc;

namespace AstroPlayground.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AstrologyController : ControllerBase
{
    private readonly IAstrologyService _astrologyService;

    public AstrologyController(IAstrologyService astrologyService)
    {
        _astrologyService = astrologyService;
    }

    /// <summary>Calculates a full natal chart given birth date, time, location, and house system.</summary>
    /// <param name="request">Birth data and preferences.</param>
    /// <returns>A natal chart with planet positions and house cusps.</returns>
    /// <response code="200">Returns the calculated natal chart.</response>
    /// <response code="400">If the request is invalid.</response>
    [HttpPost("chart")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult Calculate([FromBody] ChartRequest request)
    {
        var chart = _astrologyService.Calculate(request);
        return Ok(chart);
    }
}
