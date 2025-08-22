namespace WebApi.Domain.Entities;

public class UserCartItem
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public string UserId { get; set; } = string.Empty;
	public Guid ProductId { get; set; }
	public int Quantity { get; set; }
	public string VariantKey { get; set; } = string.Empty;
	public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}


