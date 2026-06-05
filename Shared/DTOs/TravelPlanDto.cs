namespace Shared.DTOs
{
    public class TravelPlanDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Budget { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<DestinationDto> Destinations { get; set; }
        public List<ActivityDto> Activities { get; set; }
        public List<ExpenseDto> Expenses { get; set; }
        public List<ChecklistItemDto> ChecklistItems { get; set; }
    }
}