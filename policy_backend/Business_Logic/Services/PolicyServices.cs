using Microsoft.EntityFrameworkCore;
using Data.Repository;
using System;
using System.Threading.Tasks;

namespace Business_Logic.Services
{
    public class PolicyServices
    {
        private readonly Repository _repository;

        public PolicyServices(Repository repository)
        {
            _repository = repository;
        }

        public async Task<object> FindPolicyAsync(string policyno, string chassisno)
        {
            int policyExists = await _repository.GetPolicyCountAsync(policyno);
            int chassisExists = await _repository.GetChassisCountAsync(chassisno);
            int policyVehicleExists = await _repository.GetPolicyVehicleCountAsync(policyno, chassisno);

            if (policyExists == 0 && chassisExists == 0)
                return new { Message = "Policy and vehicle not found" };

            if (policyExists == 0)
                return new { Message = "Policy not found" };

            if (chassisExists == 0)
                return new { Message = "Vehicle not found" };

            if (policyVehicleExists == 0)
                return new { Message = "Policy and vehicle do not match" };

            return await _repository.GetBasicDetailsAsync(policyno, chassisno);
        }
    }
}