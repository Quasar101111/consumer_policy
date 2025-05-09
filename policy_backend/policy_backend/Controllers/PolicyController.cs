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

                var result = await _PolicyServices.FindPolicyAsync(policyno, chassisno);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error occurred", Error = ex.Message });
            }




        }

        //internal async Task<IActionResult> basicDetails(string chassisno, string policyno)
        //{
        //    object vehicleDetails = null;
        //    object policyDetails = null;
        //    var connection = _context.Database.GetDbConnection();
        //    if (connection.State != System.Data.ConnectionState.Open)
        //    {
        //        await connection.OpenAsync();
        //    }




        //    using (var command = connection.CreateCommand())
        //    {

        //        command.CommandText = @"SELECT RegistrationNumber,DateOfPurchase,ExShowroomPrice 
        //                                   FROM vehicle WHERE ChasisNumber = @p0";
        //        var param = command.CreateParameter();
        //        param.ParameterName = "@p0";
        //        param.Value = chassisno;
        //        command.Parameters.Add(param);


        //        using (var read = await command.ExecuteReaderAsync())
        //        {

        //            if (await read.ReadAsync())
        //            {
        //                vehicleDetails = new
        //                {

        //                    RegistrationNumber = read["RegistrationNumber"].ToString(),
        //                    DateOfPurchase = Convert.ToDateTime(read["DateOfPurchase"]).Date,
        //                    ExShowroomPrice = Convert.ToDecimal(read["ExShowroomPrice"])
        //                };
        //            }
        //        }



        //    }

        //    using (var command = connection.CreateCommand())
        //    {

        //        command.CommandText = @"SELECT PolicyEffectiveDt, PolicyExpirationDt,TotalPremium
        //                                    FROM policy WHERE PolicyNumber = @p0";
        //        var param = command.CreateParameter();
        //        param.ParameterName = "@p0";
        //        param.Value = policyno;
        //        command.Parameters.Add(param);


        //        using (var read = await command.ExecuteReaderAsync())
        //        {

        //            if (await read.ReadAsync())
        //            {
        //                policyDetails = new
        //                {


        //                    PolicyEffectiveDate = Convert.ToDateTime(read["PolicyEffectiveDt"]).ToString("yyyy-MM-dd"),
        //                    PolicyExpirationDate = Convert.ToDateTime(read["PolicyExpirationDt"]).ToString("yyyy-MM-dd"),
        //                    TotalPremium = Convert.ToDecimal(read["TotalPremium"])
        //                };
        //            }
        //        }


        //    }

        //    return Ok(new
        //    {
        //        Vehicle = vehicleDetails,
        //        Policy = policyDetails
        //    });


        
    }
}
