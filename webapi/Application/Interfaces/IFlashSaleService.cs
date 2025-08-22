namespace WebApi.Application.Interfaces;

public interface IFlashSaleService
{
    FlashSaleDto GetFlashSale();
}

public record FlashSaleDto(
    bool IsActive,
    DateTimeOffset EndTime,
    IDictionary<string, int> PerProductDiscountPercent,
    string Title,
    string Description
);



