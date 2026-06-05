namespace Shared.Models
{
    public class ShareToken
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public string AccessType { get; set; }
        public DateTime ExpiresAt { get; set; }
        public int TravelPlanId { get; set; }

        public TravelPlan TravelPlan { get; set; }
    }
}