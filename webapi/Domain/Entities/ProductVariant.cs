namespace WebApi.Domain.Entities;

public class ProductVariant
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public List<string> Values { get; set; } = new();
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
}


