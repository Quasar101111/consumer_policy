
using Microsoft.EntityFrameworkCore;
using System;
using System.Data.Common;
using System.Threading.Tasks;

using policy_backend.Data;

namespace Data_Logic.Repository
{
    public class PolicyRepository
    {

        private readonly ApplicationDbContext _context;

        public PolicyRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> CheckPolicyExists(string policyno)
        {
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

                return Convert.ToInt32(await command.ExecuteScalarAsync());
            }
        }

        public async Task<int> CheckChassisExists(string chassisno)
        {
            var connection = _context.Database.GetDbConnection();
            if (connection.State != System.Data.ConnectionState.Open)
            {
                await connection.OpenAsync();
            }

            using (var command = connection.CreateCommand())
            {
                command.CommandText = "SELECT COUNT(1) FROM vehicle WHERE ChasisNumber = @p0";
                var param = command.CreateParameter();
                param.ParameterName = "@p0";
                param.Value = chassisno;
                command.Parameters.Add(param);

                return Convert.ToInt32(await command.ExecuteScalarAsync());
            }
        }

        public async Task<int> CheckPolicyVehicleExists(string policyno, string chassisno)
        {
            var connection = _context.Database.GetDbConnection();
            if (connection.State != System.Data.ConnectionState.Open)
            {
                await connection.OpenAsync();
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

                return Convert.ToInt32(await command.ExecuteScalarAsync());
            }
        }

        public async Task<object> GetBasicDetails(string policyno, string chassisno)
        {
            object vehicleDetails = null;
            object policyDetails = null;
            var connection = _context.Database.GetDbConnection();
            if (connection.State != System.Data.ConnectionState.Open)
            {
                await connection.OpenAsync();
            }

            using (var command = connection.CreateCommand())
            {
                command.CommandText = @"SELECT RegistrationNumber, DateOfPurchase, ExShowroomPrice 
                                        FROM vehicle WHERE ChasisNumber = @p0";
                var param = command.CreateParameter();
                param.ParameterName = "@p0";
                param.Value = chassisno;
                command.Parameters.Add(param);

                using (var read = await command.ExecuteReaderAsync())
                {
                    if (await read.ReadAsync())
                    {
                        vehicleDetails = new
                        {
                            RegistrationNumber = read["RegistrationNumber"].ToString(),
                            DateOfPurchase = Convert.ToDateTime(read["DateOfPurchase"]).Date,
                            ExShowroomPrice = Convert.ToDecimal(read["ExShowroomPrice"])
                        };
                    }
                }
            }

            using (var command = connection.CreateCommand())
            {
                command.CommandText = @"SELECT PolicyEffectiveDt, PolicyExpirationDt, TotalPremium
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
                            PolicyEffectiveDate = Convert.ToDateTime(read["PolicyEffectiveDt"]).ToString("yyyy-MM-dd"),
                            PolicyExpirationDate = Convert.ToDateTime(read["PolicyExpirationDt"]).ToString("yyyy-MM-dd"),
                            TotalPremium = Convert.ToDecimal(read["TotalPremium"])
                        };
                    }
                }
            }

            return new
            {
                Vehicle = vehicleDetails,
                Policy = policyDetails
            };
        }
    }
}
