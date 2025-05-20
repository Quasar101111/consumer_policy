using Data_Logic.Repository;
using System;
using System.Threading.Tasks;

namespace Business_Logic.Services
{
    public class PolicyServices 
    {
        private readonly PolicyRepository _repository;
        private readonly UserRepository _userRepository;

        public PolicyServices(PolicyRepository repository, UserRepository userRepository)
        {
            _repository = repository;
            _userRepository = userRepository;
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

        public async Task<object> AddUserPolicy(string policyno, string username) { 
            var userid= await _userRepository.GetUserIds(username);
            if (userid == null) {
                return new { Message = "Username not found" };
            }
            
                var result = await _repository.AddPolicy(policyno, userid);
                if (result == 1)
                {
                    return new { Message = "Policy is added " };
                }

                else if (result == 2)
                {
                    return new { Message = "Already Added" };
                }
                else
                {
                    return new { Message = "Failed to add policy. Try again." };
                }


        }
           
        
    }
}
