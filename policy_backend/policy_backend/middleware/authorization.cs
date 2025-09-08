using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;

namespace policy_portal_api.middleware
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class authorization_middleware
    {
        private readonly RequestDelegate _next;
       

        public authorization_middleware(RequestDelegate next)
        {
            _next = next;
           
        }

        public async Task Invoke(HttpContext httpContext)
        {
            
           var path = httpContext.Request.Path;
            if (!AdminAccess(path))
            {
                await _next(httpContext);
                return;
            }
            var role = httpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(role) || role != "admin")
            {
                httpContext.Response.StatusCode = StatusCodes.Status403Forbidden;
                await httpContext.Response.WriteAsJsonAsync(new { message = "Forbidden: Admin access required" });
                return;
            }

            await _next(httpContext);
        }
        

      

        private bool AdminAccess(string? path) {

            if (string.IsNullOrEmpty(path)) return false;
            List<string> enabled_routes = new List<string> { 
                "/api/Policy/admin-panel/","/api/Users/admin-panel"
            
            };
             
            return enabled_routes.Any(route=>path.StartsWith(route, StringComparison.OrdinalIgnoreCase));
            
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder UseAuthorizationMiddleware(this IApplicationBuilder builder)
        {
          
            return builder.UseMiddleware<authorization_middleware>();
        }
    }
}
