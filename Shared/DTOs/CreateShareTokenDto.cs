namespace Shared.DTOs
{
    public class CreateShareTokenDto
    {
        public string AccessType { get; set; }
        public int TravelPlanId { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}