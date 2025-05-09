using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol;
using policy_backend.Data;

using System.Threading.Tasks;


namespace policy_portal_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class PolicyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PolicyController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        [HttpGet("findpolicy/{policyno}/{chassisno}")]
        public async Task<IActionResult> FindPolicy(string policyno, string chassisno)
        {
            try
            {
                int policyExists = 0;
                int chassisExists = 0;
                int policyVehicleExists = 0;
                IActionResult result = null;

                var connection = _context.Database.GetDbConnection();
                if (connection.State != System.Data.ConnectionState.Open)
                {
                    await connection.OpenAsync();
                }





                using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "SELECT COUNT(1) FROM policy WHERE PolicyNumber = @p0";
                        var param = command.CreateParameter();
                        param.ParameterName = "@p0";
                        param.Value = policyno;
                        command.Parameters.Add(param);

                        policyExists = Convert.ToInt32(await command.ExecuteScalarAsync());
                    }

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "SELECT COUNT(1) FROM vehicle WHERE ChasisNumber = @p0";
                        var param = command.CreateParameter();
                        param.ParameterName = "@p0";
                        param.Value = chassisno;
                        command.Parameters.Add(param);

                        chassisExists = Convert.ToInt32(await command.ExecuteScalarAsync());
                    }

                    
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = @"
                            SELECT COUNT(1) FROM policyvehicle pv
                            INNER JOIN vehicle v ON pv.VehicleId = v.VehicleId
                            INNER JOIN policy p ON pv.PolicyId = p.PolicyId
                            WHERE p.PolicyNumber = @p0 AND v.ChasisNumber = @p1";
                        var param1 = command.CreateParameter();
                        param1.ParameterName = "@p0";
                        param1.Value = policyno;
                        command.Parameters.Add(param1);

                        var param2 = command.CreateParameter();
                        param2.ParameterName = "@p1";
                        param2.Value = chassisno;
                        command.Parameters.Add(param2);

                        policyVehicleExists = Convert.ToInt32(await command.ExecuteScalarAsync());
                    }

                

                if (policyExists == 0 && chassisExists == 0)
                    return Ok(new { Message = "Policy and vehicle not found" });

                else if (policyExists == 0)
                    return Ok(new { Message = "Policy not found" });

                else if (chassisExists == 0)
                    return Ok(new { Message = "Vehicle not found" });

                else if (policyVehicleExists == 0)
                    return Ok(new { Message = "Policy and vehicle do not match" });
                
                     result = await basicDetails(chassisno, policyno);
                     connection.Close();

                return result;
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, new { Message = "Error occurred", Error = ex.Message });
            }
        }

        internal async Task<IActionResult> basicDetails (string chassisno, string policyno)
        {
            object vehicleDetails = null;
            object policyDetails = null;
            var connection = _context.Database.GetDbConnection();
            if (connection.State != System.Data.ConnectionState.Open)
            {
                await connection.OpenAsync();
            }




            using (var command = connection.CreateCommand()) { 
                
                    command.CommandText= @"SELECT RegistrationNumber,DateOfPurchase,ExShowroomPrice 
                                           FROM vehicle WHERE ChasisNumber = @p0";
                    var param = command.CreateParameter();
                    param.ParameterName = "@p0";
                    param.Value = chassisno;
                    command.Parameters.Add(param);


                    using (var read = await command.ExecuteReaderAsync() ) {

                        if (await read.ReadAsync()) {
                             vehicleDetails = new {

                                RegistrationNumber = read["RegistrationNumber"].ToString(),
                                DateOfPurchase = Convert.ToDateTime(read["DateOfPurchase"]),
                                ExShowroomPrice = Convert.ToDecimal(read["ExShowroomPrice"])
                            };
                        } 
                    }


                    
                }

                using (var command = connection.CreateCommand())
                {

                    command.CommandText = @"SELECT PolicyEffectiveDt, PolicyExpirationDt,TotalPremium
                                            FROM policy WHERE PolicyNumber = @p0";
                    var param = command.CreateParameter();
                    param.ParameterName = "@p0";
                    param.Value = policyno;
                    command.Parameters.Add(param);


                    using (var read = await command.ExecuteReaderAsync())
                    {

                        if (await read.ReadAsync())
                        {
                            policyDetails = new
                            {

                               
                                PolicyEffectiveDate = Convert.ToDateTime(read["PolicyEffectiveDt"]),
                                PolicyExpirationDate = Convert.ToDateTime(read["PolicyExpirationDt"]),
                                TotalPremium = Convert.ToDecimal(read["TotalPremium"])
                            };
                        }
                    }


                }
            
            return Ok(new
                {
                    Vehicle = vehicleDetails,
                    Policy = policyDetails
                });

            
        }
    }
}
