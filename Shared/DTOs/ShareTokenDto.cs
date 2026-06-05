namespace Shared.DTOs
{
    public class ShareTokenDto
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public string AccessType { get; set; }
        public DateTime ExpiresAt { get; set; }
        public int TravelPlanId { get; set; }
    }
}