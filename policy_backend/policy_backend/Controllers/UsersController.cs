using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using Business_Logic.Services;
using Data_Logic;
using Data_Logic.Models;


namespace policy_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        //private readonly UserServices _userServices ;
        private readonly ApplicationDbContext _context;
        private IConfiguration _config;

        public UsersController(ApplicationDbContext context, IConfiguration config)
        {
            //_userServices = userServices;
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {


            if (await _context.Users.AnyAsync(x => x.Email == user.Email))
            {
                return BadRequest("Email already exists");
            }


            // Hash the password
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            user.CreatedAt = DateTime.UtcNow;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully" });

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            var user = await _context.Users.FindAsync(loginDto.Username);

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            {
                return BadRequest("Invalid username or password");
            }

            return Ok(new
            {
                token = GenerateJwtToken(user),
                username = user.Username,

                message = "Login successful"
            });
        }



        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds);
            //var  tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            // Console.WriteLine("JWT Token: " + tokenString);

            return new JwtSecurityTokenHandler().WriteToken(token);
            //return tokenString;
        }

        [HttpGet("check-username/{username}")]
        public async Task<IActionResult> checkUsername(string username)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Username == username);

            if (userExists)
            {
                return Conflict(new { message = "Username already taken" });
                //return BadRequest(new {message= "Username already taken" });
            }

            return Ok(new { message = "Username available" });
        }
    }





}
