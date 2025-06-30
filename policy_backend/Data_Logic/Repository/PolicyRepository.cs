
using Microsoft.EntityFrameworkCore;
using System;
using System.Data.Common;
using System.Threading.Tasks;


using Data_Logic;
using Data_Logic.Models;
using Data_Logic.Model;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Data_Logic.Repository
{
    public class PolicyRepository : IPolicyRepository
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
                command.CommandText = "SELECT COUNT(1) FROM Masterpolicy WHERE PolicyNumber = @p0";
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
                command.CommandText = "SELECT COUNT(1) FROM Mastervehicle WHERE ChasisNumber = @p0";
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
                    SELECT COUNT(1)
                    FROM masterpolicyvehicle pv
                    INNER JOIN masterpolicy p ON pv.MasterPolicyId = p.MasterPolicyId
                    INNER JOIN mastervehicle v ON pv.MasterVehicleId = v.MasterVehicleId
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
                command.CommandText = @"SELECT RegistrationNumber,DateOfPurchase,ExShowroomPrice
                                        FROM mastervehicle WHERE ChasisNumber = @p0";
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
                command.CommandText = @"SELECT PolicyEffectiveDt,PolicyExpirationDt,TotalPremium
                                       FROM masterpolicy WHERE PolicyNumber = @p0";
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
            Console.WriteLine(policyDetails);
            Console.WriteLine(vehicleDetails);
            return new
            {
                Vehicle = vehicleDetails,
                Policy = policyDetails
            };
        }

        public async Task<String> GetUserId(string username)
        {

            var connection = _context.Database.GetDbConnection();
            if (connection.State != System.Data.ConnectionState.Open)
            {
                await connection.OpenAsync();
            }

            using (var command = connection.CreateCommand())
            {
                command.CommandText = @"
                            SELECT UserId FROM portal_user 
                            WHERE Username = @p0";

                var param1 = command.CreateParameter();
                param1.ParameterName = "@p0";
                param1.Value = username;
                command.Parameters.Add(param1);



                using (var read = await command.ExecuteReaderAsync())
                {

                    //    return await read.ReadAsync() ? read["UserId"].ToString() : null;

                    var hasRows = await read.ReadAsync();
                    var result = hasRows ? read["UserId"].ToString() : null;

                    Console.WriteLine($"GetUserId: Query executed for username '{username}', Result: {result ?? "not found"}");

                    return result;
                }


            }



        }

        public async Task<int> AddPolicy(string policyno, string userid)
        {
            try
            {
                //Console.WriteLine($"Inserting into portal_userpolicylist: UserId = {userid}, PolicyNumber = {policyno}");

                var connection = _context.Database.GetDbConnection();
                if (connection.State != System.Data.ConnectionState.Open)
                {
                    await connection.OpenAsync();
                }


                using (var checkCmd = connection.CreateCommand())
                {
                    checkCmd.CommandText = @"
                    SELECT Status FROM portal_userpolicylist 
                    WHERE UserId = @userId AND PolicyNumber = @policyNo";

                    var userParam = checkCmd.CreateParameter();
                    userParam.ParameterName = "@userId";
                    userParam.Value = userid;
                    checkCmd.Parameters.Add(userParam);

                    var policyParam = checkCmd.CreateParameter();
                    policyParam.ParameterName = "@policyNo";
                    policyParam.Value = policyno;
                    checkCmd.Parameters.Add(policyParam);

                    var status = await checkCmd.ExecuteScalarAsync();

                    if (status != null && status.ToString() != "Active")
                    {

                        using (var updateCmd = connection.CreateCommand())
                        {
                            updateCmd.CommandText = @"
                    UPDATE portal_userpolicylist
                    SET Status = 'Active'
                    WHERE UserId = @userId AND PolicyNumber = @policyNo";

                            var updateId = updateCmd.CreateParameter();
                            updateId.ParameterName = "@userId";
                            updateId.Value = userid;
                            updateCmd.Parameters.Add(updateId);

                            var updatePolicyParam = updateCmd.CreateParameter();
                            updatePolicyParam.ParameterName = "@policyNo";
                            updatePolicyParam.Value = policyno;
                            updateCmd.Parameters.Add(updatePolicyParam);

                            await updateCmd.ExecuteNonQueryAsync();
                            return 1;
                        }
                    }
                    else if (status != null && status.ToString() == "Active")
                    {
                        return 2;
                    }

                    else
                    {


                        using (var insertCmd = connection.CreateCommand())
                        {
                            insertCmd.CommandText = @"
                                INSERT INTO portal_userpolicylist (UserId, PolicyNumber, Status)
                                VALUES (@userId, @policyNo, 'Active')";

                            var insertUserParam = insertCmd.CreateParameter();
                            insertUserParam.ParameterName = "@userId";
                            insertUserParam.Value = userid;
                            insertCmd.Parameters.Add(insertUserParam);

                            var insertPolicyParam = insertCmd.CreateParameter();
                            insertPolicyParam.ParameterName = "@policyNo";
                            insertPolicyParam.Value = policyno;
                            insertCmd.Parameters.Add(insertPolicyParam);

                            return await insertCmd.ExecuteNonQueryAsync();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AddUserPolicy: {ex}");
                throw;
            }



        }

        public async Task<List<string>> ViewPolicyNumber(string userid)
        {
            try
            {
                var connection = _context.Database.GetDbConnection();
                if (connection.State != System.Data.ConnectionState.Open)
                {
                    await connection.OpenAsync();
                }

                var policyNumbers = new List<string>();


                using (var readCmd = connection.CreateCommand())
                {

                    readCmd.CommandText = @"
                        SELECT PolicyNumber FROM portal_userpolicylist
                        WHERE UserId = @p1 AND Status = 'Active'
                    ";
                    var param = readCmd.CreateParameter();
                    param.ParameterName = "@p1";
                    param.Value = userid;
                    readCmd.Parameters.Add(param);


                    using (var reader = await readCmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            policyNumbers.Add(reader["PolicyNumber"].ToString());
                        }
                    }
                }
                return policyNumbers;


            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;

            }
        }






        public async Task<bool> ToggleStatus(int id)
        {
            try
            {

                var status = "";
                using (var connection = _context.Database.GetDbConnection())
                {
                    if (connection.State != System.Data.ConnectionState.Open)
                    {
                        await connection.OpenAsync();
                    }

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = @"
                     SELECT Status FROM portal_userpolicylist
                       WHERE Id = @id ";
                        var param = command.CreateParameter();
                        param.ParameterName = "@id";
                        param.Value = id;
                        command.Parameters.Add(param);

                        using (var read = await command.ExecuteReaderAsync())
                        {
                            if (await read.ReadAsync())
                            {
                                status = read["Status"].ToString();
                            }
                        }
                    }

                    status = status == "Active" ? "Inactive" : "Active";


                    using (var updateCmd = connection.CreateCommand())
                    {
                        updateCmd.CommandText = @"
                    UPDATE portal_userpolicylist
                    SET Status = @status
                    WHERE Id = @policyId ";

                        var updateId = updateCmd.CreateParameter();
                        updateId.ParameterName = "@policyId";
                        updateId.Value = id;
                        updateCmd.Parameters.Add(updateId);


                        var updateStatus = updateCmd.CreateParameter();
                        updateStatus.ParameterName = "@status";
                        updateStatus.Value = status;
                        updateCmd.Parameters.Add(updateStatus);


                        await updateCmd.ExecuteNonQueryAsync();

                    }
                    return true;
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }


        public async Task<bool> DeletePolicy(int id)
        {
            try
            {
                using var connection = _context.Database.GetDbConnection();
                if (connection.State != System.Data.ConnectionState.Open)
                {
                    await connection.OpenAsync();
                }

                using var command = connection.CreateCommand();
                command.CommandText = @"
                    DELETE FROM portal_userpolicylist
                    WHERE Id = @id";

                var param = command.CreateParameter();
                param.ParameterName = "@id";
                param.Value = id;
                command.Parameters.Add(param);

                var rowsAffected = await command.ExecuteNonQueryAsync();
                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting policy: {ex.Message}");
                return false;
            }
        }


        public async Task<int> TotalPremium(string userid) {

            try
            {
                using var connection = _context.Database.GetDbConnection();
                if (connection.State != System.Data.ConnectionState.Open)
                {
                    await connection.OpenAsync();
                }

                using var command = connection.CreateCommand();
                command.CommandText = @"
                     SELECT SUM(UniquePremiums.TotalPremium) 
                        FROM (
                            SELECT mp.PolicyNumber, MAX(mp.TotalPremium) AS TotalPremium
                            FROM masterpolicy mp
                            JOIN portal_userpolicylist pupl ON mp.PolicyNumber = pupl.PolicyNumber
                            WHERE pupl.UserId = @id
                            GROUP BY mp.PolicyNumber
                        ) AS UniquePremiums";

                var param = command.CreateParameter();
                param.ParameterName = "@id";
                param.Value = userid;
                command.Parameters.Add(param);

                var totalPremium = await command.ExecuteScalarAsync();
                if (totalPremium == DBNull.Value || totalPremium == null)
                {
                    return 0;
                }
                return (int)Math.Round((decimal)totalPremium);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error : {ex.Message}");
                return 0;
            }
        }





    }
}
