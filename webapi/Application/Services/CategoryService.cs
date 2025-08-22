using Microsoft.EntityFrameworkCore;
using WebApi.Application.DTOs;
using WebApi.Application.Interfaces;
using WebApi.Infrastructure.Persistence;

namespace WebApi.Application.Services;

public class CategoryService(AppDbContext db) : ICategoryService
{
    public async Task<List<CategoryDto>> GetRootCategoriesAsync(CancellationToken ct = default)
    {
        return await db.Categories
            .Where(c => c.ParentCategoryId == null)
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto(c.Id.ToString(), c.Name, c.Slug, c.ImageUrl, c.Subtitle))
            .ToListAsync(ct);
    }

    public async Task<Guid> CreateCategoryAsync(CreateCategoryRequest request, CancellationToken ct = default)
    {
        var entity = new WebApi.Domain.Entities.Category
        {
            Name = request.Name,
            Slug = request.Slug,
            ParentCategoryId = request.ParentCategoryId,
            ImageUrl = request.ImageUrl,
            Subtitle = request.Subtitle
        };
        db.Categories.Add(entity);
        await db.SaveChangesAsync(ct);
        return entity.Id;
    }

    public async Task<List<CategoryDto>> GetSubcategoriesAsync(string parentSlug, CancellationToken ct = default)
    {
        var parent = await db.Categories.FirstOrDefaultAsync(c => c.Slug == parentSlug, ct);
        if (parent is null) return new List<CategoryDto>();
        return await db.Categories
            .Where(c => c.ParentCategoryId == parent.Id)
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto(c.Id.ToString(), c.Name, c.Slug, c.ImageUrl, c.Subtitle))
            .ToListAsync(ct);
    }

    public async Task<bool> UpdateCategoryAsync(Guid id, CreateCategoryRequest request, CancellationToken ct = default)
    {
        var entity = await db.Categories.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (entity is null) return false;
        entity.Name = request.Name;
        entity.Slug = request.Slug;
        entity.ParentCategoryId = request.ParentCategoryId;
        entity.ImageUrl = request.ImageUrl;
        entity.Subtitle = request.Subtitle;
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteCategoryAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await db.Categories.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (entity is null) return false;
        db.Categories.Remove(entity);
        await db.SaveChangesAsync(ct);
        return true;
    }
}



