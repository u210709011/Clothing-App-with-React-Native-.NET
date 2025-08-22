namespace WebApi.Domain.Entities;

public class UserWishlistItem
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public string UserId { get; set; } = string.Empty;
	public Guid ProductId { get; set; }
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}


