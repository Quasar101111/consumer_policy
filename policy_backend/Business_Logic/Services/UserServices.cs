using System;
using System.Collections.Generic;
using System.Linq;
using Data_Logic.Models;
using Data_Logic.Repository;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Business_Logic.Services
{
    public class UserServices : IUserServices
    {
        private readonly IUserRepository _repository;
        private readonly IConfiguration _config;

        public UserServices(IUserRepository repository, IConfiguration configuration)
        {
            _repository = repository;
            _config = configuration;
        }
        public async Task<(bool success, string message)> Register(User user)
        {
            if (await _repository.EmailExists(user.Email))
            {

                return (false, "Email already exists");
            }
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.CreatedAt = DateTime.UtcNow;
            user.role = 1;

            await _repository.CreateUser(user);
            return (true, "User registered successfully");
        }
        public async Task<(bool success, string? token, string? username, string? message)> Login(LoginDTO loginDTO)
        {

            var user = await _repository.FindByUsername(loginDTO.Username);

            if (user == null)
            {
                return (false, null, null, "Invalid username or password");
            }
            bool passwordMatch = BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.Password);
            if (!passwordMatch)
            {
                return (false, null, null, "Invalid username or password");

            }
          
            var role = await _repository.GetRole(role:user.role);
            Console.WriteLine($"role{ role}");
            var token = GenerateJwtToken(user,role);
            
            return (true, token, user.Username, "Login Successful");


        }
        public async Task<(bool available, string message)> CheckUsernameAvailability(string username)
        {
            var exists = await _repository.UserNameExists(username);
            var message = "";
            if (exists)
            {
                message = "Username already taken";
            }
            else
            {
                message = "Username available";
            }
            return (!exists, message);
        }



        public async Task<int> ChangePassword(string username, string oldPassword, string newPassword)
        {
            var user = await _repository.FindByUsername(username);

            if (user == null)
            {
                return 1;
            }
            bool passwordMatch = BCrypt.Net.BCrypt.Verify(oldPassword, user.Password);
            if (!passwordMatch)
            {
                return 1;
            }
            user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
            bool result = await _repository.ChangePassword(user);


            if (result)
            {
                return 0;
            }
            else
            {
                return 2;
            }
        }
        private string GenerateJwtToken(User user, string role)
        {

            var claims = new[] {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(ClaimTypes.Role, role)

            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
               issuer: _config["Jwt:Issuer"],
               audience: _config["Jwt:Audience"],
               claims: claims,
               expires: DateTime.UtcNow.AddHours(2),
               signingCredentials: creds
           );
            return new JwtSecurityTokenHandler().WriteToken(token);


        }


    }
}
