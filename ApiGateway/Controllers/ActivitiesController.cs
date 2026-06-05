using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Shared.DTOs;
using Shared.Interfaces;

namespace ApiGateway.Controllers
{
    [ApiController]
    [Route("api/activities")]
    public class ActivitiesController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateActivityDto request)
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                new ServicePartitionKey(0)
            );

            var result = await proxy.AddActivityAsync(request);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateActivityDto request)
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                new ServicePartitionKey(0)
                );

            var result = await proxy.UpdateActivityAsync(id, request);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                new ServicePartitionKey(0)
            );

            var success = await proxy.DeleteActivityAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}