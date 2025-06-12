using Business_Logic.Services;
using Microsoft.AspNetCore.Authorization;
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

        [Authorize]
        [HttpGet("findpolicy/{policyno}/{chassisno}")]
        public async Task<IActionResult> FindPolicy(string policyno, string chassisno)
        {
            try
            {

                var result = await _PolicyServices.FindPolicy(policyno, chassisno);
                Console.WriteLine(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error occurred", Error = ex.Message });
            }




        }

        [Authorize]
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

        [Authorize]
        [HttpGet("viewpolicyno/{username}")]
        public async Task<IActionResult> ViewPolicyNumber(string username) {
            var (success, message, result) = await _PolicyServices.ViewPolicyNo(username);

            if (!success)
                return NotFound(new { Message = message });

            return Ok(result);
        }

        [Authorize]
        [HttpGet("policynostatus/{username}")]
        public async Task<IActionResult> ViewPolicyNoWithStatus(string username) {
            var (success, result) = await _PolicyServices.GetPolicyNumbersWithStatus(username);

            if (!success)
                return NotFound(new { Message = "No policy added" });

            return Ok(result);
        }

        [Authorize]
        [HttpPost("togglestatus")]
        public async Task<IActionResult> TogglePolicy([FromQuery] int id )
        {
            var success = await _PolicyServices.ToggleStatus(id);

            if (!success)
                return NotFound(new { Message = "Unable to change the status" });

            return Ok(success);
        }

        [Authorize]
        [HttpDelete("deletepolicy/{id}")]
        public async Task<IActionResult> DeletePolicy(int id)
        {
            var success = await _PolicyServices.DeletePolicy(id);

            if (!success)
                return NotFound(new { Message = "Policy not found or could not be deleted." });

            return Ok(new { Message = "Policy deleted successfully." });
        }

        [Authorize]
        [HttpGet("policydetails/{policyno}")]
        public async Task<IActionResult> PolicyDetails(string policyno)
        {
            try
            {

                var result = await _PolicyServices.PolicyDetails(policyno);
                Console.WriteLine(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error occurred", Error = ex.Message });
            }

        }

       


        }
}
 