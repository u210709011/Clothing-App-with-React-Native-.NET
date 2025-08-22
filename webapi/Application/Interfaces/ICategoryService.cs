using WebApi.Application.DTOs;

namespace WebApi.Application.Interfaces;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetRootCategoriesAsync(CancellationToken ct = default);

    Task<Guid> CreateCategoryAsync(CreateCategoryRequest request, CancellationToken ct = default);

    Task<List<CategoryDto>> GetSubcategoriesAsync(string parentSlug, CancellationToken ct = default);

    Task<bool> UpdateCategoryAsync(Guid id, CreateCategoryRequest request, CancellationToken ct = default);
    Task<bool> DeleteCategoryAsync(Guid id, CancellationToken ct = default);
}



