using Business_Logic.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace policy_portal_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class PolicyController : ControllerBase
    {
        private readonly PolicyServices _PolicyServices;

        public PolicyController(PolicyServices PolicyServices)
        {
            _PolicyServices = PolicyServices;
        }

        [HttpGet("findpolicy/{policyno}/{chassisno}")]
        public async Task<IActionResult> FindPolicy(string policyno, string chassisno)
        {
            try
            {

                var result = await _PolicyServices.FindPolicy(policyno, chassisno);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error occurred", Error = ex.Message });
            }




        }
        [HttpPost("addpolicy/{policyno}/{username}")]
        public async Task<IActionResult> AddPolicy(string policyno, string username)
        {
            try
            {

                var result = await _PolicyServices.AddUserPolicy(policyno, username);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error occurred", Error = ex.Message });
            }
        }


        [HttpGet("viewpolicyno/{username}")]
        public async Task<IActionResult> ViewPolicyNumber(string username) {
            var (success, message, result) = await _PolicyServices.ViewPolicyNo(username);

            if (!success)
                return NotFound(new { Message = message });

            return Ok(result);
        }

        
    }
}
