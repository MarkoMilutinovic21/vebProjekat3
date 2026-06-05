using Microsoft.ServiceFabric.Services.Remoting;
using Shared.DTOs;

namespace Shared.Interfaces
{
    public interface ITravelPlanService : IService
    {
        Task<List<TravelPlanDto>> GetAllAsync(int userId);
        Task<TravelPlanDto> GetByIdAsync(int id);
        Task<TravelPlanDto> CreateAsync(CreateTravelPlanDto request, int userId);
        Task<TravelPlanDto> UpdateAsync(int id, CreateTravelPlanDto request);
        Task<bool> DeleteAsync(int id);

        Task<DestinationDto> AddDestinationAsync(CreateDestinationDto request);
        Task<DestinationDto> UpdateDestinationAsync(int id, CreateDestinationDto request);
        Task<bool> DeleteDestinationAsync(int id);

        Task<ActivityDto> AddActivityAsync(CreateActivityDto request);
        Task<ActivityDto> UpdateActivityAsync(int id, CreateActivityDto request);
        Task<bool> DeleteActivityAsync(int id);

        Task<ExpenseDto> AddExpenseAsync(CreateExpenseDto request);
        Task<ExpenseDto> UpdateExpenseAsync(int id, CreateExpenseDto request);
        Task<bool> DeleteExpenseAsync(int id);

        Task<ChecklistItemDto> AddChecklistItemAsync(CreateChecklistItemDto request);
        Task<bool> ToggleChecklistItemAsync(int id);
        Task<bool> DeleteChecklistItemAsync(int id);

        Task<ShareTokenDto> CreateShareTokenAsync(CreateShareTokenDto request);
        Task<TravelPlanDto> GetByShareTokenAsync(string token);
    }
}