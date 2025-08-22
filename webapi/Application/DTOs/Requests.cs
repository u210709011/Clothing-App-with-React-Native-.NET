namespace WebApi.Application.DTOs;

public record CreateCategoryRequest(string Name, string Slug, Guid? ParentCategoryId, string? ImageUrl = null, string? Subtitle = null);

public record CreateProductRequest(
    string Name,
    string Slug,
    Guid CategoryId,
    Guid? SubcategoryId,
    decimal Price,
    decimal? OriginalPrice,
    int? DiscountPercent,
    decimal Rating,
    string? Description = null,
    string? ImageUrl = null,
    IReadOnlyList<string>? Images = null,
    IReadOnlyList<CreateProductVariantRequest>? Variants = null,
    IReadOnlyList<CreateProductOptionRequest>? Options = null,
    IReadOnlyList<CreateReviewRequest>? Reviews = null
);

public record CreateProductVariantRequest(string Name, IReadOnlyList<string> Values);
public record CreateProductOptionRequest(string Name, string Value);
public record CreateReviewRequest(string Author, int Rating, string Comment, string Date);

public record UpdateProductImagesRequest(
    string? ImageUrl,
    IReadOnlyList<string>? Images
);

public record SyncWishlistRequest(List<string> ProductIds);
public record CartItemEntry(string ProductId, int Quantity, string VariantKey);
public record SyncCartRequest(List<CartItemEntry> Items);
