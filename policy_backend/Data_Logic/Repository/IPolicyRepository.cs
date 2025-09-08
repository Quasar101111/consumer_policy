
namespace Data_Logic.Repository
{
    public interface IPolicyRepository
    {
        Task<int> AddPolicy(string policyno, string userid);
        Task<int> CheckChassisExists(string chassisno);
        Task<int> CheckPolicyExists(string policyno);
        Task<int> CheckPolicyVehicleExists(string policyno, string chassisno);
        Task<bool> DeletePolicy(int id);
        Task<object> GetBasicDetails(string policyno, string chassisno);
        Task<string> GetUserId(string username);
        Task<int> PoliciesCount();
        Task<bool> ToggleStatus(int id);
        Task<int> TotalPremium(string userid);
        Task<List<string>> ViewPolicyNumber(string userid);
    }
}