using System.Diagnostics;

namespace Shared.Models
{
    public class TravelPlan
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Budget { get; set; }
        public string Notes { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; }

        public User User { get; set; }
        public ICollection<Destination> Destinations { get; set; }
        public ICollection<Activity> Activities { get; set; }
        public ICollection<Expense> Expenses { get; set; }
        public ICollection<ChecklistItem> ChecklistItems { get; set; }
        public ICollection<ShareToken> ShareTokens { get; set; }
    }
}