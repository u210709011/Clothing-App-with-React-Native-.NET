using Microsoft.EntityFrameworkCore;

namespace WebApi.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<WebApi.Domain.Entities.Product> Products => Set<WebApi.Domain.Entities.Product>();
    public DbSet<WebApi.Domain.Entities.Category> Categories => Set<WebApi.Domain.Entities.Category>();
    public DbSet<WebApi.Domain.Entities.ProductImage> ProductImages => Set<WebApi.Domain.Entities.ProductImage>();
    public DbSet<WebApi.Domain.Entities.ProductVariant> ProductVariants => Set<WebApi.Domain.Entities.ProductVariant>();
    public DbSet<WebApi.Domain.Entities.ProductOption> ProductOptions => Set<WebApi.Domain.Entities.ProductOption>();
    public DbSet<WebApi.Domain.Entities.Review> Reviews => Set<WebApi.Domain.Entities.Review>();
    public DbSet<WebApi.Domain.Entities.UserWishlistItem> UserWishlistItems => Set<WebApi.Domain.Entities.UserWishlistItem>();
    public DbSet<WebApi.Domain.Entities.UserCartItem> UserCartItems => Set<WebApi.Domain.Entities.UserCartItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<WebApi.Domain.Entities.Category>()
            .HasIndex(c => c.Slug)
            .IsUnique();

        modelBuilder.Entity<WebApi.Domain.Entities.Product>()
            .HasIndex(p => p.Slug)
            .IsUnique();
    }
}

