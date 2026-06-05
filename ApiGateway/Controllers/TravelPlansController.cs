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
    [Route("api/travel-plans")]
    public class TravelPlansController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int userId)
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                new ServicePartitionKey(0)
            );
            var result = await proxy.GetAllAsync(userId);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                new ServicePartitionKey(0)
            );
            var result = await proxy.GetByIdAsync(id);
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTravelPlanDto request, [FromQuery] int userId)
        {
            try
            {
                var proxy = ServiceProxy.Create<ITravelPlanService>(
                    new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                    new ServicePartitionKey(0)
                );
                var result = await proxy.CreateAsync(request, userId);
                return Ok(result);
            }
            catch (AggregateException ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateTravelPlanDto request)
        {
            try
            {
                var proxy = ServiceProxy.Create<ITravelPlanService>(
                    new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                    new ServicePartitionKey(0)
                );
                var result = await proxy.UpdateAsync(id, request);
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (AggregateException ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                new ServicePartitionKey(0)
            );
            var success = await proxy.DeleteAsync(id);
            if (!success)
                return NotFound();
            return NoContent();
        }
    }
}