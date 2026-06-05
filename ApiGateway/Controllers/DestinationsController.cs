using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Shared.DTOs;
using Shared.Interfaces;

namespace ApiGateway.Controllers
{
    [ApiController]
    [Route("api/destinations")]
    public class DestinationsController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateDestinationDto request)
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                new ServicePartitionKey(0)
            );

            var result = await proxy.AddDestinationAsync(request);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateDestinationDto request)
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                new ServicePartitionKey(0)
            );

            var result = await proxy.UpdateDestinationAsync(id, request);
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

            var success = await proxy.DeleteDestinationAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}