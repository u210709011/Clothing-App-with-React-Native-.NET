namespace WebApi.Shared.Responses;

public record ApiResponse<T>(T? Data, List<ApiError>? Errors = null, string? Message = null);

public record ApiError(string Code, string Detail)
{
    public static ApiError NotFound(string detail) => new("not_found", detail);
    public static ApiError Validation(string detail) => new("validation_error", detail);
    public static ApiError Server(string detail) => new("server_error", detail);
}



