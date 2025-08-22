using WebApi.Application.Interfaces;
using WebApi.Application.DTOs;
using WebApi.Shared.Responses;
using WebApi.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using WebApi.Domain.Entities;
using System.Security.Claims;
using FirebaseAdmin.Auth;

namespace WebApi.Api.Endpoints;

public static class Endpoints
{
    public static IEndpointRouteBuilder MapV1(this IEndpointRouteBuilder app)
    {
        var api = app.MapGroup("/api/v1");


        api.MapGet("/health", () => Results.Ok(new ApiResponse<string>("OK")));

        api.MapGet("/whoami", (ClaimsPrincipal user) =>
        {
            if (!(user?.Identity?.IsAuthenticated ?? false))
            {
                return Results.Unauthorized();
            }

            var uid = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = user.FindFirst(ClaimTypes.Email)?.Value;
            var roles = user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
            var isAdmin = roles.Contains("Admin");

            return Results.Ok(new ApiResponse<object>(new { uid, email, roles, isAdmin }));
        }).RequireAuthorization();

        // API: ADMIN PING
        api.MapGet("/admin/ping", () => Results.Ok(new ApiResponse<string>("pong")))
            .RequireAuthorization("AdminOnly");

        // API: ADMIN LIST USERS (Firebase)
        api.MapGet("/admin/users", async (int limit = 200) =>
        {
            limit = Math.Clamp(limit, 1, 1000);
            var users = new List<AdminUserDto>();

            await foreach (var u in FirebaseAuth.DefaultInstance.ListUsersAsync(null))
            {
                string? role = null;
                if (u.CustomClaims != null && u.CustomClaims.TryGetValue("role", out var roleObj))
                {
                    role = roleObj?.ToString();
                }

                users.Add(new AdminUserDto(
                    u.Uid,
                    u.Email,
                    u.DisplayName,
                    u.PhotoUrl,
                    u.Disabled,
                    role,
                    u.UserMetaData?.CreationTimestamp,
                    u.UserMetaData?.LastSignInTimestamp
                ));

                if (users.Count >= limit) break;
            }

            return Results.Ok(new ApiResponse<List<AdminUserDto>>(users));
        }).RequireAuthorization("AdminOnly");

        // API: ADMIN CREATE USER
        api.MapPost("/admin/users", async (CreateAdminUserRequest req) =>
        {
            var args = new UserRecordArgs
            {
                Email = req.Email,
                EmailVerified = false,
                Password = req.Password,
                DisplayName = req.DisplayName,
                Disabled = false,
            };
            var created = await FirebaseAuth.DefaultInstance.CreateUserAsync(args);
            if (!string.IsNullOrWhiteSpace(req.Role))
            {
                await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(created.Uid, new Dictionary<string, object> { { "role", req.Role! } });
            }
            return Results.Created($"/api/v1/admin/users/{created.Uid}", new ApiResponse<object>(new { uid = created.Uid }));
        }).RequireAuthorization("AdminOnly");

        // API: ADMIN UPDATE USER
        api.MapPatch("/admin/users/{uid}", async (string uid, UpdateAdminUserRequest req) =>
        {
            if (req.DisplayName is not null || req.Disabled.HasValue)
            {
                var update = new UserRecordArgs
                {
                    Uid = uid,
                    DisplayName = req.DisplayName,
                    Disabled = req.Disabled ?? false,
                };
                await FirebaseAuth.DefaultInstance.UpdateUserAsync(update);
            }
            if (!string.IsNullOrWhiteSpace(req.Role))
            {
                await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(uid, new Dictionary<string, object> { { "role", req.Role! } });
            }
            return Results.NoContent();
        }).RequireAuthorization("AdminOnly");

        // API: ADMIN DELETE USER
        api.MapDelete("/admin/users/{uid}", async (string uid) =>
        {
            await FirebaseAuth.DefaultInstance.DeleteUserAsync(uid);
            return Results.NoContent();
        }).RequireAuthorization("AdminOnly");

        // API: GET CATEGORIES
        api.MapGet("/categories", async (ICategoryService categories) =>
        {
            var data = await categories.GetRootCategoriesAsync();
            return Results.Ok(new ApiResponse<List<CategoryDto>>(data));
        });

        // API: GET CATEGORY BY SLUG
        api.MapGet("/categories/{slug}", async (AppDbContext db, string slug) =>
        {
            var c = await db.Categories.FirstOrDefaultAsync(c => c.Slug == slug);
            if (c is null)
                return Results.NotFound(new ApiResponse<object>(null, new List<ApiError> { ApiError.NotFound($"Category '{slug}' not found.") }));
            var dto = new CategoryDto(c.Id.ToString(), c.Name, c.Slug, c.ImageUrl, c.Subtitle);
            return Results.Ok(new ApiResponse<CategoryDto>(dto));
        });


        // API: CREATE CATEGORY
        api.MapPost("/categories", async (ICategoryService categories, CreateCategoryRequest request) =>
        {
            var id = await categories.CreateCategoryAsync(request);
            return Results.Created($"/api/v1/categories/{id}", new ApiResponse<object>(new { id }));
        }).RequireAuthorization("AdminOnly");

        // API: UPDATE CATEGORY (also supports changing parent via ParentCategoryId)
        api.MapPut("/categories/{slug}", async (AppDbContext db, ICategoryService categories, string slug, CreateCategoryRequest request) =>
        {
            var c = await db.Categories.FirstOrDefaultAsync(c => c.Slug == slug);
            if (c is null)
                return Results.NotFound(new ApiResponse<object>(null, new List<ApiError> { ApiError.NotFound($"Category '{slug}' not found.") }));
            var ok = await categories.UpdateCategoryAsync(c.Id, request);
            return ok ? Results.NoContent() : Results.StatusCode(500);
        }).RequireAuthorization("AdminOnly");

        // API: DELETE CATEGORY
        api.MapDelete("/categories/{slug}", async (AppDbContext db, ICategoryService categories, string slug) =>
        {
            var c = await db.Categories.FirstOrDefaultAsync(c => c.Slug == slug);
            if (c is null)
                return Results.NotFound(new ApiResponse<object>(null, new List<ApiError> { ApiError.NotFound($"Category '{slug}' not found.") }));
            var ok = await categories.DeleteCategoryAsync(c.Id);
            return ok ? Results.NoContent() : Results.StatusCode(500);
        }).RequireAuthorization("AdminOnly");

        // API: GET SUBCATEGORIES
        api.MapGet("/categories/{slug}/subcategories", async (ICategoryService categories, string slug) =>
        {
            var data = await categories.GetSubcategoriesAsync(slug);
            return Results.Ok(new ApiResponse<List<CategoryDto>>(data));
        });

        // API: GET PRODUCTS
        api.MapGet("/products", async (
            IProductService products,
            string? category,
            string? subcategory,
            string? search,
            decimal? minPrice,
            decimal? maxPrice,
            string? sort,
            int page = 1,
            int pageSize = 20) =>
        {
            var data = await products.GetProductsAsync(category, subcategory, search, minPrice, maxPrice, sort, page, pageSize);
            return Results.Ok(new ApiResponse<PagedResponse<ProductListItemDto>>(data));
        });

        // API: GET PRODUCT DETAIL
        api.MapGet("/products/{id}", async (IProductService products, Guid id) =>
        {
            var p = await products.GetProductByIdAsync(id);
            return p is null
                ? Results.NotFound(new ApiResponse<object>(null, new List<ApiError> { ApiError.NotFound($"Product '{id}' not found.") }))
                : Results.Ok(new ApiResponse<ProductDetailDto>(p));
        });

        // API: CREATE PRODUCT
        api.MapPost("/products", async (IProductService products, CreateProductRequest request) =>
        {
            var id = await products.CreateProductAsync(request);
            return Results.Created($"/api/v1/products/{id}", new ApiResponse<object>(new { id }));
        }).RequireAuthorization("AdminOnly");

        // API: FULL UPDATE PRODUCT
        api.MapPut("/products/{id}", async (IProductService products, Guid id, CreateProductRequest request) =>
        {
            var ok = await products.UpdateProductAsync(id, request);
            return ok ? Results.NoContent() : Results.NotFound(new ApiResponse<object>(null, new List<ApiError> { ApiError.NotFound($"Product '{id}' not found.") }));
        }).RequireAuthorization("AdminOnly");

        // API: DELETE PRODUCT
        api.MapDelete("/products/{id}", async (IProductService products, Guid id) =>
        {
            var ok = await products.DeleteProductAsync(id);
            return ok ? Results.NoContent() : Results.NotFound(new ApiResponse<object>(null, new List<ApiError> { ApiError.NotFound($"Product '{id}' not found.") }));
        }).RequireAuthorization("AdminOnly");

        // API: GET PRODUCTS BY CATEGORY
        api.MapGet("/categories/{slug}/products", async (IProductService products, string slug, int page = 1, int pageSize = 20) =>
        {
            var data = await products.GetProductsByCategoryAsync(slug, page, pageSize);
            return Results.Ok(new ApiResponse<PagedResponse<ProductListItemDto>>(data));
        });
        
        // API: PARTIAL UPDATE PRODUCT IMAGEURL AND IMAGES
        // CHECK: chatgpt
        api.MapPatch("/products/{id}/images", async (AppDbContext db, Guid id, UpdateProductImagesRequest request) =>
        {
            var exists = await db.Products.AnyAsync(p => p.Id == id);
            if (!exists)
                return Results.NotFound(new ApiResponse<object>(null, new List<ApiError> { ApiError.NotFound($"Product '{id}' not found.") }));

            if (request.ImageUrl is not null)
            {
                await db.Products
                    .Where(p => p.Id == id)
                    .ExecuteUpdateAsync(setters => setters.SetProperty(p => p.ImageUrl, request.ImageUrl));
            }

            if (request.Images is not null)
            {
                await db.ProductImages.Where(pi => pi.ProductId == id).ExecuteDeleteAsync();

                if (request.Images.Count > 0)
                {
                    var newImages = request.Images.Select(url => new WebApi.Domain.Entities.ProductImage
                    {
                        ProductId = id,
                        Url = url
                    });
                    await db.ProductImages.AddRangeAsync(newImages);
                    await db.SaveChangesAsync();
                }
            }

            return Results.NoContent();
        }).RequireAuthorization("AdminOnly");


        // API: GET FLASH SALE
        api.MapGet("/flash-sale", (IFlashSaleService flashSale) => Results.Ok(new ApiResponse<FlashSaleDto>(flashSale.GetFlashSale())));

        // API: USER WISHLIST
        api.MapGet("/users/{userId}/wishlist", async (AppDbContext db, string userId) =>
        {
            var ids = await db.UserWishlistItems
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => x.ProductId.ToString())
                .ToListAsync();
            return Results.Ok(new ApiResponse<WishlistDto>(new WishlistDto(ids)));
        });

        api.MapPut("/users/{userId}/wishlist", async (AppDbContext db, string userId, SyncWishlistRequest request) =>
        {
            await db.UserWishlistItems.Where(x => x.UserId == userId).ExecuteDeleteAsync();
            if (request.ProductIds is not null && request.ProductIds.Count > 0)
            {
                var rows = request.ProductIds
                    .Distinct()
                    .Select(pid => new UserWishlistItem
                    {
                        UserId = userId,
                        ProductId = Guid.Parse(pid),
                        CreatedAt = DateTime.UtcNow
                    });
                await db.UserWishlistItems.AddRangeAsync(rows);
                await db.SaveChangesAsync();
            }
            return Results.NoContent();
        });

        // API: USER CART
        api.MapGet("/users/{userId}/cart", async (AppDbContext db, string userId) =>
        {
            var items = await db.UserCartItems
                .Where(x => x.UserId == userId)
                .Select(x => new CartItemDto(x.ProductId.ToString(), x.Quantity, x.VariantKey))
                .ToListAsync();
            return Results.Ok(new ApiResponse<CartDto>(new CartDto(items)));
        });

        api.MapPut("/users/{userId}/cart", async (AppDbContext db, string userId, SyncCartRequest request) =>
        {
            await db.UserCartItems.Where(x => x.UserId == userId).ExecuteDeleteAsync();
            if (request.Items is not null && request.Items.Count > 0)
            {
                var rows = request.Items.Select(i => new UserCartItem
                {
                    UserId = userId,
                    ProductId = Guid.Parse(i.ProductId),
                    Quantity = Math.Max(1, i.Quantity),
                    VariantKey = i.VariantKey ?? string.Empty,
                    UpdatedAt = DateTime.UtcNow
                });
                await db.UserCartItems.AddRangeAsync(rows);
                await db.SaveChangesAsync();
            }
            return Results.NoContent();
        });

        return app;
    }
}


