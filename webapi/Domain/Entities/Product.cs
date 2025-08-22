namespace WebApi.Domain.Entities;

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Category Category { get; set; } = null!;
    public Category? Subcategory { get; set; }
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public int? DiscountPercent { get; set; }
    public decimal Rating { get; set; }

    public string? ImageUrl { get; set; }

    public List<ProductImage> Images { get; set; } = new();
    public List<ProductVariant> Variants { get; set; } = new();
    public List<ProductOption> Options { get; set; } = new();
    public List<Review> Reviews { get; set; } = new();
}



