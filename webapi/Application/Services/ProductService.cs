using Microsoft.EntityFrameworkCore;
using WebApi.Application.DTOs;
using WebApi.Application.Interfaces;
using WebApi.Infrastructure.Persistence;
using WebApi.Infrastructure.Persistence.Extensions;

namespace WebApi.Application.Services;

public class ProductService(AppDbContext db, IFlashSaleService flashSale) : IProductService
{

    public async Task<PagedResponse<ProductListItemDto>> GetProductsAsync(
        string? category,
        string? subcategory,
        string? search,
        decimal? minPrice,
        decimal? maxPrice,
        string? sort,
        int page,
        int pageSize,
        CancellationToken ct = default)
    {
        var queryable = db.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.Subcategory)
            .AsQueryable()
            .ApplyCategory(category)
            .ApplySubcategory(subcategory)
            .ApplyPriceRange(minPrice, maxPrice)
            .ApplySearch(search)
            .ApplySort(sort, search);

        var total = await queryable.CountAsync(ct);
        var items = await queryable
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductListItemDto(
                p.Id.ToString(),
                p.Name,
                p.Slug,
                p.Category.Slug,
                p.Subcategory != null ? p.Subcategory.Slug : null,
                p.Price,
                p.OriginalPrice,
                p.DiscountPercent,
                false,
                db.Reviews.Where(r => r.ProductId == p.Id).Select(r => (decimal?)r.Rating).Average() ?? 0m,
                db.Reviews.Count(r => r.ProductId == p.Id),
                p.ImageUrl ?? p.Images.OrderBy(i => i.Id).Select(i => i.Url).FirstOrDefault()
            ))
            .ToListAsync(ct);

        var sale = flashSale.GetFlashSale();
        if (sale.IsActive)
        {
            var per = sale.PerProductDiscountPercent;
            items = items.Select(i =>
            {
                if (!per.TryGetValue(i.Slug, out var d) || d <= 0) return i;
                var basePrice = i.OriginalPrice ?? i.Price;
                var discounted = Math.Round(basePrice * (1 - d / 100m), 2);
                return new ProductListItemDto(
                    i.Id,
                    i.Name,
                    i.Slug,
                    i.Category,
                    i.Subcategory,
                    discounted,
                    basePrice,
                    d,
                    true,
                    i.Rating,
                    i.ReviewCount,
                    i.ImageUrl
                );
            }).ToList();
        }

        var response = new PagedResponse<ProductListItemDto>(items, page, pageSize, total);
        return response;
    }

    public async Task<ProductDetailDto?> GetProductByIdAsync(Guid id, CancellationToken ct = default)
    {
        var p = await db.Products
            .Include(x => x.Category)
            .Include(x => x.Subcategory)
            .Include(x => x.Images)
            .Include(x => x.Variants)
            .Include(x => x.Options)
            .Include(x => x.Reviews)
            .FirstOrDefaultAsync(x => x.Id == id, ct);
        if (p is null) return null;
        var derivedRating = p.Reviews.Count > 0 ? Math.Round(p.Reviews.Select(r => (decimal)r.Rating).Average(), 2) : 0m;
        var detail = new ProductDetailDto(
            p.Id.ToString(),
            p.Name,
            p.Slug,
            new CategoryDto(p.Category.Id.ToString(), p.Category.Name, p.Category.Slug, p.Category.ImageUrl, p.Category.Subtitle),
            p.Subcategory != null ? new CategoryDto(p.Subcategory.Id.ToString(), p.Subcategory.Name, p.Subcategory.Slug, p.Subcategory.ImageUrl, p.Subcategory.Subtitle) : null,
            p.Price,
            p.OriginalPrice,
            p.DiscountPercent,
            false,
            derivedRating,
            p.Description,
            p.ImageUrl,
            p.Images.Select(i => i.Url).ToList(),
            p.Variants.Select(v => new ProductVariantDto(v.Id.ToString(), v.Name, v.Values)).ToList(),
            p.Options.Select(o => new ProductOptionDto(o.Id.ToString(), o.Name, o.Value)).ToList(),
            p.Reviews.Select(r => new ReviewDto(r.Id.ToString(), r.Author, r.Rating, r.Comment, r.Date.ToString("yyyy-MM-dd"))).ToList()
        );

        var sale = flashSale.GetFlashSale();
        if (!sale.IsActive || !sale.PerProductDiscountPercent.TryGetValue(detail.Slug, out var d) || d <= 0)
            return detail;

        var basePrice = detail.OriginalPrice ?? detail.Price;
        var discounted = Math.Round(basePrice * (1 - d / 100m), 2);
        return detail with
        {
            Price = discounted,
            OriginalPrice = basePrice,
            DiscountPercent = d,
            IsFlashSale = true
        };
    }

    public async Task<PagedResponse<ProductListItemDto>> GetProductsByCategoryAsync(string slug, int page, int pageSize, CancellationToken ct = default)
    {
        var query = db.Products.Include(p => p.Category).Include(p => p.Subcategory).Where(p => p.Category.Slug == slug);
        var total = await query.CountAsync(ct);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductListItemDto(
                p.Id.ToString(), p.Name, p.Slug, p.Category.Slug,
                p.Subcategory != null ? p.Subcategory.Slug : null,
                p.Price, p.OriginalPrice, p.DiscountPercent, false,
                db.Reviews.Where(r => r.ProductId == p.Id).Select(r => (decimal?)r.Rating).Average() ?? 0m,
                db.Reviews.Count(r => r.ProductId == p.Id),
                p.ImageUrl ?? p.Images.OrderBy(i => i.Id).Select(i => i.Url).FirstOrDefault()))
            .ToListAsync(ct);
            
        var sale = flashSale.GetFlashSale();
        if (sale.IsActive)
        {
            var per = sale.PerProductDiscountPercent;
            items = items.Select(i =>
            {
                if (!per.TryGetValue(i.Slug, out var d) || d <= 0) return i;
                var basePrice = i.OriginalPrice ?? i.Price;
                var discounted = Math.Round(basePrice * (1 - d / 100m), 2);
                return new ProductListItemDto(
                    i.Id,
                    i.Name,
                    i.Slug,
                    i.Category,
                    i.Subcategory,
                    discounted,
                    basePrice,
                    d,
                    true,
                    i.Rating,
                    i.ReviewCount,
                    i.ImageUrl
                );
            }).ToList();
        }
        return new PagedResponse<ProductListItemDto>(items, page, pageSize, total);
    }

    public async Task<Guid> CreateProductAsync(CreateProductRequest request, CancellationToken ct = default)
    {
        var originalPrice = request.OriginalPrice ?? request.Price;
        var finalPrice = request.DiscountPercent.HasValue && request.DiscountPercent > 0
            ? Math.Round(originalPrice * (1 - request.DiscountPercent.Value / 100m), 2)
            : request.Price;

        var entity = new WebApi.Domain.Entities.Product
        {
            Name = request.Name,
            Slug = request.Slug,
            Category = await db.Categories.FirstAsync(c => c.Id == request.CategoryId, ct),
            Subcategory = request.SubcategoryId.HasValue ? await db.Categories.FirstOrDefaultAsync(c => c.Id == request.SubcategoryId.Value, ct) : null,
            Price = finalPrice,
            OriginalPrice = originalPrice,
            DiscountPercent = request.DiscountPercent,
            Rating = request.Rating,
            Description = request.Description ?? string.Empty,
            ImageUrl = request.ImageUrl
        };
        db.Products.Add(entity);
        if (request.Images is { Count: > 0 })
        {
            foreach (var url in request.Images)
            {
                entity.Images.Add(new WebApi.Domain.Entities.ProductImage { Url = url, Product = entity });
            }
        }
        if (request.Variants is { Count: > 0 })
        {
            foreach (var v in request.Variants)
            {
                entity.Variants.Add(new WebApi.Domain.Entities.ProductVariant { Name = v.Name, Values = v.Values.ToList(), Product = entity });
            }
        }
        if (request.Options is { Count: > 0 })
        {
            foreach (var o in request.Options)
            {
                entity.Options.Add(new WebApi.Domain.Entities.ProductOption { Name = o.Name, Value = o.Value, Product = entity });
            }
        }
        if (request.Reviews is { Count: > 0 })
        {
            foreach (var r in request.Reviews)
            {
                entity.Reviews.Add(new WebApi.Domain.Entities.Review { Author = r.Author, Rating = r.Rating, Comment = r.Comment, Date = DateOnly.Parse(r.Date), Product = entity });
            }
        }
        await db.SaveChangesAsync(ct);
        return entity.Id;
    }

    public async Task<bool> UpdateProductAsync(Guid id, CreateProductRequest request, CancellationToken ct = default)
    {
        var entity = await db.Products
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .Include(p => p.Options)
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Id == id, ct);
        if (entity is null) return false;

        var originalPrice = request.OriginalPrice ?? request.Price;
        var finalPrice = request.DiscountPercent.HasValue && request.DiscountPercent > 0
            ? Math.Round(originalPrice * (1 - request.DiscountPercent.Value / 100m), 2)
            : request.Price;

        entity.Name = request.Name;
        entity.Slug = request.Slug;
        entity.Category = await db.Categories.FirstAsync(c => c.Id == request.CategoryId, ct);
        entity.Subcategory = request.SubcategoryId.HasValue ? await db.Categories.FirstOrDefaultAsync(c => c.Id == request.SubcategoryId.Value, ct) : null;
        entity.Price = finalPrice;
        entity.OriginalPrice = originalPrice;
        entity.DiscountPercent = request.DiscountPercent;
        entity.Rating = request.Rating;
        entity.Description = request.Description ?? string.Empty;
        entity.ImageUrl = request.ImageUrl;

        if (request.Images is not null)
        {
            entity.Images.Clear();
            foreach (var url in request.Images)
            {
                entity.Images.Add(new WebApi.Domain.Entities.ProductImage { Url = url, Product = entity });
            }
        }
        if (request.Variants is not null)
        {
            entity.Variants.Clear();
            foreach (var v in request.Variants)
            {
                entity.Variants.Add(new WebApi.Domain.Entities.ProductVariant { Name = v.Name, Values = v.Values.ToList(), Product = entity });
            }
        }
        if (request.Options is not null)
        {
            entity.Options.Clear();
            foreach (var o in request.Options)
            {
                entity.Options.Add(new WebApi.Domain.Entities.ProductOption { Name = o.Name, Value = o.Value, Product = entity });
            }
        }
        if (request.Reviews is not null)
        {
            entity.Reviews.Clear();
            foreach (var r in request.Reviews)
            {
                entity.Reviews.Add(new WebApi.Domain.Entities.Review { Author = r.Author, Rating = r.Rating, Comment = r.Comment, Date = DateOnly.Parse(r.Date), Product = entity });
            }
        }

        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteProductAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await db.Products.FirstOrDefaultAsync(p => p.Id == id, ct);
        if (entity is null) return false;
        db.Products.Remove(entity);
        await db.SaveChangesAsync(ct);
        return true;
    }
}



