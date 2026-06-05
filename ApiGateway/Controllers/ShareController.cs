using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Shared.DTOs;
using Shared.Interfaces;

namespace ApiGateway.Controllers
{
    [ApiController]
    [Route("api/share")]
    public class ShareController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> CreateShareToken([FromBody] CreateShareTokenDto request)
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService")
            );

            var result = await proxy.CreateShareTokenAsync(request);
            return Ok(result);
        }

        [HttpGet("{token}")]
        public async Task<IActionResult> GetByShareToken(string token)
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService")
            );

            var result = await proxy.GetByShareTokenAsync(token);
            if (result == null)
                return NotFound();

            return Ok(result);
        }
    }
}