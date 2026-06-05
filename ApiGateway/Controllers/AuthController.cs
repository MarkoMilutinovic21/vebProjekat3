using Shared.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Shared.DTOs;
using Shared.Interfaces;

namespace ApiGateway.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            var proxy = ServiceProxy.Create<IUserService>(
                new Uri("fabric:/TravelPlannerApp/UserService")
            );

            var result = await proxy.RegisterAsync(request);

            if (result == null)
                return BadRequest("User already exists.");

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            var proxy = ServiceProxy.Create<IUserService>(
                new Uri("fabric:/TravelPlannerApp/UserService")
            );

            var result = await proxy.LoginAsync(request);

            if (result == null)
                return Unauthorized("Invalid credentials.");

            return Ok(result);
        }
    }
}