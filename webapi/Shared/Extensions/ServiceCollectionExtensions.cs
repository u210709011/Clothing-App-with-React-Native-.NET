using WebApi.Application.Interfaces;
using WebApi.Application.Services;

namespace WebApi.Shared.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<IFlashSaleService, FlashSaleService>();
        return services;
    }
}




