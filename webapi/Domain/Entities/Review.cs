namespace WebApi.Domain.Entities;

public class Review
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Author { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateOnly Date { get; set; }
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
}


