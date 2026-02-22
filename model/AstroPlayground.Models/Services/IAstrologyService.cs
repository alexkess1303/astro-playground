using AstroPlayground.Models;
using AstroPlayground.Models.Dtos;

namespace AstroPlayground.Models.Services;

public interface IAstrologyService
{
    NatalChart Calculate(ChartRequest request);
}
