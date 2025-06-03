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
                cmd.CommandText = @"SELECT PolicyNumber, Status FROM portal_userpolicylist WHERE UserId = @p1";
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
                            PolicyNumber = reader["PolicyNumber"]?.ToString() ?? "",
                            Status = reader["Status"]?.ToString() ?? ""
                        });
                    }
                }
            }

            return results;
        }


    }


}

