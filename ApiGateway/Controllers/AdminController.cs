using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Shared.Interfaces;
using Shared.Models;

namespace ApiGateway.Controllers
{
    [Authorize(Roles = "admin")]
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly string _connectionString = "Server=localhost\\SQLEXPRESS;Database=UserDB;Trusted_Connection=True;TrustServerCertificate=True";

        private Shared.Data.UserDbContext CreateUserDbContext()
        {
            var options = new DbContextOptionsBuilder<Shared.Data.UserDbContext>()
                .UseSqlServer(_connectionString)
                .Options;
            return new Shared.Data.UserDbContext(options);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            using var context = CreateUserDbContext();
            var users = await context.Users
                .Select(u => new { u.Id, u.Name, u.Email, u.Role, u.CreatedAt })
                .ToListAsync();
            return Ok(users);
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            using var context = CreateUserDbContext();
            var user = await context.Users.FindAsync(id);
            if (user == null) return NotFound();
            context.Users.Remove(user);
            await context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> ChangeUserRole(int id, [FromBody] string role)
        {
            using var context = CreateUserDbContext();
            var user = await context.Users.FindAsync(id);
            if (user == null) return NotFound();
            user.Role = role;
            await context.SaveChangesAsync();
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
            if (!success) return NotFound();
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