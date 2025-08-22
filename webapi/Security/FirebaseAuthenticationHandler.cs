using System.Security.Claims;
using System.Text.Encodings.Web;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace WebApi.Security;

public sealed class FirebaseAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public const string SchemeName = "Firebase";

    public FirebaseAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder) : base(options, logger, encoder)
    {
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var authHeader = Request.Headers["Authorization"].ToString();
        if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            return AuthenticateResult.NoResult();
        }

        var idToken = authHeader.Substring("Bearer ".Length).Trim();
        if (string.IsNullOrWhiteSpace(idToken))
        {
            return AuthenticateResult.Fail("Missing token");
        }

        try
        {
            if (FirebaseApp.DefaultInstance is null)
            {
                var config = Context.RequestServices.GetRequiredService<IConfiguration>();
                var configuredPath = config.GetValue<string>("Firebase:CredentialsPath");
                var envPath = Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS");
                if (!string.IsNullOrWhiteSpace(configuredPath))
                {
                    FirebaseApp.Create(new AppOptions
                    {
                        Credential = GoogleCredential.FromFile(configuredPath)
                    });
                }
                else if (!string.IsNullOrWhiteSpace(envPath))
                {
                    FirebaseApp.Create(new AppOptions
                    {
                        Credential = GoogleCredential.FromFile(envPath)
                    });
                }
                else
                {
                    FirebaseApp.Create();
                }
            }

            var decoded = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, decoded.Uid)
            };

            if (decoded.Claims.TryGetValue("email", out var emailObj) && emailObj is string emailStr)
            {
                claims.Add(new Claim(ClaimTypes.Email, emailStr));
            }

            if (decoded.Claims.TryGetValue("role", out var roleObj) && roleObj is string roleStr && !string.IsNullOrWhiteSpace(roleStr))
            {
                claims.Add(new Claim(ClaimTypes.Role, roleStr));
            }


            var identity = new ClaimsIdentity(claims, SchemeName);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, SchemeName);
            return AuthenticateResult.Success(ticket);
        }
        catch (Exception ex)
        {
            return AuthenticateResult.Fail(ex);
        }
    }
}


