using ApiGateway.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Shared.Data;
using Shared.Interfaces;

namespace ApiGateway.Controllers
{
    [Authorize(Roles = "admin")]
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.Role,
                    u.CreatedAt
                })
                .ToListAsync();
            return Ok(users);
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> ChangeUserRole(int id, [FromBody] string role)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            user.Role = role;
            await _context.SaveChangesAsync();
            return Ok(new { user.Id, user.Name, user.Email, user.Role });
        }

        [HttpGet("travel-plans")]
        public async Task<IActionResult> GetAllTravelPlans()
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                new ServicePartitionKey(0)
            );
            var result = await proxy.GetAllPlansAsync();
            return Ok(result);
        }

        [HttpDelete("travel-plans/{id}")]
        public async Task<IActionResult> DeleteTravelPlan(int id)
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

        [HttpGet("users/{userId}/travel-plans")]
        public async Task<IActionResult> GetUserTravelPlans(int userId)
        {
            var proxy = ServiceProxy.Create<ITravelPlanService>(
                new Uri("fabric:/TravelPlannerApp/TravelPlanService"),
                new ServicePartitionKey(0)
            );
            var result = await proxy.GetAllAsync(userId);
            return Ok(result);
        }
    }
}