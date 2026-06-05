using Microsoft.EntityFrameworkCore;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using Shared.Data;
using Shared.DTOs;
using Shared.Interfaces;
using Shared.Models;
using System.Fabric;

namespace TravelPlanService
{
    internal sealed class TravelPlanService : StatefulService, ITravelPlanService
    {
        private readonly string _connectionString = "Server=localhost\\SQLEXPRESS;Database=TravelPlannerDB;Trusted_Connection=True;TrustServerCertificate=True";

        public TravelPlanService(StatefulServiceContext context)
            : base(context) { }

        private AppDbContext CreateDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlServer(_connectionString)
                .Options;
            return new AppDbContext(options);
        }

        public async Task<List<TravelPlanDto>> GetAllAsync(int userId)
        {
            using var context = CreateDbContext();
            return await context.TravelPlans
                .Where(t => t.UserId == userId)
                .Select(t => MapToDto(t))
                .ToListAsync();
        }

        public async Task<TravelPlanDto> GetByIdAsync(int id)
        {
            using var context = CreateDbContext();
            var plan = await context.TravelPlans
                .Include(t => t.Destinations)
                .Include(t => t.Activities)
                .Include(t => t.Expenses)
                .Include(t => t.ChecklistItems)
                .FirstOrDefaultAsync(t => t.Id == id);

            return plan == null ? null : MapToDto(plan);
        }

        public async Task<TravelPlanDto> CreateAsync(CreateTravelPlanDto request, int userId)
        {
            using var context = CreateDbContext();
            var plan = new TravelPlan
            {
                Title = request.Title,
                Description = request.Description,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Budget = request.Budget,
                Notes = request.Notes,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            context.TravelPlans.Add(plan);
            await context.SaveChangesAsync();
            return MapToDto(plan);
        }

        public async Task<TravelPlanDto> UpdateAsync(int id, CreateTravelPlanDto request)
        {
            using var context = CreateDbContext();
            var plan = await context.TravelPlans.FindAsync(id);
            if (plan == null) return null;

            plan.Title = request.Title;
            plan.Description = request.Description;
            plan.StartDate = request.StartDate;
            plan.EndDate = request.EndDate;
            plan.Budget = request.Budget;
            plan.Notes = request.Notes;

            await context.SaveChangesAsync();
            return MapToDto(plan);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var context = CreateDbContext();
            var plan = await context.TravelPlans.FindAsync(id);
            if (plan == null) return false;

            context.TravelPlans.Remove(plan);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<DestinationDto> AddDestinationAsync(CreateDestinationDto request)
        {
            using var context = CreateDbContext();
            var destination = new Destination
            {
                Name = request.Name,
                Location = request.Location,
                ArrivalDate = request.ArrivalDate,
                DepartureDate = request.DepartureDate,
                Description = request.Description,
                TravelPlanId = request.TravelPlanId
            };

            context.Destinations.Add(destination);
            await context.SaveChangesAsync();
            return MapToDto(destination);
        }

        public async Task<DestinationDto> UpdateDestinationAsync(int id, CreateDestinationDto request)
        {
            using var context = CreateDbContext();
            var destination = await context.Destinations.FindAsync(id);
            if (destination == null) return null;

            destination.Name = request.Name;
            destination.Location = request.Location;
            destination.ArrivalDate = request.ArrivalDate;
            destination.DepartureDate = request.DepartureDate;
            destination.Description = request.Description;

            await context.SaveChangesAsync();
            return MapToDto(destination);
        }

        public async Task<bool> DeleteDestinationAsync(int id)
        {
            using var context = CreateDbContext();
            var destination = await context.Destinations.FindAsync(id);
            if (destination == null) return false;

            context.Destinations.Remove(destination);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<ActivityDto> AddActivityAsync(CreateActivityDto request)
        {
            using var context = CreateDbContext();
            var activity = new Activity
            {
                Name = request.Name,
                Date = request.Date,
                Time = request.Time,
                Location = request.Location,
                Description = request.Description,
                EstimatedCost = request.EstimatedCost,
                Status = request.Status,
                TravelPlanId = request.TravelPlanId
            };

            context.Activities.Add(activity);
            await context.SaveChangesAsync();
            return MapToDto(activity);
        }

        public async Task<ActivityDto> UpdateActivityAsync(int id, CreateActivityDto request)
        {
            using var context = CreateDbContext();
            var activity = await context.Activities.FindAsync(id);
            if (activity == null) return null;

            activity.Name = request.Name;
            activity.Date = request.Date;
            activity.Time = request.Time;
            activity.Location = request.Location;
            activity.Description = request.Description;
            activity.EstimatedCost = request.EstimatedCost;
            activity.Status = request.Status;

            await context.SaveChangesAsync();
            return MapToDto(activity);
        }

        public async Task<bool> DeleteActivityAsync(int id)
        {
            using var context = CreateDbContext();
            var activity = await context.Activities.FindAsync(id);
            if (activity == null) return false;

            context.Activities.Remove(activity);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<ExpenseDto> AddExpenseAsync(CreateExpenseDto request)
        {
            using var context = CreateDbContext();
            var expense = new Expense
            {
                Name = request.Name,
                Category = request.Category,
                Amount = request.Amount,
                Date = request.Date,
                Description = request.Description,
                TravelPlanId = request.TravelPlanId
            };

            context.Expenses.Add(expense);
            await context.SaveChangesAsync();
            return MapToDto(expense);
        }

        public async Task<ExpenseDto> UpdateExpenseAsync(int id, CreateExpenseDto request)
        {
            using var context = CreateDbContext();
            var expense = await context.Expenses.FindAsync(id);
            if (expense == null) return null;

            expense.Name = request.Name;
            expense.Category = request.Category;
            expense.Amount = request.Amount;
            expense.Date = request.Date;
            expense.Description = request.Description;

            await context.SaveChangesAsync();
            return MapToDto(expense);
        }

        public async Task<bool> DeleteExpenseAsync(int id)
        {
            using var context = CreateDbContext();
            var expense = await context.Expenses.FindAsync(id);
            if (expense == null) return false;

            context.Expenses.Remove(expense);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<ChecklistItemDto> AddChecklistItemAsync(CreateChecklistItemDto request)
        {
            using var context = CreateDbContext();
            var item = new ChecklistItem
            {
                Name = request.Name,
                IsCompleted = false,
                TravelPlanId = request.TravelPlanId
            };

            context.ChecklistItems.Add(item);
            await context.SaveChangesAsync();
            return MapToDto(item);
        }

        public async Task<bool> ToggleChecklistItemAsync(int id)
        {
            using var context = CreateDbContext();
            var item = await context.ChecklistItems.FindAsync(id);
            if (item == null) return false;

            item.IsCompleted = !item.IsCompleted;
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteChecklistItemAsync(int id)
        {
            using var context = CreateDbContext();
            var item = await context.ChecklistItems.FindAsync(id);
            if (item == null) return false;

            context.ChecklistItems.Remove(item);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<ShareTokenDto> CreateShareTokenAsync(CreateShareTokenDto request)
        {
            using var context = CreateDbContext();
            var shareToken = new ShareToken
            {
                Token = Guid.NewGuid().ToString(),
                AccessType = request.AccessType,
                ExpiresAt = request.ExpiresAt,
                TravelPlanId = request.TravelPlanId
            };

            context.ShareTokens.Add(shareToken);
            await context.SaveChangesAsync();
            return MapToDto(shareToken);
        }

        public async Task<TravelPlanDto> GetByShareTokenAsync(string token)
        {
            using var context = CreateDbContext();
            var shareToken = await context.ShareTokens
                .FirstOrDefaultAsync(s => s.Token == token && s.ExpiresAt > DateTime.UtcNow);

            if (shareToken == null) return null;

            return await GetByIdAsync(shareToken.TravelPlanId);
        }

        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
        {
            return this.CreateServiceRemotingReplicaListeners();
        }

        private static TravelPlanDto MapToDto(TravelPlan plan) => new TravelPlanDto
        {
            Id = plan.Id,
            Title = plan.Title,
            Description = plan.Description,
            StartDate = plan.StartDate,
            EndDate = plan.EndDate,
            Budget = plan.Budget,
            Notes = plan.Notes,
            CreatedAt = plan.CreatedAt,
            Destinations = plan.Destinations?.Select(d => MapToDto(d)).ToList(),
            Activities = plan.Activities?.Select(a => MapToDto(a)).ToList(),
            Expenses = plan.Expenses?.Select(e => MapToDto(e)).ToList(),
            ChecklistItems = plan.ChecklistItems?.Select(c => MapToDto(c)).ToList()
        };

        private static DestinationDto MapToDto(Destination d) => new DestinationDto
        {
            Id = d.Id,
            Name = d.Name,
            Location = d.Location,
            ArrivalDate = d.ArrivalDate,
            DepartureDate = d.DepartureDate,
            Description = d.Description,
            TravelPlanId = d.TravelPlanId
        };

        private static ActivityDto MapToDto(Activity a) => new ActivityDto
        {
            Id = a.Id,
            Name = a.Name,
            Date = a.Date,
            Time = a.Time,
            Location = a.Location,
            Description = a.Description,
            EstimatedCost = a.EstimatedCost,
            Status = a.Status,
            TravelPlanId = a.TravelPlanId
        };

        private static ExpenseDto MapToDto(Expense e) => new ExpenseDto
        {
            Id = e.Id,
            Name = e.Name,
            Category = e.Category,
            Amount = e.Amount,
            Date = e.Date,
            Description = e.Description,
            TravelPlanId = e.TravelPlanId
        };

        private static ChecklistItemDto MapToDto(ChecklistItem c) => new ChecklistItemDto
        {
            Id = c.Id,
            Name = c.Name,
            IsCompleted = c.IsCompleted,
            TravelPlanId = c.TravelPlanId
        };

        private static ShareTokenDto MapToDto(ShareToken s) => new ShareTokenDto
        {
            Id = s.Id,
            Token = s.Token,
            AccessType = s.AccessType,
            ExpiresAt = s.ExpiresAt,
            TravelPlanId = s.TravelPlanId
        };
    }
}