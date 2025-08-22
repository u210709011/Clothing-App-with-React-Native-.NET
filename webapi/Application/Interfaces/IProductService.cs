using WebApi.Application.DTOs;

namespace WebApi.Application.Interfaces;

public interface IProductService
{
    Task<PagedResponse<ProductListItemDto>> GetProductsAsync(
        string? category,
        string? subcategory,
        string? search,
        decimal? minPrice,
        decimal? maxPrice,
        string? sort,
        int page,
        int pageSize,
        CancellationToken ct = default);

    Task<ProductDetailDto?> GetProductByIdAsync(Guid id, CancellationToken ct = default);

    Task<PagedResponse<ProductListItemDto>> GetProductsByCategoryAsync(
        string slug,
        int page,
        int pageSize,
        CancellationToken ct = default);

    Task<Guid> CreateProductAsync(CreateProductRequest request, CancellationToken ct = default);

    Task<bool> UpdateProductAsync(Guid id, CreateProductRequest request, CancellationToken ct = default);
    Task<bool> DeleteProductAsync(Guid id, CancellationToken ct = default);
}



