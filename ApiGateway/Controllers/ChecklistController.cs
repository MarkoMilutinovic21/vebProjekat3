using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Shared.DTOs;
using Shared.Interfaces;

namespace ApiGateway.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/checklist")]
    public class ChecklistController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateChecklistItemDto request)
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                new ServicePartitionKey(0)
            );

            var result = await proxy.AddChecklistItemAsync(request);
            return Ok(result);
        }

        [HttpPut("{id}/toggle")]
        public async Task<IActionResult> Toggle(int id)
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                new ServicePartitionKey(0)
            );

            var success = await proxy.ToggleChecklistItemAsync(id);
            if (!success)
                return NotFound();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                new ServicePartitionKey(0)
            );

            var success = await proxy.DeleteChecklistItemAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}