using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Shared.Data;
using Shared.DTOs;
using Shared.Interfaces;

namespace ApiGateway.Controllers
{
    [ApiController]
    [Route("api/share")]
    public class ShareController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ShareController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateShareToken([FromBody] CreateShareTokenDto request)
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                new ServicePartitionKey(0)
            );
            var result = await proxy.CreateShareTokenAsync(request);
            return Ok(result);
        }

        [HttpGet("{token}")]
        public async Task<IActionResult> GetByShareToken(string token)
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                new ServicePartitionKey(0)
            );
            var result = await proxy.GetByShareTokenAsync(token);
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        [HttpGet("{token}/info")]
        public async Task<IActionResult> GetTokenInfo(string token)
        {
            var shareToken = await _context.ShareTokens
                .FirstOrDefaultAsync(s => s.Token == token && s.ExpiresAt > DateTime.UtcNow);

            if (shareToken == null)
                return NotFound();

            return Ok(new { shareToken.AccessType, shareToken.TravelPlanId });
        }

        [HttpPut("{token}/update")]
        public async Task<IActionResult> UpdateByShareToken(string token, [FromBody] CreateTravelPlanDto request)
        {
            var shareToken = await _context.ShareTokens
                .FirstOrDefaultAsync(s => s.Token == token && s.ExpiresAt > DateTime.UtcNow);

            if (shareToken == null)
                return NotFound("Invalid or expired token.");

            if (shareToken.AccessType != "EDIT")
                return StatusCode(403, "This token only allows VIEW access.");

            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                new ServicePartitionKey(0)
            );

            var result = await proxy.UpdateAsync(shareToken.TravelPlanId, request);
            if (result == null)
                return NotFound();

            return Ok(result);
        }
    }
}