using Microsoft.ServiceFabric.Services.Remoting;
using Shared.DTOs;

namespace Shared.Interfaces
{
    public interface IUserService : IService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto request);
        Task<AuthResponseDto> LoginAsync(LoginDto request);
    }
}