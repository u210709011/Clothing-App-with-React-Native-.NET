namespace WebApi.Application.DTOs;

public record AdminUserDto(
    string Uid,
    string? Email,
    string? DisplayName,
    string? PhotoUrl,
    bool Disabled,
    string? Role,
    DateTime? CreatedAt,
    DateTime? LastSignInAt
);

public record CreateAdminUserRequest(
    string Email,
    string Password,
    string? DisplayName,
    string? Role
);

public record UpdateAdminUserRequest(
    string? DisplayName,
    bool? Disabled,
    string? Role
);


