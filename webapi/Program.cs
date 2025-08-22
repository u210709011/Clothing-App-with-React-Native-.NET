using WebApi.Shared.Extensions;
using WebApi.Api.Endpoints;
using Microsoft.EntityFrameworkCore;
using WebApi.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication;
using WebApi.Security;
using System.IO;


var builder = WebApplication.CreateBuilder(args);

// INFO: Load .env
try
{
    string? rootEnv = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", ".env");
    string? webapiEnv = Path.Combine(AppContext.BaseDirectory, ".env");
    foreach (var path in new[] { rootEnv, webapiEnv })
    {
        if (path is null) continue;
        try
        {
            var full = Path.GetFullPath(path);
            if (File.Exists(full))
            {
                foreach (var line in File.ReadAllLines(full))
                {
                    var trimmed = line.Trim();
                    if (string.IsNullOrWhiteSpace(trimmed) || trimmed.StartsWith("#")) continue;
                    var idx = trimmed.IndexOf('=');
                    if (idx <= 0) continue;
                    var key = trimmed.Substring(0, idx).Trim();
                    var val = trimmed.Substring(idx + 1).Trim().Trim('"');
                    Environment.SetEnvironmentVariable(key, val);
                }
                break;
            }
        }
        catch { }
    }
}
catch { }

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddApplication();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = FirebaseAuthenticationHandler.SchemeName;
    options.DefaultChallengeScheme = FirebaseAuthenticationHandler.SchemeName;
})
.AddScheme<AuthenticationSchemeOptions, FirebaseAuthenticationHandler>(FirebaseAuthenticationHandler.SchemeName, _ => { })
.AddScheme<AuthenticationSchemeOptions, ApiKeyAuthenticationHandler>(ApiKeyAuthenticationHandler.SchemeName, _ => { });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

// INFO: Apply pending migrations once on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.MapV1();

app.Run();
