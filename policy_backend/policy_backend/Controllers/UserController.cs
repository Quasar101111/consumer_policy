using Microsoft.AspNetCore.Mvc;
using Business_Logic.Services;
using Data_Logic.Models;

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

    }
}