namespace Shared.Models
{
    public class ChecklistItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsCompleted { get; set; }
        public int TravelPlanId { get; set; }

        public TravelPlan TravelPlan { get; set; }
    }
}