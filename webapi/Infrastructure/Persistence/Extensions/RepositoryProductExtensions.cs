using Microsoft.EntityFrameworkCore;
using WebApi.Domain.Entities;

namespace WebApi.Infrastructure.Persistence.Extensions;

public static class RepositoryProductExtensions
{
    public static IQueryable<Product> ApplyCategory(this IQueryable<Product> query, string? categorySlug)
    {
        if (string.IsNullOrWhiteSpace(categorySlug)) return query;
        return query.Where(p => p.Category.Slug == categorySlug);
    }

    public static IQueryable<Product> ApplySubcategory(this IQueryable<Product> query, string? subcategorySlug)
    {
        if (string.IsNullOrWhiteSpace(subcategorySlug)) return query;
        return query.Where(p => p.Subcategory != null && p.Subcategory.Slug == subcategorySlug);
    }

    public static IQueryable<Product> ApplyPriceRange(this IQueryable<Product> query, decimal? minPrice, decimal? maxPrice)
    {
        if (minPrice.HasValue) query = query.Where(p => p.Price >= minPrice.Value);
        if (maxPrice.HasValue) query = query.Where(p => p.Price <= maxPrice.Value);
        return query;
    }

    public static IQueryable<Product> ApplySearch(this IQueryable<Product> query, string? search)
    {
        if (string.IsNullOrWhiteSpace(search)) return query;
        var term = $"%{search.Trim()}%";

        return query.Where(p =>
            EF.Functions.ILike(p.Name, term) ||
            EF.Functions.ILike(p.Description, term) ||
            EF.Functions.ILike(p.Category.Name, term) ||
            (p.Subcategory != null && EF.Functions.ILike(p.Subcategory.Name, term))
        )
        ;
    }

    public static IQueryable<Product> ApplySort(this IQueryable<Product> query, string? sort, string? search)
    {
        if (!string.IsNullOrWhiteSpace(search) && string.IsNullOrWhiteSpace(sort))
        {
            var term = $"%{search.Trim()}%";

            return query.Select(p => new
            {
                Product = p,
                Relevance =
                    EF.Functions.ILike(p.Name, term) ? 4 :
                    EF.Functions.ILike(p.Category.Name, term) ? 3 :
                    (p.Subcategory != null && EF.Functions.ILike(p.Subcategory.Name, term)) ? 2 :
                    EF.Functions.ILike(p.Description, term) ? 1 : 0
            })
            .OrderByDescending(x => x.Relevance)
            .ThenBy(x => x.Product.Name)
            .Select(x => x.Product);
        }


        return sort switch
        {
            "price_asc" => query.OrderBy(p => p.Price),
            "price_desc" => query.OrderByDescending(p => p.Price),
            "name" => query.OrderBy(p => p.Name),
            "rating" => query.OrderByDescending(p => p.Rating).ThenBy(p => p.Name),
            "newest" => query.OrderByDescending(p => p.Id),
            _ => query.OrderBy(p => p.Name)
        };
    }
}