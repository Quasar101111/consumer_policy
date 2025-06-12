using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data_Logic;
using Data_Logic.Model;
using Microsoft.EntityFrameworkCore;

namespace Data_Logic.Repository
{
   

    public class PolicyViewRepository
    {

        private readonly ApplicationDbContext _context;
       

        public PolicyViewRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PolicyInfo>> GetPolicyNumbersWithStatus(string userId)
        {
            var results = new List<PolicyInfo>();

            var connection = _context.Database.GetDbConnection();
            if (connection.State != System.Data.ConnectionState.Open)
                await connection.OpenAsync();

            using (var cmd = connection.CreateCommand())
            {
                cmd.CommandText = @"SELECT Id,PolicyNumber, Status FROM portal_userpolicylist WHERE UserId = @p1";
                var param = cmd.CreateParameter();
                param.ParameterName = "@p1";
                param.Value = userId;
                cmd.Parameters.Add(param);

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        results.Add(new PolicyInfo
                        {
                            PolicyId = Convert.ToInt32(reader["Id"]),                           
                            PolicyNumber = reader["PolicyNumber"]?.ToString() ?? "",
                            Status = reader["Status"]?.ToString() ?? ""
                        });
                    }
                }
            }

            return results;
        }


        public async Task<object> PolicyHolderDetails(string policyno)
        {

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

        public async Task<object> PolicyDetails(string policyno)
        {

            object policyDetails = null;
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
                            mp.PolicyNumber,mp.PolicyEffectiveDt,mp.PolicyExpirationDt,mp.Term,mp.PolicyStatus,mp.TotalPremium,pp.PayPlan
                        FROM masterpolicy mp
                        LEFT JOIN payplan pp ON mp.PayPlanId = pp.PayPlanId
                        WHERE mp.PolicyNumber = @p1;
                    ";
                    var param = readCmd.CreateParameter();
                    param.ParameterName = "@p1";
                    param.Value = policyno;
                    readCmd.Parameters.Add(param);


                    using (var reader = await readCmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            policyDetails = new
                            {

                                PolicyNumber = reader["PolicyNumber"]?.ToString(),
                                PolicyEffectiveDt = reader["PolicyEffectiveDt"] as DateTime?,
                                PolicyExpirationDt = reader["PolicyExpirationDt"] as DateTime?,
                                Term = reader["Term"]?.ToString(),
                                Status = reader["PolicyStatus"]?.ToString(),
                                TotalPremium = reader["TotalPremium"] as decimal?,
                                PayPlan = reader["PayPlan"]?.ToString(),


                            };
                        }
                    }
                }
                return policyDetails;


            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;

            }

        }


        public async Task<object> CoverageDetails(string policyno)
        {

            object coverageDetails = null;
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
                      SELECT c.Description FROM masterpolicycoverage pc JOIN coverages c ON pc.CoverageId = c.CoverageId
                        WHERE pc.PolicyNumber = @p1;
                    ";
                    var param = readCmd.CreateParameter();
                    param.ParameterName = "@p1";
                    param.Value = policyno;
                    readCmd.Parameters.Add(param);


                    using (var reader = await readCmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            coverageDetails = new
                            {

                                Description = reader["Description"]?.ToString(),
                                


                            };
                        }
                    }
                }
                return coverageDetails;


            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;

            }

        }

        public async Task<object> VehicleDetails(string policyno)
        {

            object vehicleDetails = null;
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
                mv.PolicyNumber,vt.VehicleType, r.RTOName,r.City,r.State,mv.RegistrationNumber,mv.DateOfPurchase,b.Brand,m.modelname AS ModelName,v.Variant
                ,bt.BodyType,ft.FuelType,mv.TransmissionTypeId , mv.Color,mv.ChasisNumber,mv.EngineNumber,mv.CubicCapacity,mv.SeatingCapacity,mv.YearOfManufacture
                ,mv.IDV,tt.Description as Transmission_Type, mv.ExShowroomPrice
            FROM mastervehicle mv
            LEFT JOIN vehicletype vt ON mv.VehicleTypeId = vt.VehicleTypeId
            LEFT JOIN rto r ON mv.RTOId = r.RTOId
            LEFT JOIN brand b ON mv.BrandId = b.BrandId
            LEFT JOIN model m ON mv.ModelId = m.ModelId
            LEFT JOIN variant v ON mv.VariantId = v.VariantId
            left join transmissiontype tt on mv.TransmissionTypeId = tt.TransmissionTypeId
            LEFT JOIN bodytype bt ON mv.BodyTypeId = bt.BodyTypeId
            LEFT JOIN fueltype ft ON mv.FuelTypeId = ft.FuelTypeId
            WHERE mv.PolicyNumber = @p1;
                    ";
                    var param = readCmd.CreateParameter();
                    param.ParameterName = "@p1";
                    param.Value = policyno;
                    readCmd.Parameters.Add(param);


                    using (var reader = await readCmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            vehicleDetails = new
                            {
                                PolicyNumber = reader["PolicyNumber"]?.ToString(),
                                VehicleType = reader["VehicleType"]?.ToString(),
                                RTOName = reader["RTOName"]?.ToString(),
                                City = reader["City"]?.ToString(),
                                State = reader["State"]?.ToString(),
                                RegistrationNumber = reader["RegistrationNumber"]?.ToString(),
                                DateOfPurchase = reader["DateOfPurchase"] as DateTime?,
                                Brand = reader["Brand"]?.ToString(),
                                ModelName = reader["ModelName"]?.ToString(),
                                Variant = reader["Variant"]?.ToString(),
                                BodyType = reader["BodyType"]?.ToString(),
                                FuelType = reader["FuelType"]?.ToString(),
                                TransmissionTypeId = reader["TransmissionTypeId"]?.ToString(),
                                TransmissionType = reader["Transmission_Type"]?.ToString(),
                                Color = reader["Color"]?.ToString(),
                                ChasisNumber = reader["ChasisNumber"]?.ToString(),
                                EngineNumber = reader["EngineNumber"]?.ToString(),
                                CubicCapacity = reader["CubicCapacity"] as int?,
                                SeatingCapacity = reader["SeatingCapacity"] as int?,
                                YearOfManufacture = reader["YearOfManufacture"] as int?,
                                IDV = reader["IDV"] as decimal?,
                                ExShowroomPrice = reader["ExShowroomPrice"] as decimal?




                            };
                        }
                    }
                }
                return vehicleDetails;


            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;

            }

        }


    }


}

