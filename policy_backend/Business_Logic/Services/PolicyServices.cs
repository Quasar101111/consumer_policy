using Data_Logic.Repository;
using System;
using System.Threading.Tasks;

namespace Business_Logic.Services
{
    public class PolicyServices 
    {
        private readonly PolicyRepository _repository;

        public PolicyServices(PolicyRepository repository)
        {
            _repository = repository;
        }

        public async Task<object> FindPolicy(string policyno, string chassisno)
        {
            int policyExists = await _repository.CheckPolicyExists(policyno);
            int chassisExists = await _repository.CheckChassisExists(chassisno);
            int policyVehicleExists = await _repository.CheckPolicyVehicleExists(policyno, chassisno);

            if (policyExists == 0 && chassisExists == 0)
                return new { Message = "Policy and vehicle not found" };

            if (policyExists == 0)
                return new { Message = "Policy not found" };

            if (chassisExists == 0)
                return new { Message = "Vehicle not found" };

            if (policyVehicleExists == 0)
                return new { Message = "Policy and vehicle do not match" };

            return await _repository.GetBasicDetails(policyno, chassisno);
        }
    }
}
