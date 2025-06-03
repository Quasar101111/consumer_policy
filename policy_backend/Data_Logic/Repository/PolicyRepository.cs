
using Microsoft.EntityFrameworkCore;
using System;
using System.Data.Common;
using System.Threading.Tasks;


using Data_Logic;
using Data_Logic.Models;

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
                command.CommandText = @"SELECT RegistrationNumber,DateOfPurchase,ExShowroomPrice
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
                command.CommandText = @"SELECT PolicyEffectiveDt,PolicyExpirationDt,TotalPremium
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

                            var updateUserParam = updateCmd.CreateParameter();
                            updateUserParam.ParameterName = "@userId";
                            updateUserParam.Value = userid;
                            updateCmd.Parameters.Add(updateUserParam);

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

        public async Task<List<string>> ViewPolicyNumber(string userid) {
            try
            {
                var connection = _context.Database.GetDbConnection();
                if (connection.State != System.Data.ConnectionState.Open)
                {
                    await connection.OpenAsync();
                }

                var policyNumbers = new List<string>();


                using (var readCmd = connection.CreateCommand()) {

                    readCmd.CommandText = @"
                        SELECT PolicyNumber FROM portal_userpolicylist
                        WHERE UserId = @p1
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
            catch (Exception ex) { 
                Console.WriteLine(ex.Message);
                throw;
                
            }
        }

        public async Task<object> PolicyHolderDetails(string policyno) {

            object policyHolder = null;
            try
            {
                var connection = _context.Database.GetDbConnection();
                if (connection.State != System.Data.ConnectionState.Open)
                {
                    await connection.OpenAsync();
                }

                


                using (var readCmd = connection.CreateCommand())
                {

                    readCmd.CommandText = @"
                       SELECT 
                        mc.FirstName,mc.LastName,mc.AddressLine1,mc.AddressLine2,mc.City,mc.State,mc.Pincode,mc.MobileNo,mc.Email,
                        mi.AadharNumber,mi.LicenseNumber,mi.PANNumber,mi.AccountNumber,mi.IFSCCode,mi.BankName,mi.BankAddress
                        FROM masterinsured mi
                        JOIN mastercontact mc ON mi.MasterContactId = mc.MasterContactId WHERE mi.PolicyNumber=@p1;
                    ";
                    var param = readCmd.CreateParameter();
                    param.ParameterName = "@p1";
                    param.Value = policyno;
                    readCmd.Parameters.Add(param);


                    using (var reader = await readCmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            policyHolder = new
                            {
                                FirstName = reader["FirstName"].ToString(),
                                LastName = reader["LastName"].ToString(),
                                AddressLine1 = reader["AddressLine1"].ToString(),
                                AddressLine2 = reader["AddressLine2"].ToString(),
                                City = reader["City"].ToString(),
                                State = reader["State"].ToString(),
                                Pincode = reader["Pincode"].ToString(),
                                MobileNo = reader["MobileNo"].ToString(),
                                Email = reader["Email"].ToString(),
                                AadharNumber = reader["AadharNumber"].ToString(),
                                LicenseNumber = reader["LicenseNumber"].ToString(),
                                PANNumber = reader["PANNumber"].ToString(),
                                AccountNumber = reader["AccountNumber"].ToString(),
                                IFSCCode = reader["IFSCCode"].ToString(),
                                BankName = reader["BankName"].ToString(),
                                BankAddress = reader["BankAddress"].ToString(),
                                RegistrationNumber = reader["RegistrationNumber"].ToString(),
                                DateOfPurchase = Convert.ToDateTime(reader["DateOfPurchase"]).Date,
                                ExShowroomPrice = Convert.ToDecimal(reader["ExShowroomPrice"])

                            };
                        }
                    }
                }
                return policyHolder;


            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;

            }

        }

        

    }
}
