using WebApi.Application.Interfaces;

namespace WebApi.Application.Services;

public class FlashSaleService : IFlashSaleService
{
    private static readonly FlashSaleDto Flash = new(
        IsActive: true,
        EndTime: DateTimeOffset.UtcNow.AddHours(24),
        PerProductDiscountPercent: new Dictionary<string, int>
        {
            ["red-summer-dress"] = 30,
            ["air-runner-sneaker"] = 25,
            ["city-tote-bag"] = 15
        },
        Title: "Flash Sale - Limited Time!",
        Description: "Up to 30% off selected items"
    );

    public FlashSaleDto GetFlashSale() => Flash;
}




