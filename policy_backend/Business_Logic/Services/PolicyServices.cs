using Data_Logic.Model;
using Data_Logic.Repository;

using System;
using System.Threading.Tasks;


namespace Business_Logic.Services
{
    public class PolicyServices : IPolicyServices
    {
        private readonly IPolicyRepository _repository;
        private readonly IUserRepository _userRepository;
        private readonly IPolicyViewRepository _policyViewRepository;


        public PolicyServices(IPolicyRepository repository, IUserRepository userRepository, IPolicyViewRepository policyViewRepository)
        {
            _repository = repository;
            _userRepository = userRepository;
            _policyViewRepository = policyViewRepository;
        }

        public async Task<object> FindPolicy(string policyno, string chassisno)
        {
            int policyExists = await _repository.CheckPolicyExists(policyno);
            int chassisExists = await _repository.CheckChassisExists(chassisno);
            int policyVehicleExists = await _repository.CheckPolicyVehicleExists(policyno, chassisno);



            if (policyExists == 0 || chassisExists == 0)
                return new { Message = "Policy  or Vehicle not found" };


            if (policyVehicleExists == 0)
                return new { Message = "Policy and vehicle do not match" };

            return await _repository.GetBasicDetails(policyno, chassisno);
        }

        public async Task<object> AddUserPolicy(string policyno, string username)
        {
            var userid = await _userRepository.GetUserIds(username);
            if (userid == null)
            {
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

        public async Task<(bool success, string? message, List<string>? result)> ViewPolicyNo(string username)
        {
            var userid = await _userRepository.GetUserIds(username);

            var result = await _repository.ViewPolicyNumber(userid);


            if (result == null || !result.Any())
            {
                return (false, "No policies found for this user", null);
            }
            return (true, null, result);
        }

        public async Task<(bool success, List<PolicyInfo>? result)> GetPolicyNumbersWithStatus(string username)
        {
            var userId = await _userRepository.GetUserIds(username);

            var result = await _policyViewRepository.GetPolicyNumbersWithStatus(userId);

            if (result == null || result.Count == 0)
            {
                return (false, null);
            }

            return (true, result);
        }

        public async Task<bool> ToggleStatus(int id)
        {
            var result = await _repository.ToggleStatus(id);
            if (!result)
            { return false; }
            return result;

        }


        public async Task<bool> DeletePolicy(int id)
        {
            var result = await _repository.DeletePolicy(id);
            return result;
        }

        public async Task<object> PolicyDetails(string policyNumber)
        {

            var res1 = await _policyViewRepository.PolicyHolderDetails(policyNumber);
            var res2 = await _policyViewRepository.PolicyDetails(policyNumber);
            var res3 = await _policyViewRepository.CoverageDetails(policyNumber);
            var res4 = await _policyViewRepository.VehicleDetails(policyNumber);

            return new
            {
                policyholder = res1,
                PolicyDetails = res2,
                coverageDetails = res3,
                vehicleDetails = res4
            };

        }

        public async Task<int> TotalPremium(string username) {
            var userid = await _userRepository.GetUserIds(username);

            if (userid == null)
                { return 0; }
            var result = await _repository.TotalPremium(userid);
            Console.WriteLine(result);
            return result;


        }



    }
}
