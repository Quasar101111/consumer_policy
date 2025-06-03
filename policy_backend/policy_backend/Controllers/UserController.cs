using Microsoft.AspNetCore.Mvc;
using Business_Logic.Services;
using Data_Logic.Models;
using Humanizer;

namespace policy_portal_api.UserController
{
    [Route("api/[controller]")]
    [ApiController]

    public class UserController : Controller {
        private readonly UserServices _userServices;

        public UserController(UserServices userServices) {
            _userServices = userServices;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user) {
            var (success, message) = await _userServices.Register(user);
            if (!success)
            {
                return BadRequest(message);
            }
            return Ok(new { message });

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            var (success, token, username, message) = await _userServices.Login(loginDto);
            if (!success)
                return BadRequest(message);

            return Ok(new { token, username, message });
        }

        [HttpGet("check-username/{username}")]
        public async Task<IActionResult> CheckUsername(string username)
        {
            var (available, message) = await _userServices.CheckUsernameAvailability(username);
            if (!available)
                return Conflict(new { message });

            return Ok(new { message });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO dto)
        {
            var result = await _userServices.ChangePassword(dto.Username, dto.CurrentPassword, dto.NewPassword);
            
            return result switch
            {
                0 => Ok(new { Message = "Password changed successfully." }),
                1 => BadRequest(new { Message = "User not found or incorrect current password." }),
                2 => StatusCode(500, new { Message = "Failed to change the password. Try again later." }),
                _ => StatusCode(500, new { Message = "Unexpected error." }) 
            };
        }


    }
}