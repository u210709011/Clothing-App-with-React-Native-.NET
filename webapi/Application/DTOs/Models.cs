namespace WebApi.Application.DTOs;

public record CategoryDto(string Id, string Name, string Slug, string? ImageUrl = null, string? Subtitle = null);

public record ProductListItemDto(
    string Id,
    string Name,
    string Slug,
    string Category,
    string? Subcategory,
    decimal Price,
    decimal? OriginalPrice,
    int? DiscountPercent,
    bool IsFlashSale,
    decimal Rating,
    int ReviewCount,
    string? ImageUrl = null
);

public record ProductDetailDto(
    string Id,
    string Name,
    string Slug,
    CategoryDto Category,
    CategoryDto? Subcategory,
    decimal Price,
    decimal? OriginalPrice,
    int? DiscountPercent,
    bool IsFlashSale,
    decimal Rating,
    string Description,
    string? ImageUrl,
    IReadOnlyList<string> Images,
    IReadOnlyList<ProductVariantDto> Variants,
    IReadOnlyList<ProductOptionDto> Options,
    IReadOnlyList<ReviewDto> Reviews
);

public record PagedResponse<T>(IReadOnlyList<T> Items, int Page, int PageSize, int Total);

public record ProductVariantDto(string Id, string Name, IReadOnlyList<string> Values);
public record ProductOptionDto(string Id, string Name, string Value);
public record ReviewDto(string Id, string Author, int Rating, string Comment, string Date);
public record WishlistDto(List<string> ProductIds);
public record CartItemDto(string ProductId, int Quantity, string VariantKey);
public record CartDto(List<CartItemDto> Items);
